import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  I18nManager
} from 'react-native'
import { get } from 'lodash'
import { filterObject } from '../utils/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { cloneDeep } from 'lodash'
import theme from '../config/theme'
import { SwipeListView } from 'react-native-swipe-list-view'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

// Components
import CartProductitem from './CartProductItem'
import CartFooter from './CartFooter'
import EmptyCart from './EmptyCart'
import CouponCodeSection from './CouponCodeSection'

// Utils
import i18n from '../utils/i18n'
import { formatPrice } from '../utils'

// Actions
import * as stepsActions from '../redux/actions/stepsActions'
import * as cartActions from '../redux/actions/cartActions'

const styles = StyleSheet.create({
  cartContainer: {
    marginBottom: 75
  },
  couponContainer: {
    marginTop: 10
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%'
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  totalWrapper: {
    marginTop: 6,
    marginLeft: 20,
    marginRight: 20
  },
  totalText: {
    textAlign: 'right',
    marginTop: 4,
    color: '#979797'
  },
  totalDiscountText: {
    textAlign: 'right',
    marginTop: 4,
    color: theme.$dangerColor
  },
  backTextWhite: {
    color: '#FFF'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    height: 120,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75
  },
  backRightBtnRight: {
    backgroundColor: 'tomato',
    right: 0
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})

const renderOrderDetail = (products, cart) => {
  if (!products.length) {
    return null
  }

  const isFormattedDiscount = !!get(cart, 'subtotal_discount', '')
  const formattedDiscount = get(cart, 'subtotal_discount_formatted.price', '')
  const isIncludingDiscount = !!get(cart, 'discount', '')
  const includingDiscount = get(cart, 'discount_formatted.price', '')

  return (
    <View style={styles.totalWrapper}>
      <View style={styles.priceContainer}>
        <Text style={styles.totalText}>{`${i18n.t('Subtotal')}: `}</Text>
        <Text style={styles.totalText}>
          {formatPrice(get(cart, 'subtotal_formatted.price', ''))}
        </Text>
      </View>
      {isIncludingDiscount && (
        <View style={styles.priceContainer}>
          <Text style={styles.totalDiscountText}>{`${i18n.t(
            'Including discount'
          )}: -`}</Text>
          <Text style={styles.totalDiscountText}>
            {formatPrice(includingDiscount)}
          </Text>
        </View>
      )}
      {isFormattedDiscount && (
        <View style={styles.priceContainer}>
          <Text style={styles.totalDiscountText}>{`${i18n.t(
            'Order discount'
          )}: -`}</Text>
          <Text style={styles.totalDiscountText}>
            {formatPrice(formattedDiscount)}
          </Text>
        </View>
      )}
      <View style={styles.priceContainer}>
        <Text style={styles.totalText}>{`${i18n.t('Shipping')}: `}</Text>
        <Text style={styles.totalText}>
          {formatPrice(get(cart, 'shipping_cost_formatted.price', ''))}
        </Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.totalText}>{`${i18n.t('Taxes')}: `}</Text>
        <Text style={styles.totalText}>
          {formatPrice(get(cart, 'tax_subtotal_formatted.price', ''))}
        </Text>
      </View>
    </View>
  )
}

export const CartProductList = ({
  storeCart,
  cart,
  auth,
  handleRefresh,
  refreshing,
  cartActions,
  stepsActions,
  stateSteps,
  navigation
}) => {
  if (!cart) {
    return <EmptyCart />
  }

  const shippingId = cart.chosen_shipping[0]
  const coupons = Object.keys(cart.coupons)
  const newProducts = Object.keys(cart.products).map(key => {
    const result = { ...cart.products[key] }
    result.cartId = key
    return result
  })

  const handlePlaceOrder = async (auth, cart) => {
    const newCartProducts = filterObject(
      cart.products,
      p => !p.extra.exclude_from_calculate
    )
    const newCart = JSON.parse(JSON.stringify(cart))
    newCart.products = { ...newCartProducts }

    const checkoutFlow = JSON.parse(
      JSON.stringify(stateSteps.flows.checkoutFlow)
    )

    newCart.isShippingRequired = false

    newCart.product_groups.forEach(productGroup => {
      if (
        !productGroup.all_edp_free_shipping &&
        !productGroup.shipping_no_required &&
        Object.keys(productGroup.shippings).length
      ) {
        productGroup.isShippingRequired = true
        newCart.isShippingRequired = true
      } else {
        productGroup.isShippingRequired = false
      }
      if (
        !productGroup.shipping_no_required &&
        !Object.keys(productGroup.shippings).length
      ) {
        productGroup.isShippingForbidden = true
        productGroup.isShippingRequired = true
        newCart.isShippingRequired = true
      }
    })

    // Set the flow, filter steps and define the first step.
    const startStep = stepsActions.setFlow('checkoutFlow', checkoutFlow, {
      newProducts,
      newCart
    })

    navigation.navigate(startStep.screenName, {
      newProducts,
      cart: newCart,
      currentStep: startStep
    })
  }

  const handleRemoveProduct = product => {
    cartActions.remove(product.cartId, cart.coupons)
  }

  const renderPlaceOrder = (cart, products, auth) => {
    if (!products.length) {
      return null
    }
    return (
      <CartFooter
        totalPrice={formatPrice(cart.total_formatted.price)}
        btnText={i18n.t('Checkout').toUpperCase()}
        onBtnPress={() => handlePlaceOrder(auth, cart)}
      />
    )
  }

  const renderCouponCodeSection = () => {
    return (
      <CouponCodeSection
        items={coupons}
        onAddPress={value => {
          cartActions.addCoupon(
            value,
            cart.vendor_id,
            shippingId,
            JSON.parse(JSON.stringify(storeCart.coupons))
          )
        }}
        onRemovePress={value => {
          const newCoupons = {}
          if (storeCart.coupons.general) {
            const { [value]: _, ...filteredCoupons } = storeCart.coupons.general
            newCoupons.general = cloneDeep(filteredCoupons)
          } else {
            const { [value]: _, ...filteredCoupons } =
              storeCart.coupons[cart.vendor_id]
            newCoupons[cart.vendor_id] = cloneDeep(filteredCoupons)
          }

          cartActions.removeCoupon(newCoupons)
          setTimeout(() => {
            cartActions.recalculateTotal(shippingId, newCoupons, cart.vendor_id)
          }, 1400)
        }}
      />
    )
  }

  const renderHiddenItem = (rowData, rowMap) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => {
            handleRemoveProduct(rowData.item)
            rowMap[rowData.item.product_id].closeRow()
          }}>
          <Text style={styles.backTextWhite}>{i18n.t('Delete')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const renderItem = item => {
    return <CartProductitem item={item} cartActions={cartActions} />
  }

  return (
    <>
      <KeyboardAwareScrollView enableResetScrollToCoords={false} style={styles.cartContainer}>
        <SwipeListView
          data={newProducts}
          renderItem={({ item }) => renderItem(item)}
          renderHiddenItem={renderHiddenItem}
          leftOpenValue={I18nManager.isRTL ? 75 : 1}
          rightOpenValue={I18nManager.isRTL ? -1 : -75}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          disableRightSwipe={I18nManager.isRTL ? false : true}
          disableLeftSwipe={I18nManager.isRTL ? true : false}
          scrollEnabled={false}
          nestedScrollEnabled={false}
          keyExtractor={item => item.product_id}
        />
        <View style={styles.couponContainer}>
          {renderCouponCodeSection()}
          {renderOrderDetail(newProducts, cart)}
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.footerContainer}>
        {renderPlaceOrder(cart, newProducts, auth)}
      </View>
    </>
  )
}

export default connect(
  state => ({
    stateSteps: state.steps,
    storeCart: state.cart
  }),
  dispatch => ({
    stepsActions: bindActionCreators(stepsActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch)
  })
)(CartProductList)
