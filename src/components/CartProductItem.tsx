import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Components
import { QtyOption } from './QtyOption'

// Action
import * as cartActions from '../redux/actions/cartActions'
import * as notificationsActions from '../redux/actions/notificationsActions'

// Utils
import { get } from 'lodash'
import i18n from '../utils/i18n'
import { getImagePath, isPriceIncludesTax } from '../utils'
import { formatPrice } from '../utils'

const styles = StyleSheet.create({
  productItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F1F1F1',
    flexDirection: 'row',
    padding: 14,
    width: '100%',
    overflow: 'hidden'
  },
  productItemImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain'
  },
  productItemDetail: {
    marginLeft: 14,
    marginRight: 14,
    width: '70%'
  },
  productItemName: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
    textAlign: 'left',
    fontWeight: 'bold'
  },
  productItemPrice: {
    fontSize: 11,
    color: 'black',
    textAlign: 'left'
  },
  qtyContainer: {
    position: 'absolute',
    right: 14,
    bottom: 0
  }
})

const CartProductItem = ({ cartActions, item, cart }) => {
  const handleChangeAmountRequest = (item, amount) => {
    const newItem = { ...item, amount, coupons: cart.coupons }
    cartActions.change(newItem.cartId, newItem)
  }

  const handleRemoveProduct = product => {
    cartActions.remove(product.cartId, cart.coupons)
  }

  let productImage = null
  const imageUri = getImagePath(item)
  if (imageUri) {
    productImage = (
      <Image source={{ uri: imageUri }} style={styles.productItemImage} />
    )
  }

  const swipeoutBtns = [
    {
      text: i18n.t('Delete'),
      type: 'delete',
      onPress: () => handleRemoveProduct(item)
    }
  ]

  const QtyOptionHandler = (value: number) => {
    if (
      value <= parseInt(item.in_stock, 10) ||
      item.out_of_stock_actions === 'B'
    ) {
      cartActions.changeAmount(item.cartId, value, item.company_id)
      handleChangeAmountRequest(item, value)
    } else {
      notificationsActions.show({
        type: 'warning',
        title: i18n.t('Notice'),
        text: i18n.t(
          'The number of products in the inventory is not enough for your order. The quantity of the product {{product}} in your cart has been reduced to {{count}}.',
          {
            product: item.product,
            count: item.amount
          }
        )
      })
    }
  }

  const step = parseInt(item.qty_step, 10) || 1
  const max = parseInt(item.max_qty, 10) || parseInt(item.in_stock, 10)
  const min = parseInt(item.min_qty, 10) || step
  const initialValue = parseInt(item.amount, 10)
  const productTaxedPrice = get(item, 'display_price_formatted.price', '')
  const productPrice =
    productTaxedPrice || get(item, 'price_formatted.price', '')
  const showTaxedPrice = isPriceIncludesTax(item)

  return (
    <View style={styles.productItem}>
      {productImage}
      <View style={styles.productItemDetail}>
        <Text style={styles.productItemName} numberOfLines={1}>
          {item.product}
        </Text>
        <Text style={styles.productItemPrice}>
          {`${item.amount} x ${formatPrice(productPrice)}`}
          {showTaxedPrice && (
            <Text style={styles.smallText}>
              {` (${i18n.t('Including tax')})`}
            </Text>
          )}
        </Text>
      </View>
      <View style={styles.qtyContainer}>
        {!item.exclude_from_calculate && (
          <QtyOption
            max={max}
            min={min}
            initialValue={initialValue}
            step={step}
            onChange={(value: number) => QtyOptionHandler(value)}
          />
        )}
      </View>
    </View>
  )
}

export default connect(
  state => ({
    cart: state.cart
  }),
  dispatch => ({
    cartActions: bindActionCreators(cartActions, dispatch)
  })
)(CartProductItem)
