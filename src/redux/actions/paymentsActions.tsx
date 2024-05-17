import {
  SETTLEMENTS_REQUEST,
  SETTLEMENTS_SUCCESS,
  SETTLEMENTS_FAIL
} from '../../constants'

import Api from '../../services/api'
import i18n from '../../utils/i18n'

import * as notificationsActions from './notificationsActions'

export function settlements(data) {
  return dispatch => {
    dispatch({ type: SETTLEMENTS_REQUEST })
    return Api.post('/sra_settlements', data)
      .then(response => {
        dispatch({
          type: SETTLEMENTS_SUCCESS,
          payload: response.data
        })

        return response
      })
      .catch(error => {
        notificationsActions.show({
          type: 'error',
          title: i18n.t('Error'),
          text: i18n.t('Something went wrong. Please try again later.')
        })(dispatch)
        dispatch({
          type: SETTLEMENTS_FAIL,
          error
        })
      })
  }
}

export function getProviderDataByPaymentId(paymentId) {
  return async dispatch => {
    dispatch({ type: SETTLEMENTS_REQUEST })
    try {
      const { data } = await Api.get(`/sra_settlements/${paymentId}`)
      return data.processor_params
    } catch (error) {
      console.log('error: ', error)
    }
  }
}
