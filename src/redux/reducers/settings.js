import { get } from 'lodash'
import { Platform } from 'react-native'
import {
  SET_CURRENCY,
  SET_LANGUAGE,
  GET_CURRENCIES,
  GET_LANGUAGES,
  RESTORE_STATE,
  LANGUAGE_CURRENCY_FEATURE_FLAG_OFF,
  SHOP_CLOSED,
  GET_SOCIAL_LOGIN_LINKS,
  SET_ADDONS_SETTINGS,
  SET_LAYOUT_ID,
  FETCH_LAYOUTS_BLOCKS_SUCCESS,
  CATEGORY_VIEW_WITHOUT_IMAGE,
  BLOCK_CATEGORIES
} from '../../constants'

const initialState = {
  selectedCurrency: {
    symbol: '',
    currencyCode: ''
  },
  selectedLanguage: {
    langCode: '',
    name: ''
  },
  wishlistAddon: {
    isEnabled: true
  },
  productReviewsAddon: {
    isEnabled: false,
    isCommentOnly: false
  },
  dateFormat: '',
  languageCurrencyFeatureFlag: true,
  languages: null,
  currencies: null,
  isShopClosed: false,
  socialLoginLinks: {},
  checkout: {
    allowAnonymousShopping: ''
  },
  layoutId: null,
  categoryAppearance: CATEGORY_VIEW_WITHOUT_IMAGE,
  termsOfServiceUrl: '',
  showInStockField: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_LAYOUT_ID:
      return {
        ...state,
        layoutId: action.payload
      }
    case FETCH_LAYOUTS_BLOCKS_SUCCESS:
      let categoryAppearance = CATEGORY_VIEW_WITHOUT_IMAGE
      Object.keys(action.payload.blocks).forEach(block_id => {
        if (action.payload.blocks[block_id].type === BLOCK_CATEGORIES) {
          categoryAppearance =
            action.payload.blocks[block_id].properties.category_appearance
        }
      })

      return {
        ...state,
        categoryAppearance
      }
    case SET_CURRENCY:
      const newSelectedCurrency = {
        currencyCode: action.payload.currencyCode,
        symbol: action.payload.symbol
      }
      return {
        ...state,
        selectedCurrency: newSelectedCurrency
      }

    case GET_CURRENCIES:
      return {
        ...state,
        languageCurrencyFeatureFlag: true,
        currencies: action.payload.map(el => {
          return {
            selected: el.currency_code === state.selectedCurrency.currencyCode,
            currencyCode: el.currency_code,
            symbol: el.symbol
          }
        })
      }

    case SET_LANGUAGE:
      const newSelectedLanguage = {
        langCode: action.payload.langCode,
        name: action.payload.name
      }
      return {
        ...state,
        selectedLanguage: newSelectedLanguage
      }

    case GET_LANGUAGES:
      return {
        ...state,
        languageCurrencyFeatureFlag: true,
        languages: action.payload.map(el => {
          return {
            selected: el.lang_code === state.selectedLanguage.langCode,
            langCode: el.lang_code,
            name: el.name
          }
        })
      }

    case LANGUAGE_CURRENCY_FEATURE_FLAG_OFF:
      return {
        ...state,
        languageCurrencyFeatureFlag: false
      }

    case GET_SOCIAL_LOGIN_LINKS:
      let allowedSocialLinks = ['facebook', 'google']
      if (Platform.OS === 'android') {
        allowedSocialLinks = ['google']
      }

      const filteredSocialLoginLinks = {}

      Object.keys(action.payload).forEach(provider => {
        if (allowedSocialLinks.includes(provider)) {
          filteredSocialLoginLinks[provider] = action.payload[provider]
        }
      })
      return {
        ...state,
        socialLoginLinks: filteredSocialLoginLinks
      }

    case SHOP_CLOSED:
      return {
        ...state,
        isShopClosed: true
      }

    case SET_ADDONS_SETTINGS:
      const dateFormat = get(
        action.payload,
        'settings.appearance.calendar_date_format'
      )
      const quantity_tracking = get(
        action.payload,
        'settings.general.quantity_tracking'
      )
      action.payload === 'day_first' ? 'dd/MM/yyyy' : 'MM/dd/yyyy'
      const productReviewsAddon = get(action.payload, 'addons.product_reviews')
      const allowAnonymousShopping = get(
        action.payload,
        'settings.checkout.allow_anonymous_shopping'
      )
      const wishlistAddon = get(action.payload, 'addons.wishlist')
      const isCommentOnly =
        productReviewsAddon?.review_fields.length === 1 ? true : false

      return {
        ...state,
        productReviewsAddon: {
          isEnabled: productReviewsAddon?.is_enabled,
          isCommentOnly
        },
        checkout: {
          allowAnonymousShopping,
          wishlistAddon: {
            isEnabled: wishlistAddon?.is_enabled
          }
        },
        dateFormat: dateFormat === 'day_first' ? 'dd/MM/yyyy' : 'MM/dd/yyyy',
        quantity_tracking: quantity_tracking,
        termsOfServiceUrl: get(
          action.payload,
          'settings.general.termsOfServiceUrl'
        ),
        showInStockField: get(
          action.payload,
          'settings.appearance.show_in_stock_field'
        )
      }

    case RESTORE_STATE:
      return {
        ...state,
        ...action.payload.settings
      }

    default:
      return state
  }
}
