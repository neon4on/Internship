import axios from 'axios'
import base64 from 'base-64'
import config from '../config'
import store from '../redux/store'
import { AUTH_LOGOUT, SHOP_CLOSED } from '../constants'

// Config axios defaults.
const AxiosInstance = axios.create({
  baseURL: config.baseUrl,
  timeout: 100000
})

AxiosInstance.interceptors.request.use(conf => {
  const state = store.getState()
  const newConf = { ...conf }
  newConf.headers['Storefront-Api-Access-Key'] = config.apiKey
  newConf.headers['Cache-Control'] = 'no-cache'

  newConf.params = conf.params || {}
  newConf.params.sl = state.settings.selectedLanguage.langCode
  newConf.params.items_per_page = conf.params?.items_per_page
    ? conf.params.items_per_page
    : 20
  newConf.params.s_layout = state.settings.layoutId
  newConf.params.lang_code = state.settings.selectedLanguage.langCode
  newConf.params.currency = state.settings.selectedCurrency.currencyCode

  if (state.auth.token) {
    newConf.headers.Authorization = `Basic ${base64.encode(
      state.auth.token
    )}:`
  }
  console.log(newConf)
  return newConf
})

AxiosInstance.interceptors.response.use(
  config => config,
  error => {
    if (error?.response?.status === 401) {
      console.log("Ошибка 401 (Unauthorized):", error);
      store.dispatch({
        type: AUTH_LOGOUT
      });
    } else if (error?.response?.status === 408 || error.code === 'ECONNABORTED') {
      console.log("Ошибка таймаута:", error);
      console.log(`Произошел тайм-аут запроса к URL ${error.config.url}`);
    } else if (error?.response?.status === 404) {
      console.log("Ошибка 404 (Not Found):", error);
      store.dispatch({
        type: SHOP_CLOSED
      });
    } else {
      console.log("Другая ошибка:", error);
    }
    return Promise.reject(error);
  }
)

export default AxiosInstance
