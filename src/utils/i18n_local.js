import { NativeModules, Platform } from 'react-native'
import i18n from 'gettext.js'
import store from '../redux/store'

const { settings } = store.getState()
const settingsLanguage = settings.selectedLanguage.langCode
const gettext = i18n()

const platformLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier

export const deviceLanguage = platformLanguage.split('_')[0]

const currentLanguage =
  typeof settingsLanguage === 'undefined' ? deviceLanguage : settingsLanguage

const langs = ['ar', 'ru', 'en', 'fr', 'it', 'es']
let jsonData

if (langs.includes(currentLanguage)) {
  switch (currentLanguage) {
    case 'ru':
      jsonData = require('../config/locales/ru.json')
      break
    case 'ar':
      jsonData = require('../config/locales/ar.json')
      break
    case 'fr':
      jsonData = require('../config/locales/fr.json')
      break
    case 'it':
      jsonData = require('../config/locales/it.json')
      break
    case 'es':
      jsonData = require('../config/locales/es.json')
      break
    default:
      jsonData = require('../config/locales/en.json')
  }

  gettext.setLocale(currentLanguage)
  gettext.loadJSON(jsonData)
}

gettext.t = gettext.gettext

export default gettext
