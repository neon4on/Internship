import { get } from 'lodash'
import {
  SEND_REPORT_REQUEST,
  SEND_REPORT_SUCCESS,
  SEND_REPORT_FAIL
} from '../../constants'
import Api from '../../services/api'
import i18n from '../../utils/i18n'

import * as notificationsActions from './notificationsActions'

export function sendReport(data) {
  return dispatch => {
    dispatch({ type: SEND_REPORT_REQUEST })
    return Api.post('/sra_report', data)
      .then(response => {
        dispatch({
          type: SEND_REPORT_SUCCESS,
          payload: response.data
        })

        notificationsActions.show({
          type: 'success',
          title: i18n.t('Thank you for your report.'),
          text: i18n.t('Your report will be checked.')
        })(dispatch)
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
          type: SEND_REPORT_FAIL,
          error
        })
      })
  }
}
