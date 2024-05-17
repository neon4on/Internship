import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView, StyleSheet, Text } from 'react-native'
import theme from '../../config/theme'
import * as yup from 'yup'
import { Formik, Field } from 'formik'

//Utils
import i18n from '../../utils/i18n'

// Constants
import { FIELD_CHECKBOX, FIELD_INPUT } from '../../constants'

// Components
import Section from '../../components/Section'
import BottomActions from '../../components/BottomActions'
import FormField from '../../components/FormField'

// Actions
import * as productsActions from '../../redux/actions/vendorManage/productsActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.$containerPadding,
    backgroundColor: theme.$screenBackgroundColor
  },
  scrollContainer: {
    paddingBottom: 14
  },
  inputContainer: {
    marginTop: 15
  },
  submitBtn: {
    marginTop: 15,
    backgroundColor: '#4fbe31'
  }
})

export class ShippingProperties extends Component {
  constructor(props) {
    super(props)

    this.formRef = React.createRef()
  }

  handleSave = values => {
    const { product, productsActions } = this.props

    if (!values) {
      return
    }

    productsActions.updateProduct(product.product_id, { ...values })
  }

  render() {
    const { product } = this.props

    const formFields = {
      weight: {
        name: 'weight',
        label: i18n.t('Weight (lbs)'),
        fieldType: FIELD_INPUT
      },
      free_shipping: {
        name: 'free_shipping',
        label: i18n.t('Free shipping'),
        fieldType: FIELD_CHECKBOX
      }
    }

    const validationSchema = yup.object({
      weight: yup
        .number()
        .typeError(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('Weight (lbs)'),
            interpolation: { escapeValue: false }
          })
        )
        .required(
          i18n.t('The {{field}} field is required', {
            field: i18n.t('Weight (lbs)'),
            interpolation: { escapeValue: false }
          })
        ),
      free_shipping: yup.boolean()
    })

    return (
      <View style={styles.container}>
        <Formik
          validationSchema={validationSchema}
          // We change number value toString because number is not displayed
          initialValues={{
            weight: product.weight.toString(),
            free_shipping: product.free_shipping
          }}
          onSubmit={values => {
            this.handleSave(values)
          }}>
          {({ handleSubmit }) => (
            <>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Section>
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
                </Section>
              </ScrollView>
              <BottomActions
                onBtnPress={handleSubmit}
                btnText={i18n.t('Save')}
              />
            </>
          )}
        </Formik>
      </View>
    )
  }
}

export default connect(
  state => ({
    product: state.vendorManageProducts.current
  }),
  dispatch => ({
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(ShippingProperties)
