import React from 'react'
import { socialLoginIconPaths } from '../utils/socialLoginIcons'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet
} from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import i18n from '../utils/i18n'
import theme from '../config/theme'
import {
  appleAuth,
  AppleButton
} from '@invertase/react-native-apple-authentication'

// Actions
import * as authActions from '../redux/actions/authActions'
import { NavigationAction } from '@react-navigation/native'

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center'
  },
  socialLoginTitle: {
    marginBottom: 10,
    color: theme.$darkColor
  },
  socialLoginIconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  socialLoginIconWrapper: {
    marginHorizontal: 20
  },
  socialLoginIcon: {
    width: 30,
    height: 30
  },
  appleButton: {
    width: 160,
    height: 45,
    marginTop: 15
  }
})

export const SocialLoginLinksBlock = ({
  isRegistration,
  navigation
}: {
  isRegistration: boolean
  navigation: object
}) => {
  const dispatch = useDispatch()
  const settings = useSelector(state => state.settings)

  const onAppleButtonPress = async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME]
      })
      const { identityToken } = appleAuthRequestResponse

      if (identityToken) {
        const result = await dispatch(authActions.appleSignUp(identityToken))
        await dispatch(authActions.getUserData(result))
        await dispatch(authActions.authLoaded())
        navigation.popToTop()
      }
    } catch (error) {
      console.log('Apple auth error: ', error)
    }
  }

  if (
    !Object.keys(settings.socialLoginLinks).length &&
    Platform.OS === 'android'
  ) {
    return null
  }

  return (
    <View style={styles.container}>
      <Text style={styles.socialLoginTitle}>
        {i18n.t('Or sign-in with another identity provider:')}
      </Text>
      <View style={styles.socialLoginIconsWrapper}>
        {Object.keys(settings.socialLoginLinks).map(
          (socialLoginName, index) => {
            return (
              <TouchableOpacity
                style={styles.socialLoginIconWrapper}
                key={index}
                onPress={() =>
                  navigation.push('SocialLogin', {
                    title: socialLoginName,
                    isRegistration,
                    uri: settings.socialLoginLinks[socialLoginName]
                  })
                }>
                <Image
                  style={styles.socialLoginIcon}
                  source={socialLoginIconPaths[socialLoginName]}
                />
              </TouchableOpacity>
            )
          }
        )}
      </View>
      {Platform.OS === 'ios' && (
        <AppleButton
          buttonStyle={AppleButton.Style.BLACK}
          buttonType={AppleButton.Type.SIGN_IN}
          style={styles.appleButton}
          onPress={() => onAppleButtonPress()}
        />
      )}
    </View>
  )
}
