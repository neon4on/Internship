import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import {
  Button,
  RadioButton,
  Switch,
  Text,
  TextInput
} from 'react-native-paper'
import DatePicker from 'react-native-date-picker'
import { format } from 'date-fns'
import {
  FIELD_CHECKBOX,
  FIELD_COUNTRY,
  FIELD_DATE,
  FIELD_INPUT,
  FIELD_PASSWORD,
  FIELD_RADIO,
  FIELD_SELECTBOX,
  FIELD_STATE,
  FIELD_TEMPLATE
} from '../constants'

const styles = StyleSheet.create({
  errorText: {
    fontSize: 10,
    color: 'red'
  },
  fieldName: {
    marginBottom: 10
  },
  fieldInputSingle: {
    textAlign: 'auto' // Fix: TextInput with TextAlign on iOS does not add ellipsis instead wraps
  },
  fieldInputMulti: {
    letterSpacing: 0,
    paddingHorizontal: 4
  }
})

const FormField = props => {
  const {
    field: { name, onBlur, onChange, value },
    form: { errors, touched, setFieldTouched },
    handleChange,
    multiline,
    style,
    ...inputProps
  } = props

  const [openDatePicker, setOpenDatePicker] = useState(false)
  const hasError = errors[name] && touched[name]
  const dateFormat = useSelector(state => state.settings.dateFormat)

  switch (inputProps.fieldType) {
    case FIELD_INPUT:
      return (
        <>
          <TextInput
            name={name}
            value={value}
            mode="outlined"
            multiline={multiline}
            onChangeText={text => onChange(name)(text)}
            onBlur={() => {
              setFieldTouched(name)
              onBlur(name)
            }}
            style={multiline ? style : ([style, styles.fieldInputSingle])}
            contentStyle={multiline ? styles.fieldInputMulti : {}}
            {...inputProps}
          />
          {hasError && (
            <Text variant="labelSmall" style={styles.errorText}>
              {errors[name]}
            </Text>
          )}
        </>
      )

    case FIELD_PASSWORD:
      return (
        <>
          <TextInput
            name={name}
            value={value}
            mode="outlined"
            autoCapitalize="none"
            secureTextEntry={true}
            onChangeText={text => onChange(name)(text)}
            onBlur={() => {
              setFieldTouched(name)
              onBlur(name)
            }}
            {...inputProps}
          />
          {hasError && (
            <Text variant="labelSmall" style={styles.errorText}>
              {errors[name]}
            </Text>
          )}
        </>
      )

    case FIELD_CHECKBOX:
      return (
        <>
          <Text>{inputProps.label}</Text>
          <Switch
            value={value}
            onValueChange={value => {
              const newChange = value => props.form.setFieldValue(name, value)

              newChange(value)
            }}
            onBlur={() => {
              setFieldTouched(name)
              onBlur(name)
            }}
            {...inputProps}
          />
          {hasError && (
            <Text variant="labelSmall" style={styles.errorText}>
              {errors[name]}
            </Text>
          )}
        </>
      )

    case FIELD_RADIO:
      return (
        <>
          <Text>{inputProps.label}</Text>
          <RadioButton.Group
            onValueChange={value => {
              onChange(name)(value)
            }}
            value={value}
            onBlur={() => {
              setFieldTouched(name)
              onBlur(name)
            }}
            {...inputProps}>
            {Object.keys(inputProps.values).map(key => {
              return (
                <RadioButton.Item label={inputProps.values[key]} value={key} />
              )
            })}
          </RadioButton.Group>
        </>
      )

    case FIELD_SELECTBOX:
    case FIELD_COUNTRY:
    case FIELD_STATE: {
      if (!inputProps.values) {
        return (
          <>
            <TextInput
              name={name}
              value={value}
              mode="outlined"
              onChangeText={text => onChange(name)(text)}
              onBlur={() => {
                setFieldTouched(name)
                onBlur(name)
              }}
              {...inputProps}
            />
            {hasError && (
              <Text variant="labelSmall" style={styles.errorText}>
                {errors[name]}
              </Text>
            )}
          </>
        )
      }

      return (
        <>
          <Text style={styles.fieldName}>{inputProps.label}</Text>
          <Button
            mode="outlined"
            onPress={() => {
              inputProps.navigation.push('ScrollPicker', {
                pickerValues: Object.values(inputProps.values),
                additionalData: name,
                changePickerValueHandler: (value, name) => {
                  const valueKey = Object.keys(inputProps.values).find(
                    key => inputProps.values[key] === value
                  )

                  onChange(name)(valueKey)
                  if (handleChange) {
                    handleChange(valueKey, name)
                  }
                },
                selectValue: inputProps.values[value],
                title: inputProps.label
              })
            }}>
            {inputProps.values[value]
              ? inputProps.values[value]
              : inputProps.defaultValueText}
          </Button>
          {hasError && (
            <Text variant="labelSmall" style={styles.errorText}>
              {errors[name]}
            </Text>
          )}
        </>
      )
    }

    case FIELD_TEMPLATE:
      return (
        <>
          {inputProps.template({
            value,
            name,
            handleChange: (value, name) => {
              // Use for custom fields https://stackoverflow.com/questions/51518930/cannot-read-property-type-of-undefined-while-using-react-select-with-formik
              const newChange = value => props.form.setFieldValue(name, value)

              newChange(value)
            },
            hasError
          })}
        </>
      )

    case FIELD_DATE: {
      const dateValue = value ? new Date(value) : new Date()
      return (
        <>
          <Text>{inputProps.label}</Text>
          <Button mode="outlined" onPress={() => setOpenDatePicker(true)}>
            {format(dateValue, dateFormat)}
          </Button>
          <DatePicker
            modal
            open={openDatePicker}
            date={dateValue}
            mode="date"
            onConfirm={date => {
              const newDate = format(date, dateFormat)
              onChange(name)(newDate)
              setOpenDatePicker(false)
            }}
            onCancel={() => {
              setOpenDatePicker(false)
            }}
            {...inputProps}
          />
          {hasError && (
            <Text variant="labelSmall" style={styles.errorText}>
              {errors[name]}
            </Text>
          )}
        </>
      )
    }

    default:
      return (
        <>
          <TextInput
            name={name}
            value={value}
            mode="outlined"
            multiline={multiline}
            onChangeText={text => onChange(name)(text)}
            onBlur={() => {
              setFieldTouched(name)
              onBlur(name)
            }}
            style={multiline ? style : ([style, styles.fieldInputSingle])}
            contentStyle={multiline ? styles.fieldInputMulti : {}}
            {...inputProps}
          />
          {hasError && (
            <Text variant="labelSmall" style={styles.errorText}>
              {errors[name]}
            </Text>
          )}
        </>
      )
  }
}

export default FormField
