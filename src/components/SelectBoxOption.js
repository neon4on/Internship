import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from '../components/Icon'
import theme from '../config/theme'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginVertical: 10
  },
  containerWarning: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: theme.$dangerColor,
    padding: 5,
    borderRadius: theme.$borderRadius
  },
  optionTitleWrapper: {
    flexDirection: 'row',
    color: theme.$darkColor,
    width: '45%'
  },
  selectWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: theme.$darkColor
  },
  iconAndValueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.$darkColor,
    width: '45%',
    justifyContent: 'flex-end'
  },
  selectBoxText: {
    fontSize: 14,
    color: theme.$darkColor
  },
  menuItemIcon: {
    fontSize: 25,
    marginHorizontal: 5,
    color: theme.$darkColor
  },
  optionRequiredSign: {
    color: 'red'
  }
})

const SelectBoxOption = ({ option, value, onChange, navigation }) => {
  const isOptionRequired = option.required === 'Y'

  if (!value) {
    return null
  }

  const pickerValues = option.selectVariants.map(variant => variant.selectValue)

  const changePickerValueHandler = value => {
    const selectedVariant = option.selectVariants.find(
      variant => variant.selectValue.toLowerCase() === value.toLowerCase()
    )
    onChange(selectedVariant)
  }

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('ScrollPicker', {
          pickerValues: pickerValues,
          changePickerValueHandler,
          selectValue: value.selectValue,
          title: option.selectTitle
        })
      }}
      style={
        option.requiredOptionWarning
          ? styles.containerWarning
          : styles.container
      }>
      <View style={styles.selectWrapper}>
        <View style={styles.optionTitleWrapper}>
          <Text style={styles.selectBoxText}>{option.selectTitle}</Text>
          {isOptionRequired && (
            <Text style={styles.optionRequiredSign}> *</Text>
          )}
        </View>
        <View style={styles.iconAndValueWrapper}>
          <Text style={styles.selectBoxText}>{value.selectValue}</Text>
          <Icon name="arrow-drop-down" style={styles.menuItemIcon} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default SelectBoxOption
