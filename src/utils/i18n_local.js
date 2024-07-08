import { NativeModules, Platform } from 'react-native';
import i18n from 'gettext.js';
import store from '../redux/store';

const { settings } = store.getState();
const settingsLanguage = settings.selectedLanguage?.langCode;
const gettext = i18n();

console.log(`Settings language: ${settingsLanguage}`);

const platformLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale ||
      NativeModules.SettingsManager.settings.AppleLanguages[0]
    : NativeModules.I18nManager.localeIdentifier;

console.log(`Platform language: ${platformLanguage}`);

export const deviceLanguage = platformLanguage ? platformLanguage.split('_')[0] : 'en'; 
console.log(`Device language: ${deviceLanguage}`);

const currentLanguage = settingsLanguage || deviceLanguage;
console.log(`Current language: ${currentLanguage}`);

const langs = ['ar', 'ru', 'en', 'fr', 'it', 'es'];
let jsonData;

try {
  if (langs.includes(currentLanguage)) {
    switch (currentLanguage) {
      case 'ru':
        jsonData = require('../config/locales/ru.json');
        break;
      case 'ar':
        jsonData = require('../config/locales/ar.json');
        break;
      case 'fr':
        jsonData = require('../config/locales/fr.json');
        break;
      case 'it':
        jsonData = require('../config/locales/it.json');
        break;
      case 'es':
        jsonData = require('../config/locales/es.json');
        break;
      default:
        jsonData = require('../config/locales/en.json');
    }

    console.log('Loaded JSON data:', jsonData);

    if (!jsonData[''] || !jsonData[''].language || !jsonData['']['plural-forms']) {
      throw new Error('JSON must contain an empty key ("") with "language" and "plural-forms" information');
    }

    gettext.setLocale(currentLanguage);
    gettext.loadJSON(jsonData);
  } else {
    console.warn(`Language ${currentLanguage} not supported. Falling back to default language.`);
  }
} catch (error) {
  console.error('Error loading translation JSON:', error);
}

gettext.t = gettext.gettext;

export default gettext;
