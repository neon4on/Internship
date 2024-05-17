import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView, StyleSheet, Text } from 'react-native'
import i18n from '../../utils/i18n'
import * as yup from 'yup'
import { Formik, Field } from 'formik'
import theme from '../../config/theme'

// Components
import StepByStepSwitcher from '../../components/StepByStepSwitcher'
import BottomActions from '../../components/BottomActions'
import Spinner from '../../components/Spinner'
import FormField from '../../components/FormField'

// Constants
import { FIELD_INPUT } from '../../constants'

// Actions
import * as productsActions from '../../redux/actions/vendorManage/productsActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  },
  header: {
    marginLeft: 14,
    marginTop: 14
  },
  scrollContainer: {
    paddingBottom: 14
  },
  formWrapper: {
    padding: 20
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

export class AddProductStep3 extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false
    }
    this.formRef = React.createRef()
  }

  handleCreate = async values => {
    const { productsActions, navigation, route } = this.props
    const { stepsData } = route.params

    if (values) {
      this.setState({ loading: true })

      try {
        const newProductID = await productsActions.createProduct({
          product: `${stepsData.name}`,
          price: values.price,
          list_price: values.list_price,
          category_ids: stepsData.category_ids,
          full_description: `${stepsData.description}`,
          amount: values.in_stock,
          images: stepsData.images
        })

        if (newProductID) {
          this.setState({ loading: false })
          navigation.reset({
            index: 2,
            routes: [
              { name: 'ProfileScreen' },
              { name: 'VendorManageProducts' },
              {
                name: 'VendorManageEditProduct',
                params: {
                  productID: newProductID,
                  showClose: true
                }
              }
            ]
          })
        }
      } catch (error) {
        this.setState({ loading: false })
      }
    }
  }

  renderHeader = () => {
    const { route } = this.props
    const { currentStep } = route.params

    return (
      <View style={styles.header}>
        <StepByStepSwitcher currentStep={currentStep} />
      </View>
    )
  }

  render() {
    const { loading } = this.state
    
    const formFields = {
      price: {
        name: 'price',
        label: i18n.t('Price'),
        fieldType: FIELD_INPUT
      },
      in_stock: {
        name: 'in_stock',
        label: i18n.t('In stock'),
        fieldType: FIELD_INPUT
      },
      list_price: {
        name: 'list_price',
        label: i18n.t('List price'),
        fieldType: FIELD_INPUT
      }
    }

    const validationSchema = yup.object({
      price: yup
        .number()
        .typeError(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('Price'),
            interpolation: { escapeValue: false }
          })
        )
        .required(
          i18n.t('The {{field}} field is required', {
            field: i18n.t('Price'),
            interpolation: { escapeValue: false }
          })
        )
        .integer(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('Price'),
            interpolation: { escapeValue: false }
          })
        )
        .positive(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('Price'),
            interpolation: { escapeValue: false }
          })
        ),
      in_stock: yup
        .number()
        .typeError(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('In stock'),
            interpolation: { escapeValue: false }
          })
        )
        .required(
          i18n.t('The {{field}} field is required', {
            field: i18n.t('In stock'),
            interpolation: { escapeValue: false }
          })
        )
        .integer(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('In stock'),
            interpolation: { escapeValue: false }
          })
        )
        .positive(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('In stock'),
            interpolation: { escapeValue: false }
          })
        ),
      list_price: yup
        .number()
        .typeError(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('List price'),
            interpolation: { escapeValue: false }
          })
        )
        .required(
          i18n.t('The {{field}} field is required', {
            field: i18n.t('List price'),
            interpolation: { escapeValue: false }
          })
        )
        .integer(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('List price'),
            interpolation: { escapeValue: false }
          })
        )
        .positive(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('List price'),
            interpolation: { escapeValue: false }
          })
        )
    })

    return (
      <View style={styles.container}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{ price: '', in_stock: '', list_price: '' }}
          onSubmit={values => this.handleCreate(values)}>
          {({ handleSubmit }) => (
            <>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {this.renderHeader()}
                <View style={styles.formWrapper}>
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
                </View>
              </ScrollView>
              <BottomActions
                onBtnPress={handleSubmit}
                btnText={i18n.t('Create')}
                disabled={loading}
              />
            </>
          )}
        </Formik>
        <Spinner visible={loading} mode="modal" />
      </View>
    )
  }
}

export default connect(undefined, dispatch => ({
  productsActions: bindActionCreators(productsActions, dispatch)
}))(AddProductStep3)
