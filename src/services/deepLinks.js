import i18n from '../utils/i18n'
import config from '../config'
import store from '../redux/store'
import { parseQueryString } from '../utils/index'

export const registerDrawerDeepLinks = (event, navigation) => {
  const { auth, settings } = store.getState()

  const { payload, link } = event
  const params = parseQueryString(link)

  if (params.dispatch === 'pages.view' && params.page_id) {
    navigation.navigate('Page', {
      title: payload.title,
      uri: `${config.siteUrl}index.php?dispatch=pages.view&page_id=${params.page_id}&s_layout=${settings.layoutId}&sl=${settings.selectedLanguage.langCode}`
    })
  } else if (params.dispatch === 'cart.content') {
    navigation.navigate('Cart')
  } else if (params.dispatch === 'products.view' && params.product_id) {
    navigation.navigate('ProductDetail', {
      pid: params.product_id,
      payload
    })
  } else if (params.dispatch === 'categories.view' && params.category_id) {
    navigation.navigate('Categories', {
      categoryId: params.category_id
    })
  } else if (params.dispatch === 'companies.products' && params.company_id) {
    navigation.navigate('Vendor', {
      companyId: params.company_id
    })
  } else if (params.dispatch === 'companies.view' && params.company_id) {
    navigation.navigate('VendorDetail', {
      vendorId: params.company_id
    })
  } else if (link === 'home/') {
    navigation.navigate('HomeScreen')
  } else if (link === 'vendor/orders/') {
    navigation.navigate('VendorManageOrders')
  } else if (link === 'vendor/add_product/') {
    navigation.navigate('VendorManageCategoriesPicker', {
      title: i18n.t('Categories').toUpperCase(),
      parent: 0
    })
  } else if (link === 'vendor/products/') {
    navigation.navigate('VendorManageProducts')
  } else if (link.startsWith('http://') || link.startsWith('https://')) {
    navigation.navigate('Page', {
      title: payload.title,
      uri: link
    })
  }

  if (auth.logged) {
    if (params.dispatch === 'profiles.update') {
      navigation.navigate('ProfileEdit')
    } else if (params.dispatch === 'orders.details' && params.order_id) {
      navigation.navigate('OrderDetail', {
        orderId: params.order_id
      })
    } else if (params.dispatch === 'orders.search') {
      navigation.navigate('Orders')
    }
  }
}
