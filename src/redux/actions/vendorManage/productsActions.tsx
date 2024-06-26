import {
  VENDOR_FETCH_PRODUCTS_REQUEST,
  VENDOR_FETCH_PRODUCTS_FAIL,
  VENDOR_FETCH_PRODUCTS_SUCCESS,
  VENDOR_FETCH_PRODUCT_REQUEST,
  VENDOR_FETCH_PRODUCT_FAIL,
  VENDOR_FETCH_PRODUCT_SUCCESS,
  VENDOR_DELETE_PRODUCT_REQUEST,
  VENDOR_DELETE_PRODUCT_FAIL,
  VENDOR_DELETE_PRODUCT_SUCCESS,
  VENDOR_UPDATE_PRODUCT_REQUEST,
  VENDOR_UPDATE_PRODUCT_FAIL,
  VENDOR_UPDATE_PRODUCT_SUCCESS,
  VENDOR_CREATE_PRODUCT_REQUEST,
  VENDOR_CREATE_PRODUCT_FAIL,
  VENDOR_CREATE_PRODUCT_SUCCESS,
  VENDOR_PRODUCT_CHANGE_CATEGORY,
  VENDOR_FETCH_PRODUCT_FEATURES_REQUEST,
  VENDOR_FETCH_PRODUCT_FEATURES_SUCCESS,
  VENDOR_FETCH_PRODUCT_FEATURES_FAIL,
  UPDATE_LOCAL_PRODUCT_FEATURES
} from '../../../constants'
import * as vendorService from '../../../services/vendors'
import { convertProductFeatures } from '../../../services/VendorManageProductFeatures'
import i18n from '../../../utils/i18n'
import * as notificationsActions from '../notificationsActions'

export function fetchProducts(page = 0) {
  return async dispatch => {
    dispatch({
      type: VENDOR_FETCH_PRODUCTS_REQUEST,
      payload: page
    })
    const nextPage = page + 1

    try {
      const result = await vendorService.getProductsList(nextPage)
      dispatch({
        type: VENDOR_FETCH_PRODUCTS_SUCCESS,
        payload: {
          items: result.data.products,
          page: nextPage,
          hasMore: result.data.products.length !== 0
        }
      })
    } catch (error) {
      dispatch({
        type: VENDOR_FETCH_PRODUCTS_FAIL,
        error
      })
    }
  }
}

export function fetchProduct(id = 0, loading = true) {
  return async dispatch => {
    dispatch({
      type: VENDOR_FETCH_PRODUCT_REQUEST,
      payload: loading
    })

    try {
      const result = await vendorService.getProductDetail(id)
      dispatch({
        type: VENDOR_FETCH_PRODUCT_SUCCESS,
        payload: result.data.product
      })
    } catch (error) {
      dispatch({
        type: VENDOR_FETCH_PRODUCT_FAIL,
        error
      })
    }
  }
}

export function fetchProductFeatures(id) {
  return async dispatch => {
    dispatch({
      type: VENDOR_FETCH_PRODUCT_FEATURES_REQUEST
    })

    try {
      const result = await vendorService.getProductFeatures(id)
      const featuresListWithoutValues =
        await vendorService.getProductFeaturesList(id)

      const convertedFeatures = convertProductFeatures(
        result.data.product.product_features,
        featuresListWithoutValues.data.product_features
      )

      dispatch({
        type: VENDOR_FETCH_PRODUCT_FEATURES_SUCCESS,
        payload: convertedFeatures
      })

      return convertedFeatures
    } catch (error) {
      dispatch({
        type: VENDOR_FETCH_PRODUCT_FEATURES_FAIL,
        error
      })
    }
  }
}

export function updateLocalProductFeatures(productFeatures) {
  return async dispatch => {
    dispatch({
      type: UPDATE_LOCAL_PRODUCT_FEATURES,
      payload: productFeatures
    })
  }
}

export function updateProductFeatures(productId, data) {
  return async dispatch => {
    dispatch({
      type: VENDOR_FETCH_PRODUCT_FEATURES_REQUEST
    })

    try {
      await vendorService.changeProductFeatures(productId, data)

      dispatch({
        type: VENDOR_FETCH_PRODUCT_FEATURES_SUCCESS
      })
      notificationsActions.show({
        type: 'success',
        title: i18n.t('Success'),
        text: i18n.t('Your changes have been saved.')
      })(dispatch)
    } catch (error) {
      dispatch({
        type: VENDOR_FETCH_PRODUCT_FEATURES_FAIL,
        error
      })
    }
  }
}

export function deleteProduct(id = null) {
  return async dispatch => {
    dispatch({
      type: VENDOR_DELETE_PRODUCT_REQUEST
    })

    try {
      await vendorService.deleteProduct(id)
      dispatch({
        type: VENDOR_DELETE_PRODUCT_SUCCESS,
        payload: id
      })
      notificationsActions.show({
        type: 'success',
        title: i18n.t('Success'),
        text: i18n.t('The product was deleted')
      })(dispatch)
    } catch (error) {
      dispatch({
        type: VENDOR_DELETE_PRODUCT_FAIL,
        error
      })
    }
  }
}

export function updateProduct(id = null, product = {}) {
  return async dispatch => {
    dispatch({
      type: VENDOR_UPDATE_PRODUCT_REQUEST,
      payload: {
        id,
        product
      }
    })

    try {
      await vendorService.updateProduct(id, product)
      dispatch({
        type: VENDOR_UPDATE_PRODUCT_SUCCESS,
        payload: {
          id,
          product
        }
      })
      notificationsActions.show({
        type: 'success',
        title: i18n.t('Success'),
        text: i18n.t('The product was updated')
      })(dispatch)
    } catch (error) {
      dispatch({
        type: VENDOR_UPDATE_PRODUCT_FAIL,
        error
      })
    }
  }
}

export function createProduct(product) {
  return async dispatch => {
    dispatch({
      type: VENDOR_CREATE_PRODUCT_REQUEST
    })

    try {
      const result = await vendorService.createProduct(product)

      if (result.errors && result.errors.length) {
        notificationsActions.show({
          type: 'warning',
          title: i18n.t('Error'),
          text: i18n.t(result.errors.join('\n'))
        })(dispatch)
        return null
      }

      notificationsActions.show({
        type: 'success',
        title: i18n.t('Success'),
        text: i18n.t('The product was created')
      })(dispatch)

      dispatch({
        type: VENDOR_CREATE_PRODUCT_SUCCESS,
        payload: result
      })

      return result.data.create_product
    } catch (error) {
      dispatch({
        type: VENDOR_CREATE_PRODUCT_FAIL,
        error
      })
    }

    return null
  }
}

export function changeProductCategory(categories) {
  return dispatch => {
    dispatch({
      type: VENDOR_PRODUCT_CHANGE_CATEGORY,
      payload: [categories]
    })
  }
}
