import { Dimensions } from 'react-native'
import has from 'lodash/has'
import get from 'lodash/get'
import values from 'lodash/values'
// import countries from '../config/countries'
import i18n from './i18n'
import {
  PRODUCT_STATUS_ACTIVE,
  PRODUCT_STATUS_HIDDEN,
  PRODUCT_STATUS_DISABLED,
  PRODUCT_STATUS_REQUIRES_APPROVAL,
  PRODUCT_STATUS_DISAPPROVED
} from '../constants/index'

// Calculate product image width and items count.
export const WINDOW_WIDTH = Dimensions.get('window').width
const PRODUCT_AVERAGE_SIZE_PHONE = 130
const PRODUCT_AVERAGE_SIZE_TABLET = 140
const MIN_TABLET_WIDTH = 480
const IMAGE_PADDING_PHONE = 16
const IMAGE_PADDING_TABLET = 32

const PRODUCT_AVERAGE_SIZE =
  WINDOW_WIDTH > MIN_TABLET_WIDTH
    ? PRODUCT_AVERAGE_SIZE_TABLET
    : PRODUCT_AVERAGE_SIZE_PHONE

const IMAGE_PADDING =
  WINDOW_WIDTH > MIN_TABLET_WIDTH ? IMAGE_PADDING_PHONE : IMAGE_PADDING_TABLET

export const MAX_WINDOW_WIDTH = WINDOW_WIDTH

export const PRODUCT_NUM_COLUMNS = Math.floor(
  WINDOW_WIDTH / PRODUCT_AVERAGE_SIZE
)
export const PRODUCT_IMAGE_WIDTH =
  Math.floor((WINDOW_WIDTH / PRODUCT_NUM_COLUMNS) * 10000) / 10000 -
  IMAGE_PADDING

// Strip tags
export const stripTags = str => {
  if (!str) {
    return str
  }
  return str
    .replace(/<br[^>]*>/gi, '\n')
    .replace(/(<([^>]+)>)/gi, '')
    .trimLeft()
}

export const formatPrice = str => {
  if (str) {
    return String(String(str).replace(' ', ' ')).replace(/&nbsp;/, ' ')
  }
  return str
}

export const getImagePath = (data, size = '500x500') => {
  if (has(data, `main_pair.icons.${size}.image_path`)) {
    return get(data, `main_pair.icons.${size}.image_path`)
  }

  if (has(data, 'main_pair.detailed.image_path')) {
    return get(data, 'main_pair.detailed.image_path')
  }

  if (has(data, 'main_pair.icon.image_path')) {
    return get(data, 'main_pair.icon.image_path')
  }

  return null
}

export const getProductImagesPaths = (data = {}, size = '1000x1000') => {
  const images = []
  if (has(data, `main_pair.icons.${size}.image_path`)) {
    images.push(get(data, `main_pair.icons.${size}.image_path`))
  } else if (has(data, 'main_pair.detailed.image_path')) {
    images.push(get(data, 'main_pair.detailed.image_path'))
  }

  values(data.image_pairs).forEach(img => {
    if (has(img, `icons.${size}.image_path`)) {
      images.push(get(img, `icons.${size}.image_path`))
    } else if (has(img, 'detailed.image_path')) {
      images.push(get(img, 'detailed.image_path'))
    } else if (has(img, 'icon.image_path')) {
      images.push(get(img, 'icon.image_path'))
    }
  })

  return images
}

export const toArray = obj => (obj ? Object.keys(obj).map(k => obj[k]) : [])

export const filterObject = (obj, predicate) => {
  return Object.keys(obj)
    .filter(key => predicate(obj[key]))
    .reduce((res, key) => ((res[key] = obj[key]), res), {})
}

export function getCountries() {
  const result = {}
  countries.forEach(item => {
    if (!result[item.code]) {
      result[item.code] = item.name
    }
  })

  return result
}

export function getStates(code) {
  const result = {}
  const country = countries.find(i => i.code === code)
  if (!country || !country.states.length) {
    return null
  }
  country.states.forEach(item => {
    if (!result[item.code]) {
      result[`${item.code}`] = item.name
    }
  })
  return result
}

export function isPriceIncludesTax(data) {
  const taxes = values(get(data, 'taxes', {}))

  return taxes.some(item => get(item, 'price_includes_tax', 'N') === 'Y')
}

export function getCountryByCode(code) {
  const country = countries.find(i => i.code === code)
  if (!country) {
    return null
  }
  return country
}

export function objectToQuerystring(obj) {
  const str = []
  for (let p in obj) {
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
    }
  }
  return str.join('&')
}

export function parseQueryString(query) {
  const obj = {}
  const qPos = query.indexOf('?')
  const tokens = query.substr(qPos + 1).split('&')

  i = tokens.length - 1

  if (qPos !== -1 || query.indexOf('=') !== -1) {
    for (; i >= 0; i--) {
      const s = tokens[i].split('=')
      obj[unescape(s[0])] = s.hasOwnProperty(1) ? unescape(s[1]) : null
    }
  }
  return obj
}

export function getProductStatus(status) {
  switch (status) {
    case PRODUCT_STATUS_ACTIVE:
      return {
        text: i18n.t('Active'),
        style: { color: '#97cf4d' }
      }

    case PRODUCT_STATUS_HIDDEN:
      return {
        text: i18n.t('Hidden'),
        style: { color: '#000000' }
      }

    case PRODUCT_STATUS_DISABLED:
      return {
        text: i18n.t('Disabled'),
        style: { color: '#ff0000' }
      }

    case PRODUCT_STATUS_REQUIRES_APPROVAL:
      return {
        text: i18n.t('Requires approval'),
        style: { color: '#ff9c12' }
      }

    case PRODUCT_STATUS_DISAPPROVED:
      return {
        text: i18n.t('Disapproved'),
        style: { color: '#ff2b2b' }
      }

    default:
      return {
        text: i18n.t(''),
        style: { color: '#000000' }
      }
  }
}

export const getPaymentId = res => {
  Object.keys(res.data.payments).forEach(key => {
    res.data.payments[key].payment_id = key
  })
  return res
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value)
}

export function escapeRegExp(str) {
  return str.replace(/[|\\/]/g, '\\')
}

export function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

export function isDarkBackground(color) {
  color = hexToRgb(color)

  if (!color) {
    return false
  }

  const luminance = (0.299 * color.r + 0.587 * color.g + 0.114 * color.b) / 255
  return luminance > 0.5 ? false : true
}
