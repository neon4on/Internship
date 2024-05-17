import { get } from 'lodash'
import {
  FETCH_ORDERS_REQUEST,
  FETCH_ORDERS_FAIL,
  FETCH_ORDERS_SUCCESS,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  STRIPE_PAYMENT_STATUS_REQUEST,
  STRIPE_PAYMENT_STATUS_SUCCESS,
  STRIPE_PAYMENT_STATUS_FAILED
} from '../../constants'
import Api from '../../services/api'
import i18n from '../../utils/i18n'
import { Alert } from 'react-native'

// actions
import * as notificationsActions from './notificationsActions'

export function create(data) {
  return dispatch => {
    dispatch({ type: ORDER_CREATE_REQUEST })
    return Api.post('/sra_orders/', data)
      .then(response => {
        dispatch({
          type: ORDER_CREATE_SUCCESS,
          payload: response.data
        })
        return response
      })
      .catch(error => {
        notificationsActions.show({
          type: 'error',
          title: i18n.t('Error'),
          text: get(
            error,
            'response.data.message',
            i18n.t('Something went wrong. Please try again later.')
          )
        })(dispatch)
        dispatch({
          type: ORDER_CREATE_FAIL,
          error
        })

        return error
      })
  }
}

export function fetch(page = 1) {
  return dispatch => {
    dispatch({ type: FETCH_ORDERS_REQUEST })
    return Api.get(`/sra_orders?page=${page}`)
      .then(response => {
        dispatch({
          type: FETCH_ORDERS_SUCCESS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: FETCH_ORDERS_FAIL,
          error
        })
      })
  }
}

export function getStripePaymentStatus(orderId, paymentMethodId, stripeToken) {
  return async dispatch => {
    dispatch({ type: STRIPE_PAYMENT_STATUS_REQUEST })

    try {
      const result = await Api.post('/sra_settlements/', {
        order_id: orderId,
        payment_method_id: paymentMethodId,
        token: stripeToken
      })

      dispatch({ type: STRIPE_PAYMENT_STATUS_SUCCESS })

      return result.status
    } catch (error) {
      Alert.alert(
        i18n.t('Error'),
        i18n.t(
          'Your order has been declined by the payment processor. Please review your information and contact store administration.'
        ),
        [{ text: 'OK' }]
      )

      dispatch({ type: STRIPE_PAYMENT_STATUS_FAILED, error })
    }
  }
}
