import React, { useEffect, useState, useCallback } from 'react'
import { bindActionCreators } from 'redux'
import { connect, useSelector, useDispatch } from 'react-redux'
import Icon from 'react-native-vector-icons/Ionicons'
import config from '../config'
import theme from '../config/theme'
import { v4 as uuidv4 } from 'uuid'
import {
  VERSION_MVE,
  OPTION_TYPE_CHECKBOX,
  OPTION_TYPE_TEXT,
  OPTION_TYPE_TEXT_AREA,
  OPTION_IS_REQUIRED,
  BUY_IN_ADVANCE,
  REPORT_TYPE_PRODUCT
} from '../constants'
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Share,
  I18nManager
} from 'react-native'

// Utils
import { formatPrice, isPriceIncludesTax, stripTags } from '../utils'
import { toInteger, get, isEmpty } from 'lodash'
import i18n from '../utils/i18n'

// Import actions.
import * as productsActions from '../redux/actions/productsActions'
import * as wishListActions from '../redux/actions/wishListActions'
import * as cartActions from '../redux/actions/cartActions'
import * as vendorActions from '../redux/actions/vendorActions'

// Components
import { ProductFeaturesList } from '../components/ProductFeaturesList'
import { ProductDetailOptions } from '../components/ProductDetailOptions'
import ProductImageSwiper from '../components/ProductImageSwiper'
import { AddToCartButton } from '../components/AddToCartButton'
import DiscussionList from '../components/DiscussionList'
import StarsRating from '../components/StarsRating'
import ReviewsBlock from '../components/ReviewsBlock'
import InAppPayment from '../components/InAppPayment'
import { QtyOption } from '../components/QtyOption'
import { Seller } from '../components/Seller'
import Section from '../components/Section'
import Spinner from '../components/Spinner'
import DetailDescription from '../components/DetailDescription'
import { QuantityDiscounts } from '../components/QuantityDiscounts'
import { ProductScreenBlocks } from '../components/ProductScreenBlocks'

import * as notificationsActions from '../redux/actions/notificationsActions'

const RATING_STAR_SIZE = 14
const PRODUCT_IS_DOWNLOADABLE = 'Y'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  },
  scrollContainer: {
    paddingHorizontal: I18nManager.isRTL
      ? theme.$containerPadding / 2
      : theme.$containerPadding,
    marginLeft: I18nManager.isRTL ? theme.$containerPadding : 0
  },
  descriptionBlock: {
    paddingTop: 10,
    paddingBottom: 10
  },
  nameText: {
    fontSize: 18,
    color: theme.$darkColor,
    marginBottom: 5,
    textAlign: 'left'
  },
  starsRatingWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  ratingCountText: {
    color: '#8F8F8F',
    marginLeft: 10
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.$darkColor,
    textAlign: 'left'
  },
  smallText: {
    fontSize: 13,
    fontWeight: 'normal',
    color: theme.$darkColor
  },
  outOfStockText: {
    color: theme.$dangerColor,
    fontSize: 16,
    fontWeight: '500'
  },
  priceWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5
  },
  listPriceText: {
    textDecorationLine: 'line-through',
    textDecorationColor: 'red',
    color: theme.$darkColor,
    textAlign: 'left',
    marginLeft: 10
  },
  listPriceWrapperText: {
    textAlign: 'left'
  },
  promoText: {
    marginBottom: 10
  },
  descText: {
    color: theme.$discussionMessageColor,
    textAlign: 'justify'
  },
  addToCartContainerWrapper: {
    shadowColor: '#45403a',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    borderTopWidth: Platform.OS === 'android' ? 1 : null,
    borderColor: '#d9d9d9'
  },
  addToCartContainer: {
    padding: 14,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  wrapperStyle: {
    padding: 0,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 20
  },
  sectionBtn: {
    paddingTop: 12,
    paddingBottom: 6
  },
  sectionBtnText: {
    color: theme.$buttonWithoutBackgroundTextColor,
    fontSize: 14,
    textAlign: 'left'
  },
  vendorWrapper: {
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 10
  },
  vendorName: {
    fontSize: 14,
    textAlign: 'left',
    marginRight: 100,
    color: theme.$darkColor
  },
  vendorProductCount: {
    fontSize: 11,
    color: 'gray',
    marginBottom: 13,
    textAlign: 'left'
  },
  vendorDescription: {
    color: 'gray',
    textAlign: 'left'
  },
  rating: {
    marginLeft: -10,
    marginRight: -10,
    marginBottom: 5
  },
  keyboardAvoidingContainer: {
    marginBottom: Platform.OS === 'ios' ? 122 : 132
  },
  listDiscountWrapper: {
    backgroundColor: theme.$productDiscountColor,
    position: 'absolute',
    top: 4,
    right: 4,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: 2
  },
  listDiscountText: {
    color: '#fff'
  },
  inAppPaymentWrapper: {
    flex: 2,
    marginRight: 10
  },
  zeroPrice: {
    paddingTop: 10
  },
  minQtyNoticeText: {
    color: theme.$mediumGrayColor,
    marginBottom: 10
  },
  productInStockText: {
    color: theme.$mediumGrayColor,
    marginBottom: 10
  }
})

export const ProductDetail = ({
  route,
  productsActions,
  wishListActions,
  vendorActions,
  cartActions,
  discussion,
  auth,
  cart,
  settings,
  navigation
}) => {
  const { hideWishList } = route.params
  const [product, setProduct] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [amount, setAmount] = useState(1)
  const [vendor, setVendor] = useState(null)
  const wishList = useSelector(state => state.wishList)
  const wishListIsEnabled = useSelector(
    state => state.settings.wishlistAddon.isEnabled
  )
  const dispatch = useDispatch()
  const productScreenBlocks = useSelector(state => state.products.blocks)

  const fetchDataAndSetHeaderOptions = useCallback(
    async currentPid => {
      setIsLoading(true)
      const currentProduct = await productsActions.fetch(currentPid)
      const currentVendor = await vendorActions.fetch(currentProduct.company_id)
      const step = parseInt(currentProduct.qty_step, 10) || 1
      await productsActions.fetchBlocks(currentPid)

      navigation.setOptions({
        title: currentProduct.product,
        headerShown: true
      })

      setAmount(step)
      setVendor(currentVendor)
      setProduct(currentProduct)
      setIsLoading(false)
    },
    [productsActions, vendorActions]
  )

  // Fetching data and setting header title.
  useEffect(() => {
    fetchDataAndSetHeaderOptions(route.params.pid)
  }, [])

  useEffect(() => {
    const setHeaderIcons = product => {
      if (
        product &&
        !hideWishList &&
        !product?.isProductOffer &&
        wishListIsEnabled
      ) {
        return (
          <>
            {setWishListIcon(product)}
            {setShareIcon(product)}
          </>
        )
      }

      return setShareIcon(product)
    }

    // Renders wishlist icon and changes its color if it is needed.
    const setWishListIcon = product => {
      const isProductInWishList = wishList.items.some(
        item => parseInt(item.product_id, 10) === product.product_id
      )

      return (
        <Icon.Button
          onPress={() => handleAddToWishList(product)}
          name={isProductInWishList ? 'heart' : 'heart-outline'}
          size={25}
          activeOpacity={1}
          backgroundColor={theme.$navBarBackgroundColor}
          borderRadius={0}
          color={
            isProductInWishList
              ? theme.$buttonWithoutBackgroundTextColor
              : theme.$navBarButtonColor
          }
        />
      )
    }

    const setShareIcon = product => {
      return (
        <Icon.Button
          onPress={() => handleShare(product)}
          name={'share-social'}
          size={25}
          activeOpacity={1}
          backgroundColor={theme.$navBarBackgroundColor}
          borderRadius={0}
          color={theme.$navBarButtonColor}
        />
      )
    }

    navigation.setOptions({
      headerRight: () => setHeaderIcons(product),
      headerTitleAlign: 'left'
    })
  }, [wishList.items, product])

  /**
   * Share function.
   */
  const handleShare = () => {
    const url = `${config.siteUrl}index.php?dispatch=products.view&product_id=${product.product_id}`
    Share.share(
      {
        message: url,
        title: product.product,
        url
      },
      {
        dialogTitle: product.product,
        tintColor: 'black'
      }
    )
  }

  const handleAddToWishList = async productOffer => {
    const productOptions = {}
    const currentProduct =
      JSON.parse(JSON.stringify(productOffer)) ||
      JSON.parse(JSON.stringify(product))

    if (!auth.logged) {
      return navigation.navigate('Login')
    }

    const isProductInWishListDefault = wishList.items.some(
      item => Number(item.product_id) === Number(currentProduct.product_id)
    )

    if (isProductInWishListDefault) {
      const removedProduct = wishList.items.filter(
        item => Number(currentProduct.product_id) === Number(item.product_id)
      )[0]

      await wishListActions.remove(removedProduct.cartId)
      return
    }

    if (
      typeof currentProduct.selectedOptions === 'object' &&
      currentProduct.selectedOptions !== null
    ) {
      // Convert product options to the option_id: variant_id array.
      Object.keys(currentProduct.selectedOptions).forEach(k => {
        productOptions[k] = currentProduct.selectedOptions[k]
        if (currentProduct.selectedOptions[k].variant_id) {
          productOptions[k] = currentProduct.selectedOptions[k].variant_id
        }
      })
    }

    const products = {
      [currentProduct.product_id]: {
        product_id: currentProduct.product_id,
        amount: currentProduct.selectedAmount || 1,
        product_options: productOptions
      }
    }

    await wishListActions.add({ products })
  }

  const changeVariationHandler = async (variantId, variantOption) => {
    const selectedVariationPid = variantOption.product_id
    const currnetVariationPid = product.selectedVariants[variantId].product_id

    if (currnetVariationPid === selectedVariationPid) {
      return null
    }

    fetchDataAndSetHeaderOptions(selectedVariationPid)
  }

  const changeOptionHandler = async (optionId, selectedOptionValue) => {
    const selectedOptionValueCopy = { ...selectedOptionValue }
    const CHECKBOX_VALUE_NO = '0'

    // If user changes required checkbox from Yes to No, sets value to required.
    if (
      product.product_options[optionId].required === 'Y' &&
      product.product_options[optionId].option_type === OPTION_TYPE_CHECKBOX &&
      selectedOptionValueCopy.position === CHECKBOX_VALUE_NO
    ) {
      selectedOptionValueCopy.variant_id = OPTION_IS_REQUIRED
    }

    const newOptions = { ...product.selectedOptions }
    const optionType = product.product_options[optionId].option_type
    if (
      optionType === OPTION_TYPE_TEXT ||
      optionType === OPTION_TYPE_TEXT_AREA
    ) {
      newOptions[optionId] = selectedOptionValue
    } else {
      newOptions[optionId] = selectedOptionValueCopy
    }
    const recalculatedProduct = await productsActions.recalculatePrice(
      product.product_id,
      newOptions
    )
    setProduct({ ...recalculatedProduct })
  }

  const renderVariationsAndOptions = () => {
    if (isEmpty(product.selectedOptions) && isEmpty(product.selectedVariants)) {
      return null
    }

    return (
      <Section
        title={i18n.t('Select')}
        wrapperStyle={styles.wrapperStyle}
        topDivider>
        <ProductDetailOptions
          options={product.convertedVariants}
          selectedOptions={product.selectedVariants}
          changeOptionHandler={changeVariationHandler}
          navigation={navigation}
        />
        <ProductDetailOptions
          options={product.convertedOptions}
          selectedOptions={product.selectedOptions}
          changeOptionHandler={changeOptionHandler}
          navigation={navigation}
        />
      </Section>
    )
  }

  const renderDiscountLabel = () => {
    if (!product.list_discount_prc && !product.discount_prc) {
      return null
    }

    const discount = product.list_discount_prc || product.discount_prc

    return (
      <View style={styles.listDiscountWrapper}>
        <Text style={styles.listDiscountText}>
          {`${i18n.t('Discount')} ${discount}%`}
        </Text>
      </View>
    )
  }

  const renderImage = () => {
    return (
      <View>
        <ProductImageSwiper navigation={navigation}>
          {product.images}
        </ProductImageSwiper>
        {renderDiscountLabel()}
      </View>
    )
  }

  const renderName = () => {
    return <Text style={styles.nameText}>{product.product}</Text>
  }

  const renderRating = () => {
    let ratingValue
    let reviewCount

    if (settings.productReviewsAddon?.isEnabled) {
      ratingValue = product.average_rating
      reviewCount = product.product_reviews_count
    } else {
      const activeDiscussion = discussion.items[`p_${product.product_id}`]
      ratingValue = activeDiscussion?.average_rating
      reviewCount = activeDiscussion?.posts.length
    }

    if (!ratingValue) {
      return null
    }

    return (
      <View style={styles.starsRatingWrapper}>
        <StarsRating
          size={RATING_STAR_SIZE}
          value={Number(ratingValue)}
          isRatingSelectionDisabled
        />
        <Text style={styles.ratingCountText}>
          {reviewCount} {i18n.t('reviews')}
        </Text>
      </View>
    )
  }

  const renderPrice = () => {
    let discountPrice = null
    let showDiscount = false

    if (product.list_discount_prc && product.discount_prc) {
      discountPrice = product.base_price_formatted.price
      showDiscount = true
    } else if (
      toInteger(product.list_price) &&
      toInteger(product.list_price) !== toInteger(product.base_price)
    ) {
      discountPrice = product.list_price_formatted.price
      showDiscount = true
    }

    const outOfStock =
      !Number(product.amount) && product.is_edp !== PRODUCT_IS_DOWNLOADABLE
    const isProductPriceZero = Math.ceil(product.price) !== 0
    const productTaxedPrice = get(product, 'taxed_price_formatted.price', '')
    const productPrice =
      productTaxedPrice || get(product, 'price_formatted.price', '')
    const showTaxedPrice = isPriceIncludesTax(product)

    if (outOfStock) {
      return <Text style={styles.outOfStockText}>{i18n.t('Out of stock')}</Text>
    }

    return (
      <View style={styles.priceWrapper}>
        {isProductPriceZero ? (
          <>
            <Text style={styles.priceText}>
              {formatPrice(productPrice)}
              {showTaxedPrice && (
                <Text style={styles.smallText}>
                  {` (${i18n.t('Including tax')})`}
                </Text>
              )}
            </Text>
          </>
        ) : (
          <Text style={styles.zeroPrice}>
            {i18n.t('Contact us for a price')}
          </Text>
        )}
        {showDiscount && isProductPriceZero && (
          <Text style={styles.listPriceText}>{formatPrice(discountPrice)}</Text>
        )}
      </View>
    )
  }

  const renderDesc = () => {
    if (!product.full_description) {
      return null
    }

    return (
      <Section
        title={i18n.t('Description')}
        wrapperStyle={styles.wrapperStyle}
        topDivider>
        <DetailDescription
          description={product.full_description}
          id={product.product_id}
          title={product.product}
          navigation={navigation}
        />
        <TouchableOpacity
          style={styles.sectionBtn}
          onPress={() => {
            navigation.navigate('WriteReport', {
              report_object_id: product.product_id,
              report_type: REPORT_TYPE_PRODUCT
            })
          }}>
          <Text style={styles.sectionBtnText}>{i18n.t('Write a Report')}</Text>
        </TouchableOpacity>
      </Section>
    )
  }

  const renderQuantitySwitcher = () => {
    const step = parseInt(product.qty_step, 10) || 1
    const max = parseInt(product.max_qty, 10) || parseInt(product.amount, 10)
    const min = parseInt(product.min_qty, 10) || step

    if (product.isProductOffer) {
      return null
    }

    if (amount < min) {
      setAmount(min)
    }

    return (
      <>
        <QtyOption
          max={max}
          min={min}
          initialValue={amount || min}
          step={step}
          onChange={val => {
            setAmount(val)
          }}
        />
        {min > 1 && (
          <Text style={styles.minQtyNoticeText}>
            {i18n.t(
              'Minimum quantity for "[productTitle]" is [minProductQty].',
              { productTitle: product.product, minProductQty: min }
            )}
          </Text>
        )}
        {settings.showInStockField && (
          <Text style={styles.productInStockText}>
            {i18n.t('Availability') + ` ${product.amount} ` + i18n.t('item(s)')}
          </Text>
        )}
      </>
    )
  }

  const renderNewDiscussion = () => {
    const title = i18n.t('Reviews')

    return (
      <Section
        title={title}
        topDivider
        wrapperStyle={styles.wrapperStyle}
        showRightButton={true}
        rightButtonText={i18n.t('Write a Review')}
        onRightButtonPress={() => {
          navigation.navigate('WriteReviewNew', {
            productId: product.product_id,
            fetchData: fetchDataAndSetHeaderOptions
          })
        }}>
        <ReviewsBlock
          productId={product.product_id}
          productReviews={product.product_reviews}
          fetchData={fetchDataAndSetHeaderOptions}
          navigation={navigation}
        />
      </Section>
    )
  }

  const renderOldDiscussion = () => {
    const activeDiscussion = discussion.items[`p_${product.product_id}`]
    const masMore = activeDiscussion?.search.total_items > 2
    const title = i18n.t('Reviews')

    if (!activeDiscussion) {
      return
    }

    return (
      <Section
        title={title}
        topDivider
        wrapperStyle={styles.wrapperStyle}
        showRightButton={true}
        rightButtonText={i18n.t('Write a Review')}
        onRightButtonPress={() => {
          navigation.navigate('WriteReview', {
            activeDiscussion,
            discussionType: 'P',
            discussionId: product.product_id
          })
        }}>
        {activeDiscussion && (
          <DiscussionList
            items={activeDiscussion.posts.slice(0, 2)}
            type={activeDiscussion.type}
            navigation={navigation}
          />
        )}
        {masMore && (
          <TouchableOpacity
            style={styles.sectionBtn}
            onPress={() => {
              navigation.navigate('Discussion', {
                productId: product.product_id
              })
            }}>
            <Text style={styles.sectionBtnText}>{i18n.t('View All')}</Text>
          </TouchableOpacity>
        )}
      </Section>
    )
  }

  const renderDiscussion = () => {
    if (product.rating && !settings.productReviewsAddon?.isEnabled) {
      return renderOldDiscussion()
    }

    if (settings.productReviewsAddon?.isEnabled) {
      return renderNewDiscussion()
    }

    return null
  }

  const renderVendorInfo = () => {
    if (
      config.version !== VERSION_MVE ||
      !vendor ||
      product.isProductOffer ||
      !vendor.is_display_vendor
    ) {
      return null
    }

    return (
      <Section
        title={i18n.t('Vendor')}
        wrapperStyle={styles.wrapperStyle}
        topDivider
        showRightButton={true}
        rightButtonText={i18n.t('Details')}
        onRightButtonPress={() => {
          navigation.navigate('VendorDetail', {
            vendorId: vendor.company_id
          })
        }}>
        <View style={styles.vendorWrapper}>
          <Text style={styles.vendorName}>{vendor.company}</Text>
          <Text style={styles.vendorProductCount}>
            {i18n.t('{{count}} item(s)', { count: vendor.products_count })}
          </Text>
          <Text style={styles.vendorDescription}>
            {stripTags(vendor.description)}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.sectionBtn}
          onPress={() => {
            navigation.push('Vendor', {
              companyId: vendor.company_id,
              vendorName: vendor.company
            })
          }}>
          <Text style={styles.sectionBtnText}>{i18n.t('Go To Store')}</Text>
        </TouchableOpacity>
      </Section>
    )
  }

  const renderSellers = () => {
    if (!product.isProductOffer) {
      return null
    }

    return (
      <Section
        title={i18n.t('Sellers')}
        wrapperStyle={styles.wrapperStyle}
        topDivider>
        {product.productOffers.products.map((el, index) => {
          return (
            <Seller
              productOffer={el}
              handleAddToWishList={() => handleAddToWishList(el)}
              isLastVendor={product.productOffers.products.length - 1 === index}
              key={uuidv4()}
              onPress={() => handleAddToCart(true, el)}
            />
          )
        })}
      </Section>
    )
  }

  const handleAddToCart = (showNotification = true, productOffer) => {
    const productOptions = {}

    if (!auth.logged) {
      navigation.navigate('Login')
    }

    const currentProduct = productOffer || product

    // Convert product options to the option_id: variant_id array.
    Object.keys(product.selectedOptions).forEach(k => {
      productOptions[k] = product.selectedOptions[k]

      if (product.selectedOptions[k].variant_id) {
        productOptions[k] = product.selectedOptions[k].variant_id
      }

      const currentOption = product.convertedOptions.find(
        option => option.option_id === k
      )

      // If an option is a text, required and doesn't have value, changes value to 'required'
      if (
        (currentOption.option_type === OPTION_TYPE_TEXT ||
          currentOption.option_type === OPTION_TYPE_TEXT_AREA) &&
        currentOption.required === 'Y' &&
        productOptions[k] === ''
      ) {
        productOptions[k] = OPTION_IS_REQUIRED
      }
    })

    const products = {
      [currentProduct.product_id]: {
        product_id: currentProduct.product_id,
        amount,
        product_options: productOptions
      }
    }

    let requiredOptionWithoutValue = []

    // Determines is there a product with required option but without value
    Object.keys(products).forEach(product => {
      requiredOptionWithoutValue = Object.keys(
        products[product].product_options
      ).filter(key => {
        if (products[product].product_options[key] === OPTION_IS_REQUIRED) {
          return key
        }
      })
    })

    if (requiredOptionWithoutValue.length) {
      productsActions.showRequiredOptionNotification()
      const newProduct = { ...product }
      newProduct.convertedOptions = newProduct.convertedOptions.map(option => {
        if (requiredOptionWithoutValue.includes(option.option_id)) {
          return { ...option, requiredOptionWarning: true }
        }

        return { ...option }
      })

      setProduct(newProduct)
      return
    }

    return cartActions.add({ products }, showNotification, cart.coupons)
  }

  const renderAddToCart = () => {
    const canPayWithApplePay = Platform.OS === 'ios' && config.applePay

    const isHidePrice =
      settings.checkout.allowAnonymousShopping ===
        'hide_price_and_add_to_cart' && !auth.logged
    const outOfStock =
      !Number(product.amount) && product.is_edp !== PRODUCT_IS_DOWNLOADABLE
    const isHidePaymentButton =
      settings.checkout.allowAnonymousShopping !== 'allow_shopping'

    if (product.isProductOffer) {
      return null
    }

    const outOfStockAction = product.out_of_stock_actions

    return (
      <View style={styles.addToCartContainerWrapper}>
        <View style={styles.addToCartContainer}>
          {canPayWithApplePay && (
            <View style={styles.inAppPaymentWrapper}>
              <InAppPayment onPress={this.handleApplePay} />
            </View>
          )}
          {isHidePaymentButton && !auth.logged ? (
            <AddToCartButton
              onPress={() => handleAddToCart()}
              title={'Please sign in to buy'}
            />
          ) : (
            (!outOfStock || outOfStockAction === BUY_IN_ADVANCE) && (
              <AddToCartButton
                onPress={() => handleAddToCart()}
                title={'Add to cart'}
              />
            )
          )}
          {!isHidePrice && renderPrice()}
        </View>
      </View>
    )
  }

  if (isLoading) {
    return <Spinner visible={true} />
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          {renderImage()}
          <View style={styles.descriptionBlock}>
            {renderName()}
            {renderRating()}
          </View>
          {renderQuantitySwitcher()}
          {renderVariationsAndOptions()}
          {renderSellers()}
          {renderDesc()}
          <ProductFeaturesList productFeatures={product.product_features} />
          <QuantityDiscounts prices={product.prices} />
          {renderDiscussion()}
          {renderVendorInfo()}
          <ProductScreenBlocks
            productScreenBlocks={productScreenBlocks}
            navigation={navigation}
            containerPadding={theme.$containerPadding}
          />
        </ScrollView>
      </View>
      {renderAddToCart()}
    </>
  )
}

export default connect(
  state => ({
    settings: state.settings,
    discussion: state.discussion,
    auth: state.auth,
    cart: state.cart
  }),
  dispatch => ({
    cartActions: bindActionCreators(cartActions, dispatch),
    productsActions: bindActionCreators(productsActions, dispatch),
    wishListActions: bindActionCreators(wishListActions, dispatch),
    vendorActions: bindActionCreators(vendorActions, dispatch)
  })
)(ProductDetail)
