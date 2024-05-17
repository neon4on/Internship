import React, { useState, useEffect } from 'react'
import { View, Text, Switch, StyleSheet } from 'react-native'
import theme from '../config/theme'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  optionTitleWrapper: {
    flexDirection: 'row',
    width: '45%'
  },
  containerWarning: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: theme.$dangerColor,
    padding: 5,
    borderRadius: theme.$borderRadius
  },
  title: {
    fontSize: 14,
    textAlign: 'left',
    color: theme.$darkColor
  },
  optionRequiredSign: {
    color: 'red'
  }
})

export const CheckboxOption = ({ option, onChange, value }) => {
  const [title, setTitile] = useState('')
  const [currentValue, setCurrentValue] = useState(false)
  const isOptionRequired = option.required === 'Y'

  useEffect(() => {
    setTitile(option.option_name)
    setCurrentValue(!!parseInt(value?.position, 10))
  }, [value, option])

  const handleChange = v => {
    return onChange(option.selectVariants[v ? 0 : 1])
  }

  return (
    <View
      style={
        option.requiredOptionWarning
          ? styles.containerWarning
          : styles.container
      }>
      <View style={styles.optionTitleWrapper}>
        <Text style={styles.title}>{title}:</Text>
        {isOptionRequired && <Text style={styles.optionRequiredSign}> *</Text>}
      </View>
      <Switch
        trackColor={{ false: theme.$mediumGrayColor, true: '#81b0ff' }}
        thumbColor={currentValue ? '#007aff' : theme.$grayColor}
        ios_backgroundColor={theme.$mediumGrayColor}
        value={currentValue}
        onValueChange={v => handleChange(v)}
      />
    </View>
  )
}
