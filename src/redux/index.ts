import { combineReducers } from 'redux'

import layouts from './reducers/layouts'
import auth from './reducers/auth'
import settings from './reducers/settings'
import wishList from './reducers/wishList'
import discussion from './reducers/discussion'
import profile from './reducers/profile'
import pages from './reducers/pages'
import cart from './reducers/cart'
import imagePicker from './reducers/imagePicker'
import orders from './reducers/orders'
import productReviews from './reducers/productReviews'
import products from './reducers/products'
import search from './reducers/search'
import steps from './reducers/steps'
import vendorCategories from './reducers/vendorCategories'
import vendors from './reducers/vendors'
import notifications from './reducers/notifications'

import vendorManageProducts from './reducers/VendorManage/products'
import vendorManageCategories from './reducers/VendorManage/categories'
import vendorManageOrders from './reducers/VendorManage/orders'

export const rootReducer = combineReducers({
  layouts,
  settings,
  auth,
  wishList,
  discussion,
  profile,
  pages,
  cart,
  imagePicker,
  orders,
  productReviews,
  products,
  search,
  steps,
  vendorCategories,
  vendors,
  vendorManageProducts,
  vendorManageCategories,
  vendorManageOrders,
  notifications
})

export type RootState = ReturnType<typeof rootReducer>
