import React from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import i18n from '../utils/i18n'
import theme from '../config/theme'

const styles = StyleSheet.create({
  addToCartBtnText: {
    textAlign: 'center',
    color: theme.$buttonWithBackgroundTextColor,
    fontSize: 16
  },
  addToCartBtn: {
    backgroundColor: theme.$buttonBackgroundColor,
    padding: 10,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export const AddToCartButton = ({ onPress, buttonStyle, textStyle, title }) => {
  return (
    <TouchableOpacity
      style={{ ...styles.addToCartBtn, ...buttonStyle }}
      onPress={onPress}>
      <Text style={{ ...styles.addToCartBtnText, ...textStyle }}>
        {i18n.t(title).toUpperCase()}
      </Text>
    </TouchableOpacity>
  )
}
