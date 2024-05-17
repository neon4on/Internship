import { SET_LANGUAGE, SET_CURRENCY } from '../../constants'

export const setLanguage = language => {
  return async dispatch => {
    dispatch({
      type: SET_LANGUAGE,
      payload: language
    })
  }
}

export const setCurrency = currency => {
  return async dispatch => {
    dispatch({
      type: SET_CURRENCY,
      payload: currency
    })
  }
}
