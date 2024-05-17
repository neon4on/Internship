import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 14
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  btnGroup: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15
  },
  btn: {
    backgroundColor: '#EBEBEB',
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    backgroundColor: 'transparent',
    color: '#989898',
    fontSize: 22,
    marginTop: -4,
    marginRight: -1
  },
  valueText: {
    color: '#989898',
    fontSize: 16,
    fontWeight: 'bold',
    width: 36,
    textAlign: 'center'
  }
})

export const QtyOption = ({ initialValue, step, onChange, max, min }) => {
  const quantity_tracking = useSelector(
    state => state.settings.quantity_tracking
  )

  const dicrement = () => {
    const newProductsAmount = initialValue - step

    if (min !== 0 && newProductsAmount < min) {
      return
    }

    onChange(newProductsAmount)
  }

  const increment = () => {
    const newProductsAmount = initialValue + step

    if (newProductsAmount > max && quantity_tracking) {
      return
    }

    onChange(newProductsAmount)
  }

  return (
    <View style={styles.container}>
      <View style={styles.btnGroup}>
        <TouchableOpacity style={styles.btn} onPress={dicrement}>
          <Text style={styles.btnText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.valueText}>{initialValue}</Text>
        <TouchableOpacity style={styles.btn} onPress={increment}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
