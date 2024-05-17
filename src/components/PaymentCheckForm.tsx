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

export default class PaymentCheckForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formFields: {
        customerSignature: {
          name: 'customerSignature',
          label: i18n.t("Customer's signature"),
          clearButtonMode: 'while-editing',
          returnKeyType: 'done',
          fieldType: FIELD_INPUT
        },
        checkingAccountNumber: {
          name: 'checkingAccountNumber',
          label: i18n.t('Checking account number'),
          clearButtonMode: 'while-editing',
          returnKeyType: 'done',
          fieldType: FIELD_INPUT
        },
        bankRoutingNumber: {
          name: 'bankRoutingNumber',
          label: i18n.t('Bank routing number'),
          clearButtonMode: 'while-editing',
          returnKeyType: 'done',
          fieldType: FIELD_INPUT
        },
        notes: {
          name: 'notes',
          label: i18n.t('Comment'),
          help: `${i18n.t('(Optional)')}`,
          clearButtonMode: 'while-editing',
          multiline: true,
          returnKeyType: 'done',
          blurOnSubmit: true,
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
