import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView, StyleSheet, Text } from 'react-native'
import * as yup from 'yup'
import { Formik, Field } from 'formik'
import { Button } from 'react-native-paper'
import theme from '../config/theme'

// Utils
import i18n from '../utils/i18n'

// Actions
import * as authActions from '../redux/actions/authActions'

// Constants
import { FIELD_INPUT } from '../constants'

// Components
import Spinner from '../components/Spinner'
import StepByStepSwitcher from '../components/StepByStepSwitcher'
import FormField from '../components/FormField'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  },
  contentContainer: {
    padding: 14
  },
  submitBtn: {
    marginTop: 15,
    backgroundColor: '#4fbe31',
    borderRadius: 3
  },
  inputContainer: {
    marginTop: 15
  }
})

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
    clearButtonMode: 'while-editing',
    fieldType: FIELD_INPUT
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

export class CheckoutAuth extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { navigation } = this.props
    if (nextProps.auth.logged && !nextProps.auth.fetching) {
      setTimeout(() => {
        navigation.navigate('CheckoutProfile')
      }, 1000)
    } else if (nextProps.auth.error && !nextProps.auth.fetching) {
      this.props.navigator.showInAppNotification({
        screen: 'Notification',
        passProps: {
          type: 'warning',
          title: i18n.t('Error'),
          text: i18n.t('Wrong password.')
        }
      })
    }
  }

  async handleLogin(value) {
    const { authActions } = this.props

    if (value) {
      const res = await authActions.login(value)
      await authActions.getUserData(res)
      await authActions.authLoaded()
    }
  }

  handleLogout() {
    this.props.authActions.logout()
  }

  renderLoginForm() {
    return (
      <Formik
        validationSchema={validationSchema}
        initialValues={{
          email: '',
          password: ''
        }}
        onSubmit={values => this.handleLogin(values)}>
        {({ handleSubmit }) => (
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
              type="primary"
              onPress={handleSubmit}
              mode="contained"
              style={styles.submitBtn}>
              {i18n.t('Sign in')}
            </Button>
          </>
        )}
      </Formik>
    )
  }

  renderReLogin() {
    return (
      <Button type="primary" onPress={() => this.handleLogout()}>
        {i18n.t('Sign in as a different user')}
      </Button>
    )
  }

  render() {
    const { auth } = this.props

    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <StepByStepSwitcher />
          {auth.logged ? this.renderReLogin() : this.renderLoginForm()}
        </ScrollView>
        <Spinner visible={auth.fetching} mode="modal" />
      </View>
    )
  }
}

export default connect(
  state => ({
    auth: state.auth
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
  })
)(CheckoutAuth)
