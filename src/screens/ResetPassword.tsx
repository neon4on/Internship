import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  I18nManager
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import i18n from '../utils/i18n'
import theme from '../config/theme'

// Actions
import * as authActions from '../redux/actions/authActions'

const styles = StyleSheet.create({
  container: {
    padding: theme.$containerPadding,
    alignItems: 'center'
  },
  input: {
    padding: 5,
    borderWidth: 1,
    borderColor: theme.$mediumGrayColor,
    borderRadius: theme.$borderRadius,
    width: '100%',
    height: 40,
    fontSize: 16,
    color: theme.$darkColor,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'
  },
  button: {
    marginTop: 20,
    borderRadius: theme.$borderRadius,
    width: 150,
    paddingVertical: 7,
    backgroundColor: '#4fbe31'
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16
  },
  email: {
    fontWeight: 'bold'
  },
  helpText: {
    marginTop: 10,
    color: '#0000FF'
  },
  tryAgainWrapper: {
    width: '100%'
  },
  hint: {
    textAlign: 'left',
    marginBottom: 10,
    color: theme.$darkColor
  },
  validateWarning: {
    borderColor: theme.$dangerColor
  }
})

const ResetPassword = ({ authActions, navigation }) => {
  const [email, setEmail] = useState('')
  const [oneTimePassword, setOneTimePassword] = useState('')
  const [screen, setScreen] = useState('reset')
  const [codeDidntCome, setCodeDidntCome] = useState(false)
  const [isValidate, setIsValidate] = useState(true)

  const resetPasswordHandler = async () => {
    const regex = /\S+@\S+\.\S+/i

    if (!email.match(regex)) {
      setIsValidate(false)
      return
    }

    const status = await authActions.resetPassword({ email: email.trim() })
    if (status) {
      setScreen('login')
    }
  }

  const loginWithOneTimePasswordHandler = async () => {
    if (!oneTimePassword.length) {
      setIsValidate(false)
      return
    }

    const res = await authActions.loginWithOneTimePassword({
      email,
      oneTimePassword
    })

    if (res) {
      await authActions.getUserData(res)
      await authActions.authLoaded()
      navigation.popToTop()
    }
  }

  const codeDidntComeHandler = () => {
    setScreen('reset')
    setCodeDidntCome(true)
  }

  return (
    <View style={styles.container}>
      {screen === 'reset' ? (
        <>
          {codeDidntCome ? (
            <View style={styles.tryAgainWrapper}>
              <Text style={styles.hint}>{i18n.t('Try again:')}</Text>
            </View>
          ) : (
            <View style={styles.tryAgainWrapper}>
              <Text style={styles.hint}>
                {i18n.t(
                  'Enter your e-mail, we will send you a code to log into your account.'
                )}
              </Text>
            </View>
          )}
          <TextInput
            value={email}
            placeholder={i18n.t('Email')}
            placeholderTextColor={theme.$mediumGrayColor}
            style={[styles.input, !isValidate && styles.validateWarning]}
            onChangeText={value => {
              setEmail(value)
              setIsValidate(true)
            }}
          />
          <TouchableOpacity
            onPress={resetPasswordHandler}
            style={styles.button}>
            <Text style={styles.buttonText}>{i18n.t('Get the code')}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            value={oneTimePassword}
            placeholder={i18n.t('Recovery code')}
            placeholderTextColor={theme.$mediumGrayColor}
            autoCapitalize="none"
            style={[styles.input, !isValidate && styles.validateWarning]}
            onChangeText={value => {
              setOneTimePassword(value)
              setIsValidate(true)
            }}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={loginWithOneTimePasswordHandler}>
            <Text style={styles.buttonText}>{i18n.t('Sign in')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={codeDidntComeHandler}>
            <Text style={styles.helpText}>
              {i18n.t("Didn't receive the code?")}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

export default connect(
  state => ({
    auth: state.auth
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
  })
)(ResetPassword)
