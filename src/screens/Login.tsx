import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import { Formik, Field } from 'formik'
import i18n from '../utils/i18n'
import config from '../config'
import * as yup from 'yup'
import { Button } from 'react-native-paper'
import theme from '../config/theme'

// Actions
import * as authActions from '../redux/actions/authActions'

// Constants
import { FIELD_INPUT, FIELD_PASSWORD } from '../constants'

// Components
import Spinner from '../components/Spinner'
import { SocialLoginLinksBlock } from '../components/SocialLoginLinksBlock'
import FormField from '../components/FormField'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor,
    padding: 12
  },
  btn: {
    backgroundColor: '#4fbe31',
    padding: 12,
    borderRadius: 3
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  },
  btnRegistration: {
    marginTop: 20
  },
  btnRegistrationText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center'
  },
  forgotPasswordText: {
    color: '#0000FF',
    textAlign: 'center',
    marginTop: 18
  },
  inputContainer: {
    marginTop: 15
  },
  submitBtn: {
    marginTop: 15,
    backgroundColor: '#4fbe31',
    borderRadius: 3
  }
})

export const Login = ({ navigation }) => {
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)

  const handleLogin = async value => {
    if (value) {
      const res = await dispatch(authActions.login(value))
      await dispatch(authActions.getUserData(res))
      await dispatch(authActions.authLoaded())
      navigation.pop()
    }
  }

  const formFields = {
    email: {
      name: 'email',
      label: i18n.t('Email'),
      keyboardType: 'email-address',
      clearButtonMode: 'while-editing',
      fieldType: FIELD_INPUT
    },
    password: {
      name: 'password',
      label: i18n.t('Password'),
      secureTextEntry: true,
      autoCapitalize: 'none',
      clearButtonMode: 'while-editing',
      fieldType: FIELD_PASSWORD
    }
  }

  const validationSchema = yup.object({
    email: yup
      .string()
      .email(
        i18n.t('Enter a valid {{field}}', {
          field: i18n.t('Email'),
          interpolation: { escapeValue: false }
        })
      )
      .required(
        i18n.t('The {{field}} field is required', {
          field: i18n.t('Email'),
          interpolation: { escapeValue: false }
        })
      ),
    password: yup.string().required(
      i18n.t('The {{field}} field is required', {
        field: i18n.t('Password'),
        interpolation: { escapeValue: false }
      })
    )
  })

  const initialValues = {}
  Object.keys(formFields).map(
    key => (initialValues[key] = formFields[key]?.value)
  )

  const submitBtnData = {
    text: i18n.t('Login'),
    disabled: auth.fetching
  }

  if (auth.fetching) {
    return <Spinner visible />
  }

  return (
    <View style={styles.container}>
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: config.demoUsername,
          password: config.demoPassword
        }}
        onSubmit={values => handleLogin(values)}>
        {({ handleSubmit, isValid }) => (
          <>
            {Object.keys(formFields).map((key, index) => (
              // We use index bacause Formik doesn't understand uuidv4
              <View key={index} style={styles.inputContainer}>
                <Field
                  {...formFields[key]}
                  component={FormField}
                  name={formFields[key].name}
                  label={formFields[key].label}
                  fieldType={formFields[key].fieldType}
                />
              </View>
            ))}

            <Button
              disabled={!isValid && submitBtnData?.disabled}
              onPress={handleSubmit}
              mode="contained"
              style={styles.submitBtn}>
              {i18n.t('Login')}
            </Button>
          </>
        )}
      </Formik>
      <TouchableOpacity
        style={styles.btnRegistration}
        onPress={() => navigation.push('Registration')}>
        <Text style={styles.btnRegistrationText}>{i18n.t('Registration')}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.push('ResetPassword')}>
        <Text style={styles.forgotPasswordText}>
          {i18n.t('Forgot your password?')}
        </Text>
      </TouchableOpacity>
      <SocialLoginLinksBlock isRegistration={false} navigation={navigation} />
      <Spinner visible={auth.fetching} mode="modal" />
    </View>
  )
}
