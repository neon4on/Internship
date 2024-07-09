import {
  WISH_LIST_FETCH_REQUEST,
  WISH_LIST_FETCH_SUCCESS,
  WISH_LIST_FETCH_FAIL,
  WISH_LIST_ADD_REQUEST,
  WISH_LIST_ADD_SUCCESS,
  WISH_LIST_ADD_FAIL,
  WISH_LIST_REMOVE_REQUEST,
  WISH_LIST_REMOVE_SUCCESS,
  WISH_LIST_REMOVE_FAIL,
  WISH_LIST_CLEAR,
  WISH_LIST_UPDATE_QUANTITY_REQUEST,
  WISH_LIST_UPDATE_QUANTITY_SUCCESS,
  WISH_LIST_UPDATE_QUANTITY_FAIL
} from '../../constants'

import i18n from '../../utils/i18n'
import Api from '../../services/api'

import * as notificationsActions from './notificationsActions'

export function fetch(fetching = true) {
  return dispatch => {
    dispatch({
      type: WISH_LIST_FETCH_REQUEST,
      payload: {
        fetching
      }
    })
    return Api.get('/sra_wish_list')
      .then(response => {
        dispatch({
          type: WISH_LIST_FETCH_SUCCESS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: WISH_LIST_FETCH_FAIL,
          error
        })
      })
  }
}

export function add(data) {
  return dispatch => {
    dispatch({
      type: WISH_LIST_ADD_REQUEST
    })
    return Api.post('/sra_wish_list', data)
      .then(response => {
        dispatch({
          type: WISH_LIST_ADD_SUCCESS,
          payload: response.data
        })

        notificationsActions.show({
          type: 'success',
          title: i18n.t('Success'),
          text: i18n.t('The product was added to your Wish list.')
        })(dispatch)
        // Calculate cart
        fetch(false)(dispatch)
      })
      .catch(error => {
        notificationsActions.show({
          type: 'error',
          title: i18n.t('Error'),
          text: i18n.t('This product is already in the wish list.')
        })(dispatch)
        dispatch({
          type: WISH_LIST_ADD_FAIL,
          error
        })
      })
  }
}

export function remove(cartId) {
  return dispatch => {
    dispatch({
      type: WISH_LIST_REMOVE_REQUEST
    })
    return Api.delete(`/sra_wish_list/${cartId}`, {})
      .then(() => {
        dispatch({
          type: WISH_LIST_REMOVE_SUCCESS,
          payload: {
            cartId
          }
        })
      })
      .catch(error => {
        dispatch({
          type: WISH_LIST_REMOVE_FAIL,
          error
        })
      })
  }
}

export function updateQuantity(cartId, newQuantity) {
  return dispatch => {
    dispatch({
      type: WISH_LIST_UPDATE_QUANTITY_REQUEST
    })
    return Api.put(`/sra_wish_list/${cartId}`, { amount: newQuantity })
      .then(response => {
        dispatch({
          type: WISH_LIST_UPDATE_QUANTITY_SUCCESS,
          payload: {
            cartId,
            newQuantity,
            updatedItem: response.data
          }
        })
        fetch(false)(dispatch)
      })
      .catch(error => {
        dispatch({
          type: WISH_LIST_UPDATE_QUANTITY_FAIL,
          error
        })
        notificationsActions.show({
          type: 'error',
          title: i18n.t('Error'),
          text: i18n.t('Failed to update product quantity in the wish list.')
        })(dispatch)
      })
  }
}

export function clear() {
  return dispatch => {
    dispatch({
      type: WISH_LIST_CLEAR
    })
    return Api.delete('/sra_wish_list/')
  }
}
