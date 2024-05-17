import React, { Component, Fragment } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  StyleSheet,
  I18nManager
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import i18n from '../utils/i18n'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { USER_TYPE_CUSTOMER } from '../constants/index'
import theme from '../config/theme'
import * as yup from 'yup'
import { Formik, Field } from 'formik'
import { getFieldConfig } from '../services/formField'
import Spinner from '../components/Spinner'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

// Components
import CartFooter from './CartFooter'
import { SocialLoginLinksBlock } from './SocialLoginLinksBlock'
import { AndroidAlertInput } from './AndroidAlertInput'
import FormField from '../components/FormField'
import { AgreementUGC } from '../components/AgreementUGC'

// Actions
import * as authActions from '../redux/actions/authActions'

// Constants
import { FIELD_DATE, FIELD_COUNTRY, FIELD_STATE } from '../constants'

const styles = StyleSheet.create({
  contentContainer: {
    padding: 0,
    paddingBottom: 12,
    backgroundColor: theme.$screenBackgroundColor
  },
  form: {
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
  header: {
    fontSize: 19,
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'left'
  },
  deleteAccountButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    textAlign: 'center',
    marginTop: 10,
    width: '40%'
  },
  deleteAccountButtonText: {
    color: theme.$dangerColor,
    fontSize: 13
  },
  inputContainer: {
    marginTop: 15
  },
  submitBtn: {
    marginTop: 15,
    backgroundColor: '#4fbe31',
    borderRadius: 3
  },
  formSubtitle: {
    textAlign: 'left',
    color: theme.$darkColor
  },
  userAgreementContainer: {
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 15,
    paddingRight: 25,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  errorTextStyle: {
    color: theme.$dangerColor,
    fontSize: 16,
    marginLeft: 15
  }
})

MaterialCommunityIcon.loadFont()

export class ProfileForm extends Component {
  constructor(props) {
    super(props)
    this.formsRef = {}
    this.state = {
      forms: [],
      isAndroidAlertShown: false,
      androidAlertInputValue: '',
      initialValues: {},
      validationSchema: null,
      isLoading: true,
      agreementUser: false,
      agreementError: false
    }
  }

  componentDidMount() {
    const { fields } = this.props
    const forms = []

    function sortFunc(a, b) {
      const sortingArr = ['E', 'C', 'B', 'S']
      return sortingArr.indexOf(a[1]) - sortingArr.indexOf(b[1])
    }

    Object.keys(fields)
      .sort(sortFunc)
      .forEach(key => {
        forms.push({
          type: key,
          description: fields[key].description,
          ...this.convertFieldsToFormik(fields[key].fields)
        })
      })

    const initialValues = {}
    let validationSchema = null
    forms.map(form => {
      Object.keys(form.formValues).map(
        key => (initialValues[key] = form.formValues[key])
      )

      if (!validationSchema) {
        validationSchema = form.validationSchema
      } else {
        validationSchema = validationSchema.concat(form.validationSchema)
      }
    })

    this.setState({
      forms,
      initialValues,
      validationSchema,
      isLoading: false
    })
  }

  convertFieldsToFormik = fields => {
    const { dateFormat } = this.props
    const formValues = {}
    const formFields = {}
    const validationSchema = {}

    let countryCache = null
    let stateCache = null

    fields.forEach(item => {
      const itemData = getFieldConfig(item, fields, dateFormat)

      validationSchema[item.field_id] = itemData.validation

      formFields[item.field_id] = itemData.options
      formValues[item.field_id] = item.value
        ? item.value
        : itemData.options.defaultValue

      if (item.field_type === FIELD_DATE) {
        // Date field
        formValues[item.field_id] = item.value
          ? new Date(item.value * 1000)
          : undefined
      }

      if (item.field_type === FIELD_STATE) {
        stateCache = item
      }

      if (item.field_type === FIELD_COUNTRY) {
        if (!item.values[formValues[item.field_id]]) {
          formValues[item.field_id] = ''
        }
        formFields[item.field_id].handleChange = this.handleChange
        countryCache = item
      }
    })

    // TODO: Fixme brainfuck code.
    // Reset state.
    if (countryCache && stateCache) {
      if (!stateCache.values[countryCache.value]) {
        formValues[stateCache.field_id] = ''
      }
    }

    return {
      fields,
      validationSchema: yup.object(validationSchema),
      formFields,
      formValues
    }
  }

  handleValidate = values => {
    const { onSubmit, isEdit, isLogged } = this.props
    let formsValues = {}
    let isFormsValid = true

    if (!values) {
      isFormsValid = false
      return
    }
    formsValues = {
      ...formsValues,
      ...values
    }

    if (!isEdit && !isLogged && !this.state.agreementUser) {
      this.setState({ agreementError: true })
      isFormsValid = false
    }

    if (isFormsValid) {
      onSubmit(formsValues)
    }
  }

  handleChange = (newValue, changedField) => {
    const { forms } = this.state
    const newForms = JSON.parse(JSON.stringify([...forms]))
    let newValidationSchema = null
    let newFormValues = {}

    newForms.forEach((form, index) => {
      form.fields.forEach((field, fieldIndex) => {
        if (field.field_id === changedField) {
          newForms[index].fields[fieldIndex].value = newValue
          form.fields[fieldIndex].value = newValue
        }

        if (changedField === 's_country' && field.field_id === 's_state') {
          newForms[index].fields[fieldIndex].value = ''
          form.fields[fieldIndex].value = ''
        }

        if (changedField === 'b_country' && field.field_id === 'b_state') {
          newForms[index].fields[fieldIndex].value = ''
          form.fields[fieldIndex].value = ''
        }
      })

      const newValues = this.convertFieldsToFormik(form.fields)

      newForms[index].fields = newValues.fields
      newForms[index].formFields = newValues.formFields
      newForms[index].formValues = newValues.formValues
      newForms[index].validationSchema = newValues.validationSchema

      if (!newValidationSchema) {
        newValidationSchema = newValues.validationSchema
      } else {
        newValidationSchema = newValidationSchema.concat(
          newValues.validationSchema
        )
      }

      newFormValues = { ...newFormValues, ...newValues.formValues }
    })

    this.setState({
      forms: newForms,
      validationSchema: newValidationSchema,
      initialValues: newFormValues
    })
  }

  confirmDeleteAccount = async comment => {
    const { auth, authActions, navigation } = this.props

    await authActions.deleteAccount(auth.token, comment)
    await authActions.logout()
    navigation.pop()
  }

  showDeleteAccountAlert = () => {
    if (Platform.OS === 'ios') {
      Alert.prompt(
        i18n.t('Delete Account'),
        i18n.t('Are you sure you want to delete your account?') +
          ' ' +
          i18n.t('You can leave us a comment here.'),
        [
          {
            text: i18n.t('Cancel'),
            style: 'cancel'
          },
          {
            text: i18n.t('Delete'),
            onPress: comment => this.confirmDeleteAccount(comment),
            style: 'destructive'
          }
        ],
        'plain-text'
      )
    } else {
      this.setState({ isAndroidAlertShown: true })
    }
  }

  render() {
    const { forms, initialValues, isLoading, validationSchema } = this.state
    const { isEdit, showTitles, componentId, isLogged, profile, navigation } =
      this.props
    const submitText = isEdit ? i18n.t('Save') : i18n.t('Register')

    if (isLoading) {
      return <Spinner visible />
    }

    // TODO Picker in Form component.
    return (
      <Fragment>
        <Formik
          enableReinitialize={true}
          initialValues={{ ...initialValues }}
          validationSchema={validationSchema}
          onSubmit={values => {
            this.handleValidate(values)
          }}>
          {({ handleSubmit, isValid, values }) => {
            return (
              <>
                <KeyboardAwareScrollView
                  enableResetScrollToCoords={false}
                  contentContainerStyle={styles.contentContainer}
                >
                  {forms.map((form, i) => {
                    return (
                      <View style={styles.form} key={i}>
                        <Text style={styles.formSubtitle}>
                          {form.description}
                        </Text>
                        {Object.keys(form.formFields).map((key, index) => {
                          // We use index bacause Formik doesn't understand uuidv4
                          return (
                            <View key={index} style={styles.inputContainer}>
                              <Field
                                component={FormField}
                                name={form.formFields[key].name}
                                label={form.formFields[key].label}
                                fieldType={form.formFields[key].fieldType}
                                {...form.formFields[key]}
                                navigation={navigation}
                              />
                            </View>
                          )
                        })}
                      </View>
                    )
                  })}
                  {isEdit && profile.user_type === USER_TYPE_CUSTOMER && (
                    <TouchableOpacity
                      onPress={this.showDeleteAccountAlert}
                      style={styles.deleteAccountButton}>
                      <Text style={styles.deleteAccountButtonText}>
                        {i18n.t('Delete account')}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {!isEdit && !isLogged && (
                    <AgreementUGC
                      navigation={navigation}
                      onPress={() => {
                        this.setState({
                          agreementUser: !this.state.agreementUser,
                          agreementError: false
                        })
                      }}
                      agreementError={this.state.agreementError}
                      agreementUser={this.state.agreementUser}
                    />
                  )}
                  {!isLogged && (
                    <SocialLoginLinksBlock
                      isRegistration
                      navigation={navigation}
                    />
                  )}
                </KeyboardAwareScrollView>
                {this.props.cartFooterEnabled ? (
                  <CartFooter
                    totalPrice={this.props.totalPrice}
                    btnText={this.props.btnText}
                    onBtnPress={handleSubmit}
                  />
                ) : (
                  <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                    <Text style={styles.btnText}>{submitText}</Text>
                  </TouchableOpacity>
                )}
              </>
            )
          }}
        </Formik>
        {
          <AndroidAlertInput
            isVisible={this.state.isAndroidAlertShown}
            title={'Delete Account'}
            description={'Are you sure you want to delete your account?'}
            inputPlacholder={'You can leave us a comment here.'}
            inputValue={this.state.androidAlertInputValue}
            inputOnChangeText={value => {
              this.setState({ androidAlertInputValue: value })
            }}
            cancelButtonLabel={'Cancel'}
            cancelButtonHandler={() =>
              this.setState({ isAndroidAlertShown: false })
            }
            deleteButtonLabel={'Delete'}
            deleteButtonHandler={() =>
              this.confirmDeleteAccount(this.state.androidAlertInputValue)
            }
          />
        }
      </Fragment>
    )
  }
}

export default connect(
  state => ({
    auth: state.auth,
    profile: state.profile
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
  })
)(ProfileForm)
