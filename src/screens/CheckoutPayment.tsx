import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { stripTags, formatPrice } from '../utils'
import i18n from '../utils/i18n'
import {
  PAYMENT_TYPE_STRIPE,
  PAYMENT_TYPE_STRIPE_CONNECT
} from '../constants/index'
import { Formik } from 'formik'
import * as yup from 'yup'
import theme from '../config/theme'

// Actions
import * as ordersActions from '../redux/actions/ordersActions'
import * as cartActions from '../redux/actions/cartActions'
import * as paymentsActions from '../redux/actions/paymentsActions'

// Components
import StepByStepSwitcher from '../components/StepByStepSwitcher'
import CartFooter from '../components/CartFooter'
import PaymentPhoneForm from '../components/PaymentPhoneForm'
import PaymentPurchaseOrderForm from '../components/PaymentPurchaseOrderForm'
import PaymentCreditCardForm from '../components/PaymentCreditCardForm'
import PaymentEmpty from '../components/PaymentEmpty'
import PaymentCheckForm from '../components/PaymentCheckForm'
import PaymentPaypalForm from '../components/PaymentPaypalForm'
import PaymentYandexKassaForm from '../components/PaymentYandexKassaForm'
import Spinner from '../components/Spinner'
import Icon from '../components/Icon'
import { StripePaymentProvider } from './StripePaymentProvider'
import { PaymentCashOnDelivery } from '../components/PaymentCashOnDelivery'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  },
  paymentItemWrapper: {
    paddingLeft: 14,
    paddingRight: 14,
    marginTop: 10
  },
  paymentItem: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: '#F1F1F1',
    backgroundColor: '#fff',
    flexDirection: 'row'
  },
  paymentItemText: {
    fontSize: 14,
    color: theme.$darkColor
  },
  paymentItemDesc: {
    fontSize: 13,
    paddingBottom: 6,
    color: 'gray',
    marginTop: 10
  },
  uncheckIcon: {
    fontSize: 16,
    marginRight: 6,
    color: theme.$darkColor
  },
  checkIcon: {
    fontSize: 16,
    marginRight: 6,
    color: theme.$darkColor,
    opacity: 0.5
  },
  stepsWrapper: {
    padding: 14
  },
  paymentForbiddenContainer: {
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20
  },
  paymentForbiddenText: {
    textAlign: 'center',
    color: theme.$dangerColor
  }
})

const TPL_CREDIT_CARD = 'views/orders/components/payments/cc.tpl'
const STRIPE = 'addons/stripe/views/orders/components/payments/stripe.tpl'
const STRIPE_CONNECT =
  'addons/stripe_connect/views/orders/components/payments/stripe_connect.tpl'
const TPL_EMPTY = 'views/orders/components/payments/empty.tpl'
const TPL_CHECK = 'views/orders/components/payments/check.tpl'
const TPL_PHONE = 'views/orders/components/payments/phone.tpl'
const TPL_PURCHASE_ORDER = 'views/orders/components/payments/po.tpl'
const TPL_CASH_ON_DELIVERY = 'views/orders/components/payments/cod.tpl'
const SUPPORTED_PAYMENT_TPLS = [
  TPL_CREDIT_CARD,
  TPL_EMPTY,
  TPL_CHECK,
  TPL_PHONE,
  STRIPE,
  STRIPE_CONNECT,
  TPL_PURCHASE_ORDER,
  TPL_CASH_ON_DELIVERY
]

const SCRIPT_YOOKASSA = 'yandex_checkout.php'
const SCRIPT_YOOKASSA_FOR_MARKETPLACES = 'yandex_checkout_for_marketplaces.php'
const SCRIPT_YOOKASSA_LEGACY = 'yandex_money.php'
const SCRIPT_PAYPAL_EXPRESS = 'paypal_express.php'
const SUPPORTED_PAYMENT_SCRIPTS = [
  SCRIPT_YOOKASSA,
  SCRIPT_YOOKASSA_FOR_MARKETPLACES,
  SCRIPT_YOOKASSA_LEGACY,
  SCRIPT_PAYPAL_EXPRESS
]

export class CheckoutPayment extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: false,
      selectedItem: null,
      items: []
    }
  }

  componentDidMount() {
    const { route } = this.props
    const { cart } = route.params

    const items = Object.keys(cart.payments)
      .map(k => cart.payments[k])
      .filter(
        p =>
          SUPPORTED_PAYMENT_TPLS.includes(p.template) ||
          SUPPORTED_PAYMENT_SCRIPTS.includes(p.script)
      )
    // FIXME: Default selected payment method.
    const selectedItem = items[0]

    this.setState({
      items,
      selectedItem
    })
  }

  handlePlaceOrder(value) {
    const { selectedItem } = this.state
    this.setState({
      fetching: true
    })

    if (!selectedItem) {
      return null
    }

    if (SUPPORTED_PAYMENT_SCRIPTS.includes(selectedItem.script)) {
      return this.placeSettlements()
    }

    return this.placeOrderAndComplete(value)
  }

  async placeOrderAndComplete(values) {
    const {
      route,
      ordersActions,
      cartActions,
      paymentsActions,
      navigation,
      storeCart
    } = this.props
    const { cart, selectedPickupPoints, selectedShippings } = route.params
    const { notes, ...processedValues } = values

    const orderInfo = {
      products: {},
      coupon_codes: Object.keys(cart.coupons),
      payment_id: this.state.selectedItem.payment_id,
      user_data: cart.user_data
    }

    if (notes && notes.trim() !== '') {
      orderInfo.notes = notes
    }

    if (Object.keys(selectedShippings).length) {
      orderInfo.shipping_ids = selectedShippings
    }

    if (Object.keys(selectedPickupPoints).length) {
      orderInfo.select_store = selectedPickupPoints
    }

    Object.keys(cart.products).map(key => {
      const p = cart.products[key]
      orderInfo.products[p.product_id] = {
        product_id: p.product_id,
        amount: p.amount,
        product_options: p.product_options
      }

      return orderInfo
    })

    const selectedPayment = this.state.selectedItem.script

    // As Stripe uses its own card component for payments,
    // we don't need values from our fields.
    if (
      selectedPayment !== PAYMENT_TYPE_STRIPE &&
      selectedPayment !== PAYMENT_TYPE_STRIPE_CONNECT
    ) {
      if (!processedValues) {
        return null
      }

      if (processedValues.phone) {
        orderInfo.payment_info = {
          ...orderInfo.payment_info,
          customer_phone: processedValues.phone
        }
      } else if (processedValues.cardNumber) {
        orderInfo.payment_info = {
          ...orderInfo.payment_info,
          card_number: processedValues.cardNumber,
          expiry_month: processedValues.expiryMonth,
          expiry_year: processedValues.expiryYear,
          cardholder_name: processedValues.cardholderName,
          cvv2: processedValues.ccv
        }
      } else {
        orderInfo.payment_info = {
          ...orderInfo.payment_info,
          ...processedValues
        }
      }
    }

    const paymentType = this.state.selectedItem.script

    if (
      paymentType === PAYMENT_TYPE_STRIPE ||
      paymentType === PAYMENT_TYPE_STRIPE_CONNECT
    ) {
      const providerData = await paymentsActions.getProviderDataByPaymentId(
        this.state.selectedItem.payment_id
      )

      this.setState({
        fetching: false
      })

      navigation.navigate('StripePaymentProvider', {
        providerData: providerData,
        cart: cart,
        coupons: storeCart.coupons,
        orderInfo
      })
    } else {
      const { data } = await ordersActions.create(orderInfo)
      this.setState({
        fetching: false
      })

      if (!data) {
        return
      }

      await cartActions.clear(cart, storeCart.coupons)
      navigation.reset({
        index: 0,
        routes: [{ name: 'CartScreen' }]
      })
      navigation.push('CheckoutComplete', {
        orderId: data.order_id
      })
    }

    return
  }

  placeSettlements() {
    const { route, ordersActions, paymentsActions, storeCart, navigation } =
      this.props
    const { cart, selectedShippings } = route.params

    const orderInfo = {
      products: {},
      coupon_codes: cart.coupons,
      shipping_ids: selectedShippings,
      payment_id: this.state.selectedItem.payment_id,
      user_data: cart.user_data
    }

    Object.keys(cart.products).map(key => {
      const p = cart.products[key]
      orderInfo.products[p.product_id] = {
        product_id: p.product_id,
        amount: p.amount
      }
      return orderInfo
    })

    this.setState({
      fetching: true
    })

    ordersActions
      .create(orderInfo)
      .then(({ data }) => {
        this.setState({
          fetching: false
        })

        if (!data) {
          return
        }

        const settlementData = {
          order_id: data.order_id,
          replay: false
        }

        paymentsActions.settlements(settlementData).then(response => {
          navigation.navigate('SettlementsCompleteWebView', {
            title: this.state.selectedItem.payment,
            orderId: data.order_id,
            cart,
            storeCart,
            ...response.data.data
          })
        })
      })
      .catch(() => {
        this.setState({
          fetching: false
        })
      })
    return null
  }

  renderItem = (item, index) => {
    const { payment } = this.state.selectedItem
    // FIXME compare by name.
    const isSelected = item.payment === payment

    return (
      <TouchableOpacity
        key={index}
        style={styles.paymentItem}
        onPress={() => {
          this.setState({
            selectedItem: { ...item }
          })
        }}>
        {isSelected ? (
          <Icon name="radio-button-checked" style={styles.checkIcon} />
        ) : (
          <Icon name="radio-button-unchecked" style={styles.uncheckIcon} />
        )}
        <Text style={styles.paymentItemText}>{stripTags(item.payment)}</Text>
      </TouchableOpacity>
    )
  }

  renderHeader = () => {
    const { route } = this.props
    const { currentStep } = route.params
    return (
      <View style={styles.stepsWrapper}>
        <StepByStepSwitcher currentStep={currentStep} />
      </View>
    )
  }

  renderFooter() {
    const { route, navigation } = this.props
    const { cart } = route.params
    const { selectedItem } = this.state
    let validationSchema = yup.object()
    let initialValues = {}

    if (!selectedItem) {
      return null
    }

    let form = null

    // FIXME: HARDCODE
    switch (selectedItem.template) {
      case TPL_EMPTY:
        form = <PaymentEmpty />
        validationSchema = yup.object({
          notes: yup.string()
        })
        break
      case STRIPE:
        form = <StripePaymentProvider />
        break
      case TPL_CREDIT_CARD:
        form = <PaymentCreditCardForm />
        validationSchema = yup.object({
          cardNumber: yup
            .string()
            .matches(
              /(\d)\b/,
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('Card Number'),
                interpolation: { escapeValue: false }
              })
            )
            .min(
              13,
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('Card Number'),
                interpolation: { escapeValue: false }
              })
            )
            .required(
              i18n.t('The {{field}} field is required', {
                field: i18n.t('Card Number'),
                interpolation: { escapeValue: false }
              })
            ),
          expiryMonth: yup
            .number()
            .typeError(
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('Valid thru (mm)'),
                interpolation: { escapeValue: false }
              })
            )
            .positive(
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('Valid thru (mm)'),
                interpolation: { escapeValue: false }
              })
            )
            .integer(
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('Valid thru (mm)'),
                interpolation: { escapeValue: false }
              })
            )
            .min(
              2,
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('Valid thru (mm)'),
                interpolation: { escapeValue: false }
              })
            )
            .required(
              i18n.t('The {{field}} field is required', {
                field: i18n.t('Valid thru (mm)'),
                interpolation: { escapeValue: false }
              })
            ),
          expiryYear: yup
            .number()
            .typeError(
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('Valid thru (yy)'),
                interpolation: { escapeValue: false }
              })
            )
            .positive(
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('Valid thru (yy)'),
                interpolation: { escapeValue: false }
              })
            )
            .integer(
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('Valid thru (yy)'),
                interpolation: { escapeValue: false }
              })
            )
            .min(
              4,
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('Valid thru (yy)'),
                interpolation: { escapeValue: false }
              })
            )
            .required(
              i18n.t('The {{field}} field is required', {
                field: i18n.t('Valid thru (yy)'),
                interpolation: { escapeValue: false }
              })
            ),
          cardholderName: yup.string().required(
            i18n.t('The {{field}} field is required', {
              field: i18n.t("Cardholder's name"),
              interpolation: { escapeValue: false }
            })
          ),
          ccv: yup
            .number()
            .typeError(
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('CVV/CVC'),
                interpolation: { escapeValue: false }
              })
            )
            .min(
              3,
              i18n.t('Enter a valid {{field}}', {
                field: i18n.t('CVV/CVC'),
                interpolation: { escapeValue: false }
              })
            )
            .required(
              i18n.t('The {{field}} field is required', {
                field: i18n.t('CVV/CVC'),
                interpolation: { escapeValue: false }
              })
            ),
          notes: yup.string()
        })

        initialValues = {
          cardNumber: '',
          expiryMonth: '',
          expiryYear: '',
          cardholderName: '',
          ccv: ''
        }

        break
      case TPL_CHECK:
        form = <PaymentCheckForm />
        validationSchema = yup.object({
          customerSignature: yup.string().required(
            i18n.t('The {{field}} field is required', {
              field: i18n.t("Customer's signature"),
              interpolation: { escapeValue: false }
            })
          ),
          checkingAccountNumber: yup.string().required(
            i18n.t('The {{field}} field is required', {
              field: i18n.t('Checking account number'),
              interpolation: { escapeValue: false }
            })
          ),
          bankRoutingNumber: yup.string().required(
            i18n.t('The {{field}} field is required', {
              field: i18n.t('Bank routing number'),
              interpolation: { escapeValue: false }
            })
          ),
          notes: yup.string()
        })

        initialValues = {
          customerSignature: '',
          checkingAccountNumber: '',
          bankRoutingNumber: ''
        }

        break
      case TPL_PHONE:
        form = <PaymentPhoneForm />
        validationSchema = yup.object({
          phone: yup.mixed().required(
            i18n.t('The {{field}} field is required', {
              field: i18n.t('Phone'),
              interpolation: { escapeValue: false }
            })
          ),
          notes: yup.mixed()
        })
        initialValues = { phone: cart.user_data.b_phone }
        break
      case TPL_PURCHASE_ORDER:
        form = <PaymentPurchaseOrderForm />
        validationSchema = yup.object({
          po_number: yup.string().required(
            i18n.t('The {{field}} field is required', {
              field: i18n.t('PO Number'),
              interpolation: { escapeValue: false }
            })
          ),
          company_name: yup.string().required(
            i18n.t('The {{field}} field is required', {
              field: i18n.t('Company name'),
              interpolation: { escapeValue: false }
            })
          ),
          buyer_name: yup.string().required(
            i18n.t('The {{field}} field is required', {
              field: i18n.t("Buyer's name"),
              interpolation: { escapeValue: false }
            })
          ),
          position: yup.string().required(
            i18n.t('The {{field}} field is required', {
              field: i18n.t('Position'),
              interpolation: { escapeValue: false }
            })
          )
        })

        initialValues = {
          po_number: '',
          company_name: '',
          buyer_name: '',
          position: ''
        }

        break
      case TPL_CASH_ON_DELIVERY:
        form = (
          <PaymentCashOnDelivery
            instruction={selectedItem.instructions}
            navigation={navigation}
          />
        )

        break
      default:
        break
    }

    switch (selectedItem.script) {
      case SCRIPT_PAYPAL_EXPRESS:
        form = <PaymentPaypalForm />
        break
      case SCRIPT_YOOKASSA:
      case SCRIPT_YOOKASSA_FOR_MARKETPLACES:
      case SCRIPT_YOOKASSA_LEGACY:
        form = <PaymentYandexKassaForm />
        break

      default:
        break
    }

    return {
      validationSchema,
      initialValues,
      component: <View style={styles.paymentItemWrapper}>{form}</View>
    }
  }

  renderSpinner = () => {
    const { fetching } = this.state
    return <Spinner visible={fetching} mode="modal" />
  }

  renderPaymentNotAvailableMessage = () => {
    return (
      <View style={styles.paymentForbiddenContainer}>
        <Text style={styles.paymentForbiddenText}>
          {i18n.t(
            'There are no payment methods available, so you cannot proceed to checkout.'
          )}
        </Text>
      </View>
    )
  }

  render() {
    const { route } = this.props
    const { cart } = route.params
    const { selectedItem, items } = this.state

    if (!items.length) {
      return this.renderPaymentNotAvailableMessage()
    }

    if (!selectedItem) {
      return <Spinner visible={true} />
    }
    // If a user chose a stripe method, we don't need to render form fields.
    const formComponent =
      selectedItem.script === PAYMENT_TYPE_STRIPE ||
      selectedItem.script === PAYMENT_TYPE_STRIPE_CONNECT
        ? { initialValues: {} }
        : this.renderFooter()

    return (
      <SafeAreaView style={styles.container}>
        <Formik
          initialValues={formComponent?.initialValues}
          validationSchema={formComponent?.validationSchema}
          onSubmit={values => this.handlePlaceOrder(values)}
          enableReinitialize={true}>
          {({ handleSubmit, isValid }) => {
            return (
              <>
                <KeyboardAwareScrollView enableResetScrollToCoords={false}>
                  {this.renderHeader()}
                  {items.map((item, index) => {
                    return this.renderItem(item, index)
                  })}
                  {formComponent?.component}
                </KeyboardAwareScrollView>
                <CartFooter
                  totalPrice={formatPrice(cart.total_formatted.price)}
                  btnText={i18n.t('Place order').toUpperCase()}
                  isBtnDisabled={false && isValid}
                  onBtnPress={handleSubmit}
                />
              </>
            )
          }}
        </Formik>
        {this.renderSpinner()}
      </SafeAreaView>
    )
  }
}

export default connect(
  state => ({
    auth: state.auth,
    storeCart: state.cart
  }),
  dispatch => ({
    ordersActions: bindActionCreators(ordersActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch),
    paymentsActions: bindActionCreators(paymentsActions, dispatch)
  })
)(CheckoutPayment)
