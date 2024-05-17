import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  I18nManager
} from 'react-native'
import { Formik, Field } from 'formik'
import { Button } from 'react-native-paper'
import * as yup from 'yup'
import cloneDeep from 'lodash/cloneDeep'
import theme from '../config/theme'
import i18n from '../utils/i18n'
import { registerDrawerDeepLinks } from '../services/deepLinks'

// Constants
import { FIELD_INPUT } from '../constants'

// Import actions.
import * as userActions from '../redux/actions/userActions'

// Components
import Spinner from '../components/Spinner'
import FormField from '../components/FormField'
import BottomActions from '../components/BottomActions'

import store from '../redux/store'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.$screenBackgroundColor,
    paddingTop: 10
  },
  scrollContainer: {
    paddingHorizontal: I18nManager.isRTL
      ? theme.$containerPadding / 2
      : theme.$containerPadding,
    marginLeft: I18nManager.isRTL ? theme.$containerPadding : 0,
    height: '100%'
  },
  wrapperStyle: {
    flex: 1
  },
  userAgreementTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  userAgreementText: {
    fontSize: 18,
    marginRight: 5,
    color: theme.$categoryBlockTextColor
  },
  userAgreementLink: {
    fontSize: 18,
    color: 'blue'
  },
  inputContainer: {
    marginTop: 15
  },
  submitBtnText: {
    textAlign: 'center',
    color: theme.$buttonWithBackgroundTextColor,
    fontSize: 16
  },
  submitBtn: {
    marginTop: 15,
    backgroundColor: theme.$buttonBackgroundColor,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

/**
 * Renders write report screen.
 */
export class WriteReport extends Component {
  /**
   * @ignore
   */
  constructor(props) {
    super(props)

    this.state = {
      fetching: false
    }
  }

  /**
   * Sends new post.
   */
  handleSend = async value => {
    const { auth } = store.getState()
    const { userActions, route, navigation } = this.props

    if (!auth.logged) {
      return navigation.navigate('Login')
    }

    const { report_type, report_object_id } = route.params

    if (value) {
      this.setState({ fetching: true })

      await userActions.sendReport({
        report_object_id: report_object_id,
        report_type: report_type,
        message: value.message
      })
      this.setState({ fetching: false })
      navigation.pop()
    }
  }

  render() {
    const { settings } = store.getState()
    const { navigation } = this.props

    const formFields = {
      message: {
        name: 'message',
        label: i18n.t('Describe the violation here:'),
        numberOfLines: 4,
        multiline: true,
        clearButtonMode: 'while-editing',
        fieldType: FIELD_INPUT
      }
    }

    const validationSchema = yup.object({
      message: yup.string().required(
        i18n.t('The {{field}} field is required', {
          field: i18n.t('Your message'),
          interpolation: { escapeValue: false }
        })
      )
    })

    const initialValues = { message: '' }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.userAgreementTextContainer}>
            <Text style={styles.userAgreementText}>
              {i18n.t('Report a violation of')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                registerDrawerDeepLinks(
                  {
                    link: settings?.termsOfServiceUrl,
                    payload: {
                      title: i18n.t('terms of service').toUpperCase()
                    }
                  },
                  navigation
                )
              }}>
              <Text style={styles.userAgreementLink}>
                {i18n.t('terms of service')}
              </Text>
            </TouchableOpacity>
          </View>
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={values => this.handleSend(values)}>
            {({ handleSubmit }) => (
              <>
                {Object.keys(formFields).map((key, index) => (
                  // We use index bacause Formik doesn't understand uuidv4
                  <View key={index} style={styles.inputContainer}>
                    <Field
                      component={FormField}
                      name={formFields[key].name}
                      label={formFields[key].label}
                      fieldType={formFields[key].fieldType}
                      {...formFields[key]}
                    />
                  </View>
                ))}

                <Button
                  style={[styles.submitBtn, styles.submitBtnText]}
                  onPress={handleSubmit}
                  mode="contained">
                  {i18n.t('Send report').toUpperCase()}
                </Button>
              </>
            )}
          </Formik>
          <Spinner visible={this.state.fetching} mode="modal" />
        </ScrollView>
      </View>
    )
  }
}

export default connect(
  state => ({ report: state.report }),
  dispatch => ({
    userActions: bindActionCreators(userActions, dispatch)
  })
)(WriteReport)
