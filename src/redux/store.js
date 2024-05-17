import { configureStore } from '@reduxjs/toolkit'
import AsyncStorage from '@react-native-async-storage/async-storage'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import { STORE_KEY } from '../constants'

import { rootReducer } from '.'

const middlewares = [thunk]

// Apply logger if we are in debug mode.
if (__DEV__) {
  middlewares.push(logger)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    // Set serializableCheck: false
    // More info here: https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using
    // immutableCheck: { warnAfter: 150 }
    // Removes warning immutable state invariant middleware: https://stackoverflow.com/questions/65217815/redux-handling-really-large-state-object
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: { warnAfter: 150 }
    }).concat(middlewares)
})

store.subscribe(() => {
  AsyncStorage.setItem(
    STORE_KEY,
    JSON.stringify({
      auth: store.getState().auth,
      cart: store.getState().cart,
      profile: store.getState().profile,
      settings: {
        ...store.getState().settings,
        languageCurrencyFeatureFlag: true,
        isShopClosed: false,
        productReviewsAddon: {
          isEnabled: false,
          isCommentOnly: false
        }
      }
    })
  )
})

export default store
