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

export default class PaymentCreditCardForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      formFields: {
        cardNumber: {
          name: 'cardNumber',
          label: i18n.t('Card Number'),
          clearButtonMode: 'while-editing',
          keyboardType: 'numeric',
          returnKeyType: 'done',
          fieldType: FIELD_INPUT
        },
        expiryMonth: {
          name: 'expiryMonth',
          label: i18n.t('Valid thru (mm)'),
          clearButtonMode: 'while-editing',
          keyboardType: 'numeric',
          returnKeyType: 'done'
        },
        expiryYear: {
          name: 'expiryYear',
          label: i18n.t('Valid thru (yy)'),
          clearButtonMode: 'while-editing',
          keyboardType: 'numeric',
          returnKeyType: 'done',
          fieldType: FIELD_INPUT
        },
        cardholderName: {
          name: 'cardholderName',
          label: i18n.t("Cardholder's name"),
          clearButtonMode: 'while-editing',
          returnKeyType: 'done',
          fieldType: FIELD_INPUT
        },
        ccv: {
          name: 'ccv',
          label: i18n.t('CVV/CVC'),
          clearButtonMode: 'while-editing',
          keyboardType: 'numeric',
          returnKeyType: 'done',
          fieldType: FIELD_INPUT
        },
        notes: {
          name: 'notes',
          label: i18n.t('Comment'),
          help: `${i18n.t('(Optional)')}`,
          clearButtonMode: 'while-editing',
          multiline: true,
          blurOnSubmit: true,
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
