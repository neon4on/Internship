/**
 * CS-Cart React Native App
 *
 * @format
 */

import React from 'react'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import store from './src/redux/store'
import MainNavigation from './src/navigation/navigation'
import ShopClosed from './src/navigation/navigationClosed'
import ConnectionFailed from './src/navigation/navigationConnectionFailed'
import * as appActions from './src/redux/actions/appActions'
import Spinner from './src/components/Spinner'
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider
} from 'react-native-paper'
import SplashScreen from 'react-native-splash-screen'
import theme from './src/config/theme'
import NetInfo from '@react-native-community/netinfo'
import { CustomToast } from './src/components/CustomToast'
import Toast from 'react-native-toast-notifications'

function App(): JSX.Element {
  const [loading, setLoading] = useState(true)
  const [isConnected, setConnected] = useState(true)
  const isShopClosed = store.getState().settings.isShopClosed

  const editTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      surface: theme.$screenBackgroundColor,
      background: theme.$screenBackgroundColor
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      await NetInfo.fetch().then(async connection => {
        setConnected(connection.isConnected)

        if (connection.isConnected) {
          await appActions.initApp()
        } else {
          await appActions.initAppNotConnected()
        }
        setLoading(false)
        SplashScreen.hide()
      })
    }
    fetchData().catch(console.log)
  }, [])

  if (loading) {
    return <Spinner visible />
  }

  if (!isConnected) {
    return <ConnectionFailed />
  }

  return (
    <>
      <Provider store={store}>
        <PaperProvider theme={editTheme}>
          {isShopClosed ? <ShopClosed /> : <MainNavigation />}
        </PaperProvider>
      </Provider>

      <Toast
        offset={50}
        renderType={{
          custom_toast: toast => CustomToast(toast)
        }}
        ref={ref => (global['toast'] = ref)}
      />
    </>
  )
}

export default App
