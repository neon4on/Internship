import { format } from 'date-fns'
import i18n from '../utils/i18n'
import * as yup from 'yup'
import {
  FIELD_PASSWORD,
  FIELD_DATE,
  FIELD_CHECKBOX,
  FIELD_SELECTBOX,
  FIELD_RADIO,
  FIELD_INPUT,
  FIELD_PHONE,
  FIELD_COUNTRY,
  FIELD_STATE
} from '../constants/index'

export const getFieldConfig = (field, allFields, dateFormat) => {
  const label = field.description || ''
  const help = !field.required ? `${i18n.t('(Optional)')}` : ''

  if (field.field_type === FIELD_DATE) {
    // Date field
    return {
      validation: field.required
        ? yup
            .date()
            .default(function () {
              return new Date()
            })
            .required(
              i18n.t('The {{field}} field is required', {
                field: label,
                interpolation: { escapeValue: false }
              })
            )
        : yup.date().default(function () {
            return new Date()
          }),
      options: {
        name: field.field_id,
        label,
        help,
        defaultValueText: i18n.t('Select date'),
        mode: 'date',
        config: {
          format: date => format(date, dateFormat)
        },
        fieldType: field.field_type,
        defaultValue: new Date()
      }
    }
  }

  if (field.field_type === FIELD_CHECKBOX) {
    // Checkbox field
    return {
      validation: field.required
        ? yup.boolean().required(
            i18n.t('The {{field}} field is required', {
              field: label,
              interpolation: { escapeValue: false }
            })
          )
        : yup.boolean(),
      options: {
        name: field.field_id,
        label,
        help,
        fieldType: field.field_type,
        defaultValue: ''
      }
    }
  }

  if (
    field.field_type === FIELD_SELECTBOX ||
    field.field_type === FIELD_RADIO
  ) {
    // Selectbox
    const values = Array.isArray(field.values)
      ? field.values
      : Object.keys(field.values)
    return {
      validation: field.required
        ? yup
            .mixed()
            .oneOf(values)
            .required(
              i18n.t('The {{field}} field is required', {
                field: label,
                interpolation: { escapeValue: false }
              })
            )
        : yup.mixed().oneOf(values),
      options: {
        name: field.field_id,
        label,
        help,
        fieldType: field.field_type,
        values: field.values,
        defaultValue: ''
      }
    }
  }

  if (field.field_type === FIELD_PASSWORD) {
    // Password field
    return {
      validation: field.required
        ? yup.string().required(
            i18n.t('The {{field}} field is required', {
              field: label,
              interpolation: { escapeValue: false }
            })
          )
        : yup.mixed(),
      options: {
        name: field.field_id,
        label,
        help,
        secureTextEntry: true,
        clearButtonMode: 'while-editing',
        fieldType: field.field_type,
        defaultValue: '',
        autoCapitalize: 'none'
      }
    }
  }

  if (field.field_type === FIELD_INPUT) {
    // Text field
    return {
      validation: field.required
        ? yup.string().required(
            i18n.t('The {{field}} field is required', {
              field: label,
              interpolation: { escapeValue: false }
            })
          )
        : yup.string(),
      options: {
        name: field.field_id,
        label,
        help,
        clearButtonMode: 'while-editing',
        fieldType: field.field_type,
        defaultValue: ''
      }
    }
  }

  if (field.field_type === FIELD_PHONE) {
    // Phone field
    return {
      validation: field.required
        ? yup.string().required(
            i18n.t('The {{field}} field is required', {
              field: label,
              interpolation: { escapeValue: false }
            })
          )
        : yup.string(),
      options: {
        name: field.field_id,
        label,
        help,
        clearButtonMode: 'while-editing',
        fieldType: field.field_type,
        defaultValue: '',
        keyboardType: 'phone-pad'
      }
    }
  }

  if (field.field_type === FIELD_COUNTRY) {
    // Country field
    const values = Array.isArray(field.values)
      ? field.values
      : Object.keys(field.values)
    return {
      validation: field.required
        ? yup
            .mixed()
            .oneOf(values)
            .required(
              i18n.t('The {{field}} field is required', {
                field: label,
                interpolation: { escapeValue: false }
              })
            )
        : yup.mixed().oneOf(values),
      options: {
        name: field.field_id,
        label,
        help,
        defaultValueText: i18n.t('Select country'),
        nullOption: {
          value: '',
          text: i18n.t('Select country')
        },
        fieldType: field.field_type,
        values: field.values,
        defaultValue: ''
      }
    }
  }

  if (field.field_type === FIELD_STATE) {
    // State field
    let countryCode = null
    let values = null

    const foundShippingCountry = allFields.filter(
      item => item.field_id === 's_country'
    )
    if (foundShippingCountry.length) {
      countryCode = foundShippingCountry[0].value
    }

    const foundBillingCountry = allFields.filter(
      item => item.field_id === 'b_country'
    )
    if (foundBillingCountry.length) {
      countryCode = foundBillingCountry[0].value
    }

    if (countryCode in field.values) {
      values = field.values[countryCode]
    }

    let validation = field.required
      ? yup.string().required(
          i18n.t('The {{field}} field is required', {
            field: label,
            interpolation: { escapeValue: false }
          })
        )
      : yup.string()

    if (values) {
      validation = yup.string().required(
        i18n.t('The {{field}} field is required', {
          field: label,
          interpolation: { escapeValue: false }
        })
      )
    }

    return {
      validation,
      options: {
        name: field.field_id,
        label,
        help,
        defaultValueText: i18n.t('Select state'),
        nullOption: {
          value: '',
          text: i18n.t('Select state')
        },
        fieldType: field.field_type,
        values: values,
        defaultValue: ''
      }
    }
  }

  return {
    validation: field.required
      ? yup.string().required(
          i18n.t('The {{field}} field is required', {
            field: label,
            interpolation: { escapeValue: false }
          })
        )
      : yup.string(),
    options: {
      name: field.field_id,
      label,
      help,
      clearButtonMode: 'while-editing',
      fieldType: FIELD_INPUT,
      defaultValue: ''
    }
  }
}
