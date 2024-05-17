import AsyncStorage from '@react-native-async-storage/async-storage'
import { get } from 'lodash'
import {
  STORE_KEY,
  RESTORE_STATE,
  GET_LANGUAGES,
  GET_CURRENCIES,
  SET_CURRENCY,
  SET_LANGUAGE,
  LANGUAGE_CURRENCY_FEATURE_FLAG_OFF,
  SET_UUID,
  GET_SOCIAL_LOGIN_LINKS,
  SET_ADDONS_SETTINGS,
  SET_LAYOUT_ID,
  WISH_LIST_FETCH_SUCCESS
} from '../../constants'
import API from '../../services/api'
import store from '../store'
import i18n from '../../utils/i18n'
import {
  NativeModules,
  Platform,
  I18nManager,
  PermissionsAndroid
} from 'react-native'
import DeviceInfo from 'react-native-device-info'
import config from '../../config'
import RNRestart from 'react-native-restart'

const covertLangCodes = (translations = []) => {
  const result = {}

  translations.forEach(translation => {
    result[`${translation.original_value}`] = translation.value
  })

  return result
}

// Gets languages, currencies and date format settings and sets them to the store.
export async function setStartSettings(currentLanguage, currentCurrency) {
  const platformLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier

  const deviceLanguage = platformLanguage.split('_')[0]

  try {
    const socialLogin = await API.get('sra_social_login')

    store.dispatch({
      type: GET_SOCIAL_LOGIN_LINKS,
      payload: socialLogin.data
    })
  } catch (e) {
    store.dispatch({
      type: GET_SOCIAL_LOGIN_LINKS,
      payload: {}
    })
    console.log('Social login error: ', e)
  }

  try {
    // Gets lists of languages and currencies
    const {
      data: { currencies, languages, properties }
    } = await API.get('sra_storefront')

    store.dispatch({
      type: SET_ADDONS_SETTINGS,
      payload: properties
    })

    store.dispatch({
      type: SET_LAYOUT_ID,
      payload: properties.layout_id
    })

    let isAbsentCurrency = true

    if (currentCurrency) {
      currencies.forEach(currency => {
        if (currency.currency_code === currentCurrency.currencyCode) {
          isAbsentCurrency = false
        }
      })
    }

    if (!currentCurrency?.currencyCode || isAbsentCurrency) {
      currencies.forEach(el => {
        if (el.is_default) {
          currentCurrency = {
            currencyCode: el.currency_code,
            symbol: el.symbol
          }
        }
      })

      if (
        !currentCurrency?.currencyCode &&
        currencies.length &&
        isAbsentCurrency
      ) {
        currentCurrency = {
          currencyCode: currencies[0].currency_code,
          symbol: currencies[0].symbol
        }
      }
    }

    store.dispatch({
      type: SET_CURRENCY,
      payload: currentCurrency
    })

    let isAbsentLanguage = true

    if (currentLanguage) {
      languages.forEach(language => {
        if (language.lang_code === currentLanguage.langCode) {
          isAbsentLanguage = false
        }
      })
    }

    if (!currentLanguage?.langCode || isAbsentLanguage) {
      // If the device language is among the languages of the store
      // use device language.
      let isDeviceLanguage = false
      languages.forEach(el => {
        if (el.lang_code === deviceLanguage) {
          isDeviceLanguage = true
        }
      })

      if (isDeviceLanguage) {
        currentLanguage = {
          langCode: deviceLanguage,
          name: deviceLanguage
        }
      } else {
        languages.forEach(el => {
          if (el.is_default) {
            currentLanguage = {
              langCode: el.lang_code,
              name: el.name
            }
          }
        })
      }

      store.dispatch({
        type: SET_LANGUAGE,
        payload: currentLanguage
      })
    }

    // Set list of languages and currencies to store
    store.dispatch({
      type: GET_CURRENCIES,
      payload: currencies
    })

    store.dispatch({
      type: GET_LANGUAGES,
      payload: languages
    })

    return currentLanguage
  } catch (e) {
    currentLanguage = {
      langCode: deviceLanguage,
      name: deviceLanguage
    }
    store.dispatch({
      type: SET_LANGUAGE,
      payload: currentLanguage
    })
    store.dispatch({
      type: LANGUAGE_CURRENCY_FEATURE_FLAG_OFF
    })
    console.log('Error loading languages and currencies', e)

    return currentLanguage
  }
}

export async function initApp() {
  let currentLanguage

  try {
    const persist = await AsyncStorage.getItem(STORE_KEY)

    if (persist) {
      store.dispatch({
        type: RESTORE_STATE,
        payload: JSON.parse(persist)
      })
    } else {
      store.dispatch({
        type: SET_UUID
      })
    }

    const savedLanguage = get(JSON.parse(persist), 'settings.selectedLanguage')
    const savedCurrency = get(JSON.parse(persist), 'settings.selectedCurrency')
    currentLanguage = await setStartSettings(savedLanguage, savedCurrency)

    const isUserLoggedIn = persist ? JSON.parse(persist).auth.logged : false

    if (isUserLoggedIn) {
      const profileResult = await API.get('/sra_wish_list', {
        langCode: currentLanguage.langCode
      })

      store.dispatch({
        type: WISH_LIST_FETCH_SUCCESS,
        payload: {
          ...profileResult.data
        }
      })
    }

    const isRTL = ['ar', 'he', 'fa'].includes(currentLanguage.langCode)
    await I18nManager.forceRTL(isRTL)

    if (isRTL && !I18nManager.isRTL) {
      RNRestart.Restart()
    }

    // Load remote lang variables
    const transResult = await API.get(
      `/sra_translations/?name=mobile_app.mobile_&lang_code=${currentLanguage.langCode}`
    )

    i18n.addResourceBundle(currentLanguage.langCode, 'translation', {
      ...covertLangCodes(transResult.data.langvars)
    })

    await setPushNotifications()
  } catch (error) {
    i18n.addResourceBundle(currentLanguage.langCode, 'translation')
    console.log('Error loading translations', error)
  }

  i18n.changeLanguage(currentLanguage.langCode)
}

export async function initAppNotConnected() {
  let currentLanguage

  try {
    const persist = await AsyncStorage.getItem(STORE_KEY)

    if (persist) {
      store.dispatch({
        type: RESTORE_STATE,
        payload: JSON.parse(persist)
      })
    } else {
      store.dispatch({
        type: SET_UUID
      })
    }

    const savedLanguage = get(JSON.parse(persist), 'settings.selectedLanguage')
    const savedCurrency = get(JSON.parse(persist), 'settings.selectedCurrency')
    currentLanguage = await setStartSettingsNotConnected(savedLanguage, savedCurrency)

    const isRTL = ['ar', 'he', 'fa'].includes(currentLanguage.langCode)
    await I18nManager.forceRTL(isRTL)

    if (isRTL && !I18nManager.isRTL) {
      RNRestart.Restart()
    }
  } catch (error) {
    console.log('Error loading translations', error)
  }
}

// Gets languages settings and sets them to the store.
export async function setStartSettingsNotConnected(currentLanguage, currentCurrency) {
  const platformLanguage =
    Platform.OS === 'ios'
      ? NativeModules.SettingsManager.settings.AppleLocale ||
        NativeModules.SettingsManager.settings.AppleLanguages[0]
      : NativeModules.I18nManager.localeIdentifier

  const deviceLanguage = platformLanguage.split('_')[0]

  try {
    store.dispatch({
      type: SET_LANGUAGE,
      payload: currentLanguage
    })
    return currentLanguage
  } catch (e) {
    currentLanguage = {
      langCode: deviceLanguage,
      name: deviceLanguage
    }
    store.dispatch({
      type: SET_LANGUAGE,
      payload: currentLanguage
    })
    store.dispatch({
      type: LANGUAGE_CURRENCY_FEATURE_FLAG_OFF
    })
    console.log('Error loading languages and currencies', e)

    return currentLanguage
  }
}

export async function setPushNotifications() {
  if (Platform.OS === 'android') {
    try {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        {
          title: i18n.t('App Notifications Permission'),
          message: i18n.t('Allow to send you notifications?'),
          buttonNegative: i18n.t('Cancel'),
          buttonPositive: i18n.t('OK')
        }
      )
    } catch (error) {
      let errorMessage = 'Permission error'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      console.log(errorMessage)
    }
  }
}
