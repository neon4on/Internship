import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import { FIELD_INPUT } from '../constants'
import i18n from '../utils/i18n'
import FormField from './FormField'
import { Field } from 'formik'

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 15
  }
})

export default class PaymentPurchaseOrderForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formFields: {
        po_number: {
          name: 'po_number',
          label: i18n.t('PO Number'),
          clearButtonMode: 'while-editing',
          returnKeyType: 'done',
          fieldType: FIELD_INPUT
        },
        company_name: {
          name: 'company_name',
          label: i18n.t('Company name'),
          clearButtonMode: 'while-editing',
          returnKeyType: 'done',
          fieldType: FIELD_INPUT
        },
        buyer_name: {
          name: 'buyer_name',
          label: i18n.t("Buyer's name"),
          clearButtonMode: 'while-editing',
          returnKeyType: 'done',
          fieldType: FIELD_INPUT
        },
        position: {
          name: 'position',
          label: i18n.t('Position'),
          clearButtonMode: 'while-editing',
          returnKeyType: 'done',
          fieldType: FIELD_INPUT
        }
      }
    }
  }

  render() {
    return (
      <>
        {Object.keys(this.state.formFields).map((key, index) => (
          // We use index bacause Formik doesn't understand uuidv4
          <View key={index} style={styles.inputContainer}>
            <Field
              component={FormField}
              name={this.state.formFields[key].name}
              label={this.state.formFields[key].label}
              fieldType={this.state.formFields[key].fieldType}
              {...this.state.formFields[key]}
            />
          </View>
        ))}
      </>
    )
  }
}
