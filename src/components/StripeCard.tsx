import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { StyleSheet, Alert, View } from 'react-native'
import {
  CardField,
  createPaymentMethod,
  createToken,
  CardFieldInput
} from '@stripe/stripe-react-native'
import { Cart } from '../redux/types/cartTypes'
import theme from '../config/theme'

// Actions
import { getStripePaymentStatus, create } from '../redux/actions/ordersActions'
import * as cartActions from '../redux/actions/cartActions'

// Components
import { PayWithCardButton } from '../components/PayWithCardButton'
import Spinner from './Spinner'

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: '#fff',
    opacity: 0.7,
    zIndex: 3, // works on ios
    elevation: 3 // works on android
  },
  cardStyle: {
    backgroundColor: '#FFFFFF',
    textColor: theme.$darkColor,
    placeholderColor: theme.$mediumGrayColor
  },
  cardFieldStyles: {
    width: '100%',
    height: 50,
    marginVertical: 30
  }
})

interface StripeCardProps {
  componentId: string
  cart: Cart
  coupons: {}
  orderInfo: {}
  stripePaymentType: string
}

export const StripeCard: React.FC<StripeCardProps> = ({
  cart,
  coupons,
  orderInfo,
  stripePaymentType,
  navigation
}) => {
  const dispatch = useDispatch()
  const [cardDetails, setCardDetails] =
    useState<CardFieldInput.Details | null>()
  const [loading, setLoading] = useState<boolean>(false)
  const { user_data } = useSelector(state => state.cart)
  const [orderId, setOrderId] = useState<number | null>(null)

  useEffect(() => {
    stripePaymentProccess()
  }, [orderId])

  const handlePayPress = async () => {
    if (!cardDetails?.complete || !user_data.email) {
      Alert.alert('Please enter Complete card details and Email')
      return
    }

    try {
      setLoading(true)

      if (orderId === null) {
        // Creates an order in advance but without payment
        // because we need order_id for getting payment status in the future.
        const { data } = await dispatch(create(orderInfo))

        if (!data) {
          return
        }

        setOrderId(data.order_id)
      } else {
        await stripePaymentProccess()
      }
    } catch (error) {
      console.log('Stripe payment Error: ', error)
    } finally {
      setLoading(false)
    }
  }

  const stripePaymentProccess = async () => {
    if (!orderId) {
      return
    }

    setLoading(true)

    const billingDetails = {
      email: user_data.email
    }

    // StripeToken is used for Stripe Connect without 3d secure (card_simple).
    // PaymentMethodId is used for Stripe Connect with 3d secure and usual Stripe.
    let stripeToken
    let paymentMethodId

    if (stripePaymentType === 'card_simple') {
      const stripeTokenresult = await createToken({ type: 'Card' })
      stripeToken = stripeTokenresult?.token?.id
    } else {
      const response = await createPaymentMethod({
        paymentMethodType: 'Card',
        paymentMethodData: { billingDetails }
      })

      paymentMethodId = response?.paymentMethod?.id
    }

    if (!paymentMethodId && !stripeToken) {
      setLoading(false)
      return
    }

    const stripePaymentStatus = await dispatch(
      getStripePaymentStatus(orderId, paymentMethodId, stripeToken)
    )

    if (stripePaymentStatus === 201) {
      await dispatch(cartActions.clear(cart, coupons))

      setLoading(false)

      navigation.reset({
        index: 0,
        routes: [{ name: 'CartScreen' }]
      })
      navigation.push('CheckoutComplete', { orderId: orderId })
    } else {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.spinnerContainer}>
          <Spinner visible={true} />
        </View>
      )}
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242'
        }}
        cardStyle={styles.cardStyle}
        style={styles.cardFieldStyles}
        onCardChange={setCardDetails}
      />
      <PayWithCardButton pressHandler={handlePayPress} />
    </View>
  )
}
