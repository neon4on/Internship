import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import theme from '../config/theme'

// Components
import Icon from './Icon'

const styles = StyleSheet.create({
  itemWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 16,
    paddingVertical: 19,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderColor: theme.$menuItemsBorderColor
  },
  itemText: {
    color: theme.$menuTextColor,
    fontSize: 13
  },
  checkIcon: {
    fontSize: 16,
    color: theme.$menuTextColor
  }
})

export const RadioButtonItem = ({ item, onPress, title }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(item)}
      style={styles.itemWrapper}>
      <Text style={styles.itemText}>{title}</Text>
      {item.selected && <Icon name="check" style={styles.checkIcon} />}
    </TouchableOpacity>
  )
}
