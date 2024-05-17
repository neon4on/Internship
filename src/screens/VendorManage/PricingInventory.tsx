import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView, StyleSheet } from 'react-native'
import theme from '../../config/theme'
import * as yup from 'yup'
import { Formik, Field } from 'formik'

//Utils
import i18n from '../../utils/i18n'

// Constants
import { FIELD_INPUT } from '../../constants'

// Components
import Section from '../../components/Section'
import FormField from '../../components/FormField'

// Actions
import * as productsActions from '../../redux/actions/vendorManage/productsActions'
import BottomActions from '../../components/BottomActions'

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
    backgroundColor: '#4fbe31',
    borderRadius: 3
  }
})

export class PricingInventory extends Component {
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

    const isProductOffer = !!product.master_product_id

    const formFields = {
      product_code: {
        name: 'product_code',
        label: i18n.t('Code'),
        editable: !isProductOffer,
        fieldType: FIELD_INPUT
      },
      list_price: {
        name: 'list_price',
        label: i18n.t('List price ($)'),
        editable: !isProductOffer,
        fieldType: FIELD_INPUT
      },
      amount: {
        name: 'amount',
        label: i18n.t('In stock'),
        fieldType: FIELD_INPUT
      }
    }

    const validationSchema = yup.object({
      product_code: yup.string(),
      list_price: yup
        .number()
        .typeError(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('List price ($)'),
            interpolation: { escapeValue: false }
          })
        )
      ,
      amount: yup
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
    })

    return (
      <View style={styles.container}>
        <Formik
          validationSchema={validationSchema}
          // We change number value toString because number is not displayed
          initialValues={{
            product_code: product.product_code,
            list_price: product.list_price.toString(),
            amount: product.amount.toString()
          }}
          onSubmit={values => this.handleSave(values)}>
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
)(PricingInventory)
