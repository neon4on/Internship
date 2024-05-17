import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_FAIL,
  FETCH_PRODUCTS_SUCCESS,
  SEARCH_PRODUCTS_REQUEST,
  SEARCH_PRODUCTS_FAIL,
  SEARCH_PRODUCTS_SUCCESS,
  FETCH_ONE_PRODUCT_REQUEST,
  FETCH_ONE_PRODUCT_FAIL,
  FETCH_ONE_PRODUCT_SUCCESS,
  RECALCULATE_PRODUCT_PRICE_REQUEST,
  RECALCULATE_PRODUCT_PRICE_FAIL,
  RECALCULATE_PRODUCT_PRICE_SUCCESS,
  FETCH_DISCUSSION_REQUEST,
  FETCH_DISCUSSION_SUCCESS,
  FETCH_DISCUSSION_FAIL,
  POST_DISCUSSION_REQUEST,
  POST_DISCUSSION_SUCCESS,
  POST_DISCUSSION_FAIL,
  POST_SEND_REVIEW_REQUEST,
  POST_SEND_REVIEW_SUCCESS,
  POST_SEND_REVIEW_FAIL,
  NOTIFICATION_SHOW,
  CHANGE_PRODUCTS_SORT,
  FETCH_COMMON_PRODUCTS_REQUEST,
  FETCH_COMMON_PRODUCTS_FAIL,
  FETCH_COMMON_PRODUCTS_SUCCESS,
  LIKE_DISLIKE_REVIEW_REQUEST,
  LIKE_DISLIKE_REVIEW_SUCCESS,
  LIKE_DISLIKE_REVIEW_FAIL,
  SET_PRODUCT_REVIEWS,
  FETCH_PRODUCT_BLOCKS_REQUEST,
  FETCH_PRODUCT_BLOCKS_SUCCESS,
  FETCH_PRODUCT_BLOCKS_FAIL
} from '../../constants'
import Api from '../../services/api'
import i18n from '../../utils/i18n'
import {
  convertProduct,
  formatOptionsToUrl
} from '../../services/productDetail'
import store from '../store'
import qs from 'qs'

import * as notificationsActions from './notificationsActions'

export function fetchDiscussion(id, params = { page: 1 }, type = 'P') {
  return dispatch => {
    dispatch({
      type: FETCH_DISCUSSION_REQUEST
    })

    return Api.get(
      `/sra_discussion/?object_type=${type}&object_id=${id}&params[page]=${params.page}`
    )
      .then(response => {
        dispatch({
          type: FETCH_DISCUSSION_SUCCESS,
          payload: {
            id: `${type.toLowerCase()}_${id}`,
            page: params.page,
            discussion: response.data
          }
        })
        return response
      })
      .catch(error => {
        dispatch({
          type: FETCH_DISCUSSION_FAIL,
          error
        })
      })
  }
}

export function postDiscussion(data) {
  return dispatch => {
    dispatch({
      type: POST_DISCUSSION_REQUEST
    })

    return Api.post('/sra_discussion', data)
      .then(response => {
        dispatch({
          type: POST_DISCUSSION_SUCCESS
        })

        if (response.data.is_approval_required) {
          notificationsActions.show({
            type: 'success',
            title: i18n.t('Thank you for your post.'),
            text: i18n.t('Your post will be checked before it gets published.')
          })(dispatch)
        } else {
          notificationsActions.show({
            type: 'success',
            title: i18n.t('Thank you for your post.'),
            text: i18n.t('Your post published.')
          })(dispatch)
        }
        // Reload discussion.
        fetchDiscussion(
          data.discussionId,
          { page: 1 },
          data.discussionType
        )(dispatch)
      })
      .catch(error => {
        dispatch({
          type: POST_DISCUSSION_FAIL,
          error
        })
      })
  }
}

export function sendErrorNotification(title, message) {
  return async dispatch => {
    notificationsActions.show({
      type: 'error',
      title: title,
      text: message
    })(dispatch)
  }
}

export function likeDislikeReview(data) {
  return async dispatch => {
    dispatch({
      type: LIKE_DISLIKE_REVIEW_REQUEST
    })
    try {
      await Api.post('/sra_product_reviews_votes', {
        action: data.action,
        product_review_id: data.product_review_id
      })
      dispatch({
        type: LIKE_DISLIKE_REVIEW_SUCCESS,
        payload: {
          productId: data.productId,
          reviewAction: data.action,
          productReviewId: data.product_review_id
        }
      })
    } catch (error) {
      dispatch({
        type: LIKE_DISLIKE_REVIEW_FAIL,
        error
      })
    }
  }
}

export function sendReview(data) {
  return async dispatch => {
    dispatch({
      type: POST_SEND_REVIEW_REQUEST
    })
    try {
      await Api.post('/sra_product_reviews', data)
      dispatch({
        type: POST_SEND_REVIEW_SUCCESS
      })
      notificationsActions.show({
        type: 'success',
        title: i18n.t('Thank you for your post.'),
        text: i18n.t('Your post will be checked before it gets published.')
      })(dispatch)
    } catch (error) {
      notificationsActions.show({
        type: 'error',
        title: i18n.t('Error'),
        text: Object.keys(error.response.data.errors).map(text => i18n.t(text)).join('\n')
      })(dispatch)
      dispatch({
        type: POST_SEND_REVIEW_FAIL,
        error
      })
    }
  }
}

export function recalculatePrice(pid, options) {
  return async dispatch => {
    dispatch({ type: RECALCULATE_PRODUCT_PRICE_REQUEST })

    const optionsUrl = formatOptionsToUrl('selected_options', options)

    try {
      const response = await Api.get(`sra_products/${pid}/?${optionsUrl}`)
      const product = convertProduct(response.data)

      if (product.isProductOffer) {
        product.productOffers = await fetchProductOffers(pid, product)(dispatch)
      }

      dispatch({ type: RECALCULATE_PRODUCT_PRICE_SUCCESS })
      return product
    } catch (error) {
      dispatch({
        type: RECALCULATE_PRODUCT_PRICE_FAIL,
        error
      })
    }
  }
}

export function fetch(pid) {
  return async dispatch => {
    dispatch({
      type: FETCH_ONE_PRODUCT_REQUEST
    })

    try {
      const response = await Api.get(`/sra_products/${pid}`)
      const product = convertProduct(response.data)

      if (product.rating) {
        await fetchDiscussion(pid)(dispatch)
      }

      if (product.isProductOffer) {
        product.productOffers = await fetchProductOffers(pid, product)(dispatch)
      }

      dispatch({
        type: FETCH_ONE_PRODUCT_SUCCESS
      })

      dispatch({
        type: SET_PRODUCT_REVIEWS,
        payload: product
      })

      return product
    } catch (error) {
      dispatch({
        type: FETCH_ONE_PRODUCT_FAIL,
        error
      })
    }
  }
}

export function fetchProductOffers(pid, product) {
  return dispatch => {
    dispatch({ type: FETCH_COMMON_PRODUCTS_REQUEST })

    const optionsUrl = formatOptionsToUrl(
      'master_product_data[product_options]',
      product.selectedOptions
    )

    return Api.get(
      `/sra_products/?vendor_products_by_product_id=${pid}&sort_by=price&include_child_variations=1&group_child_variations=1&is_vendor_products_list=1&${optionsUrl}`
    )
      .then(response => {
        dispatch({
          type: FETCH_COMMON_PRODUCTS_SUCCESS
        })
        return response.data
      })
      .catch(error => {
        dispatch({
          type: FETCH_COMMON_PRODUCTS_FAIL,
          error
        })
      })
  }
}

export function search(params = {}) {
  return dispatch => {
    dispatch({ type: SEARCH_PRODUCTS_REQUEST })

    return Api.get('/sra_products', {
      params: {
        items_per_page: 50,
        ...params
      }
    })
      .then(response => {
        dispatch({
          type: SEARCH_PRODUCTS_SUCCESS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: SEARCH_PRODUCTS_FAIL,
          error
        })
      })
  }
}

export function fetchByCategory(
  categoryId,
  page = 1,
  companyId = false,
  advParams = {}
) {
  const params = {
    page,
    subcats: 'Y',
    items_per_page: 10,
    company_id: companyId || '',
    get_filters: true,
    ...advParams
  }

  return dispatch => {
    dispatch({ type: FETCH_PRODUCTS_REQUEST })
    return Api.get(`/categories/${categoryId}/sra_products`, { params })
      .then(response => {
        dispatch({
          type: FETCH_PRODUCTS_SUCCESS,
          payload: response.data
        })
      })
      .catch(error => {
        dispatch({
          type: FETCH_PRODUCTS_FAIL,
          error
        })
      })
  }
}

export function changeSort(params) {
  return dispatch => {
    dispatch({
      type: CHANGE_PRODUCTS_SORT,
      payload: params
    })
  }
}

export function showRequiredOptionNotification() {
  return dispatch => {
    notificationsActions.show({
      type: 'error',
      title: i18n.t('Warning'),
      text: i18n.t('There is a mandatory field.')
    })(dispatch)
  }
}

export function fetchBlocks(product_id, location = 'products.view') {
  const layoutId = store.getState().settings.layoutId
  const dynamic_object = {
    object_type: 'products',
    object_id: product_id
  }

  Api.interceptors.request.use(config => {
    config.paramsSerializer = params => {
      return qs.stringify(params, {
        arrayFormat: 'brackets',
        encode: false
      })
    }

    return config
  })

  return dispatch => {
    dispatch({ type: FETCH_PRODUCT_BLOCKS_REQUEST })

    Api.get(
      `/sra_bm_layouts/${layoutId}/sra_bm_locations/${location}/sra_bm_blocks?product_id=${product_id}`,
      {
        params: {
          dynamic_object,
          location,
          index_keys: 1
        }
      }
    )
      .then(response => {
        dispatch({
          type: FETCH_PRODUCT_BLOCKS_SUCCESS,
          payload: {
            blocks: response.data,
            location
          }
        })
      })
      .catch(error => {
        dispatch({
          type: FETCH_PRODUCT_BLOCKS_FAIL,
          payload: error.response.data
        })
      })
  }
}
