import { Platform, I18nManager } from 'react-native'
import { Dispatch } from 'redux'
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import { stripTags } from '../../utils/index'
import RNRestart from 'react-native-restart'

import {
  AuthActionTypes,
  DeviceInfoData,
  CreateProfileParams,
  LoginData,
  UpdateProfileParams
} from '../types/authTypes'

import {
  AUTH_LOGIN_REQUEST,
  AUTH_LOGIN_SUCCESS,
  AUTH_LOGIN_FAIL,
  AUTH_RESET_STATE,
  AUTH_REGESTRATION_REQUEST,
  AUTH_REGESTRATION_SUCCESS,
  AUTH_REGESTRATION_FAIL,
  REGISTER_DEVICE_REQUEST,
  REGISTER_DEVICE_SUCCESS,
  REGISTER_DEVICE_FAIL,
  FETCH_PROFILE_FIELDS_REQUEST,
  FETCH_PROFILE_FIELDS_SUCCESS,
  FETCH_PROFILE_FIELDS_FAIL,
  FETCH_PROFILE_REQUEST,
  FETCH_PROFILE_SUCCESS,
  FETCH_PROFILE_FAIL,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAIL,
  AUTH_LOGOUT,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILED,
  UNSUBSCRIBE_FROM_NOTIFICATIONS_REQUEST,
  UNSUBSCRIBE_FROM_NOTIFICATIONS_SUCCESS,
  UNSUBSCRIBE_FROM_NOTIFICATIONS_FAIL,
  AUTH_LOADING,
  AUTH_LOADED,
  DELETE_ACCOUNT_REQUEST,
  DELETE_ACCOUNT_SUCCESS,
  DELETE_ACCOUNT_FAILED
} from '../../constants'
import Api from '../../services/api'
import i18n from '../../utils/i18n'
import store from '../store'

// Actions
import * as settingsActions from './settingsActions'
import * as cartActions from './cartActions'
import * as layoutsActions from './layoutsActions'
import * as wishListActions from './wishListActions'
import * as notificationsActions from './notificationsActions'

const { settings } = store.getState()

export function fetchProfile() {
  const params = {
    langCode: settings.selectedLanguage.langCode
  }

  return (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: FETCH_PROFILE_REQUEST })

    return Api.get('/sra_profile', { params })
      .then(response => {
        cartActions.fetch(undefined, {})(dispatch)
        wishListActions.fetch(false)(dispatch)
        dispatch({
          type: FETCH_PROFILE_SUCCESS,
          payload: {
            ...response.data
          }
        })
        return response.data
      })
      .catch(error => {
        dispatch({
          type: FETCH_PROFILE_FAIL,
          payload: error
        })
      })
  }
}

export function profileFields(data = {}) {
  const params = {
    location: 'profile',
    action: 'add',
    langCode: settings.selectedLanguage.langCode,
    ...data
  }

  let method = '/sra_profile'
  if (params.location === 'profile' && params.action === 'add') {
    method = '/sra_profile_fields' // at Registration.js app has not access to /sra_profile
  }

  return (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: FETCH_PROFILE_FIELDS_REQUEST })
    return Api.get(method, { params })
      .then(response => {
        dispatch({
          type: FETCH_PROFILE_FIELDS_SUCCESS,
          payload: {
            ...data,
            ...response.data
          }
        })
        return response.data
      })
      .catch(error => {
        dispatch({
          type: FETCH_PROFILE_FIELDS_FAIL,
          payload: error
        })
      })
  }
}

export function updateProfile(id: string, data: UpdateProfileParams) {
  return (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: UPDATE_PROFILE_REQUEST })
    return Api.put(`/sra_profile/${id}`, data)
      .then(() => {
        dispatch({
          type: UPDATE_PROFILE_SUCCESS,
          payload: {}
        })
        notificationsActions.show({
          type: 'success',
          title: i18n.t('Profile'),
          text: i18n.t('The profile data has been updated successfully')
        })(dispatch)
      })
      .catch(error => {
        dispatch({
          type: UPDATE_PROFILE_FAIL,
          payload: error
        })
        notificationsActions.show({
          type: 'warning',
          title: i18n.t('Profile update fail'),
          text: stripTags(error.response.data.message)
        })(dispatch)
      })
  }
}

export function createProfile(data: CreateProfileParams) {
  return (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_REGESTRATION_REQUEST })
    return Api.post('/sra_profile', data)
      .then(response => {
        dispatch({
          type: AUTH_REGESTRATION_SUCCESS,
          payload: {
            token: response.data.auth.token,
            ttl: response.data.auth.ttl,
            profile_id: response.data.profile_id,
            user_id: response.data.user_id
          }
        })
        notificationsActions.show({
          type: 'success',
          title: i18n.t('Registration'),
          text: i18n.t('Registration complete.')
        })(dispatch)
      })
      .then(() => messaging().getToken())
      .then(token => {
        const { auth, settings } = store.getState()
        deviceInfo({
          platform: Platform.OS,
          locale: settings.selectedLanguage.langCode,
          device_id: auth.uuid,
          token
        })(dispatch)
      })
      .catch(error => {
        dispatch({
          type: AUTH_REGESTRATION_FAIL,
          payload: error
        })
        notificationsActions.show({
          type: 'warning',
          title: i18n.t('Registration failed'),
          text: stripTags(error.response.data.message)
        })(dispatch)
      })
  }
}

export function deviceInfo(data: DeviceInfoData) {
  return (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: REGISTER_DEVICE_REQUEST })
    return Api.post('/sra_notifications', data)
      .then(response => {
        dispatch({
          type: REGISTER_DEVICE_SUCCESS,
          payload: {
            ...data,
            ...response.data
          }
        })
      })
      .catch(error => {
        dispatch({
          type: REGISTER_DEVICE_FAIL,
          payload: error
        })
      })
  }
}

export function unsubscribeNotifications(id: number) {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: UNSUBSCRIBE_FROM_NOTIFICATIONS_REQUEST })
    try {
      await Api.delete(`/sra_notifications/${id}`)
      dispatch({ type: UNSUBSCRIBE_FROM_NOTIFICATIONS_SUCCESS })
    } catch (error) {
      dispatch({ type: UNSUBSCRIBE_FROM_NOTIFICATIONS_FAIL })
      console.log('Unsubscribe from notifications failed.', error)
    }
  }
}

export const getUserData = response => {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    try {
      dispatch({
        type: AUTH_LOGIN_SUCCESS,
        payload: response.data
      })

      await cartActions.fetch(undefined, {})(dispatch)
      await wishListActions.fetch(false)(dispatch)

      // Delay send refresh token.
      setTimeout(() => {
        const { auth, settings } = store.getState()
        deviceInfo({
          token: auth.deviceToken,
          platform: Platform.OS,
          locale: settings.selectedLanguage.langCode,
          device_id: auth.uuid
        })(dispatch)
      }, 1000)

      await fetchProfile()(dispatch)
      await layoutsActions.fetch()(dispatch)
    } catch (error) {
      dispatch({
        type: AUTH_LOGIN_FAIL,
        payload: error.response.data
      })
      notificationsActions.show({
        type: 'warning',
        title: i18n.t('Error'),
        text: i18n.t('Wrong password.')
      })(dispatch)
    }
  }
}

export function login(data: LoginData) {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({ type: AUTH_LOGIN_REQUEST })
    try {
      const res = await Api.post('/sra_auth_tokens', data)

      return res
    } catch (error) {
      dispatch({
        type: AUTH_LOGIN_FAIL,
        payload: error.response.data
      })
      notificationsActions.show({
        type: 'warning',
        title: i18n.t('Error'),
        text: i18n.t('Wrong password.')
      })(dispatch)
    }
  }
}

export function logout() {
  return (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({
      type: AUTH_LOGOUT
    })

    settingsActions.setLanguage(settings.selectedLanguage)
    RNRestart.Restart()
  }
}

export function resetState() {
  return (dispatch: Dispatch<AuthActionTypes>) =>
    dispatch({ type: AUTH_RESET_STATE })
}

export function resetPassword(data) {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({
      type: RESET_PASSWORD_REQUEST
    })
    try {
      await Api.post('/sra_one_time_passwords', data)
      dispatch({
        type: RESET_PASSWORD_SUCCESS
      })
      notificationsActions.show({
        type: 'success',
        title: i18n.t('Success'),
        text: i18n.t(
          'The confirmation code has been sent to the {{email}}, type it below to log in.',
          { email: data.email }
        )
      })(dispatch)
      return true
    } catch (error) {
      dispatch({
        type: RESET_PASSWORD_FAILED
      })
      notificationsActions.show({
        type: 'warning',
        title: i18n.t('Error'),
        text: i18n.t(
          'The username you have entered does not match any account in our store. Please make sure you have entered the correct username and try again.'
        )
      })(dispatch)
      return false
    }
  }
}

export function loginWithOneTimePassword({ email, oneTimePassword }) {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    try {
      const res = await Api.post('/sra_auth_tokens', {
        email,
        one_time_password: oneTimePassword
      })

      return res
    } catch (error) {
      notificationsActions.show({
        type: 'warning',
        title: i18n.t('Error'),
        text: i18n.t('Incorrect code.')
      })(dispatch)
    }
  }
}

export function showRegistrationNotification(isSuccess: boolean) {
  return (dispatch: Dispatch<AuthActionTypes>) => {
    if (isSuccess) {
      notificationsActions.show({
        type: 'success',
        title: i18n.t('Registration'),
        text: i18n.t('Registration complete.')
      })(dispatch)
    } else {
      notificationsActions.show({
        type: 'warning',
        title: i18n.t('Registration failed'),
        text: i18n.t('Something went wrong. Please try again later.')
      })(dispatch)
    }
  }
}

export function authLoading() {
  return (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({
      type: AUTH_LOADING
    })
  }
}

export function authLoaded() {
  return (dispatch: Dispatch<AuthActionTypes>) => {
    dispatch({
      type: AUTH_LOADED
    })
  }
}

export function deleteAccount(token: string, comment: string) {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    try {
      dispatch({
        type: DELETE_ACCOUNT_REQUEST
      })
      await Api.post('/sra_account_removal_requests', {
        token,
        comment
      })
      dispatch({
        type: DELETE_ACCOUNT_SUCCESS
      })
      notificationsActions.show({
        type: 'success',
        title: i18n.t('Delete account'),
        text: i18n.t('Your request has been sent successfully.')
      })(dispatch)
    } catch (error) {
      dispatch({
        type: DELETE_ACCOUNT_FAILED
      })
      notificationsActions.show({
        type: 'warning',
        title: i18n.t('Account delete fail'),
        text: stripTags(error.response.data.message)
      })(dispatch)
    }
  }
}

export function appleSignUp(token: string) {
  return async (dispatch: Dispatch<AuthActionTypes>) => {
    try {
      dispatch({ type: AUTH_LOGIN_REQUEST })
      const res = await Api.post('/sra_apple_login', {
        identity_token: token
      })
      return res
    } catch (error) {
      console.log('error: ', error)
    }
  }
}
