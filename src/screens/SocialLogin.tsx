import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { WebViewer } from '../components/WebViewer'
import { get } from 'lodash'
import { parseQueryString } from '../utils/index'
import { bindActionCreators } from 'redux'

// Actions
import * as authActions from '../redux/actions/authActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$screenBackgroundColor'
  }
})

interface ISocialLogin {
  uri: string
  title: string
  authActions: {
    [key: string]: Function
  }
  isRegistration: boolean
}

const SocialLogin: React.FC<ISocialLogin> = ({
  authActions,
  navigation,
  route
}) => {
  const { title, uri, isRegistration } = route.params
  useEffect(() => {
    navigation.setOptions({ title: title })
  })

  const loginHandler = async ({ url }: { url: string }) => {
    const urlParams: { [key: string]: string } | {} = parseQueryString(url)
    const authToken: string = get(urlParams, 'auth_token', '')

    await authActions.authLoading()

    if (authToken) {
      try {
        navigation.popToTop()
        await authActions.getUserData({
          data: {
            token: authToken,
            ttl: null
          }
        })
        if (isRegistration) {
          await authActions.showRegistrationNotification(true)
        }
      } catch (error) {
        if (isRegistration) {
          await authActions.showRegistrationNotification(false)
        }
      }
    }

    authActions.authLoaded()
  }

  return (
    <View style={styles.container}>
      <WebViewer
        uri={uri}
        incognito={true}
        onNavigationStateChange={navState => loginHandler(navState)}
      />
    </View>
  )
}

export default connect(
  state => ({
    settings: state.settings
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
  })
)(SocialLogin)
