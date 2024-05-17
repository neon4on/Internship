import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  debug: false,
  nsSeparator: ':::',
  keySeparator: false,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
    prefix: '{{',
    suffix: '}}'
  }
})

export default i18n
