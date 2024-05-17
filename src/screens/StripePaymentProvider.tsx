import React, { useEffect } from 'react'
import { View } from 'react-native'
import { StripeProvider as _StripeProvider } from '@stripe/stripe-react-native'
import type { Props as StripeProviderProps } from '@stripe/stripe-react-native/lib/typescript/src/components/StripeProvider'
import { StripeCard } from '../components/StripeCard'
import { Cart } from '../redux/types/cartTypes'

const StripeProvider = _StripeProvider as React.FC<StripeProviderProps>

interface StripePaymentProviderProps {
  componentId: string
  providerData: {
    country: string
    currency: string
    merchant_identifier: string
    publishable_key: string
    is_stripe_connect: string
    payment_type: string
  }
  cart: Cart
  coupons: {}
  orderInfo: {}
}

export const StripePaymentProvider: React.FC<StripePaymentProviderProps> = ({
  route,
  navigation
}) => {
  useEffect(() => {
    navigation.setOptions({
      title: cart.payments[orderInfo.payment_id].payment
    })
  }, [])

  const { providerData, orderInfo, coupons, cart } = route.params

  return (
    <View>
      <StripeProvider
        publishableKey={providerData.publishable_key}
        // Merchant identifier is needed only for usual Stripe.
        merchantIdentifier={
          providerData.is_stripe_connect === 'Y'
            ? undefined
            : providerData.merchant_identifier
        }>
        <StripeCard
          cart={cart}
          coupons={coupons}
          orderInfo={orderInfo}
          stripePaymentType={providerData.payment_type}
          navigation={navigation}
        />
      </StripeProvider>
    </View>
  )
}
