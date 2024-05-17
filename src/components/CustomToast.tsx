import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  toastTitle: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'left'
  },
  toastMessage: {
    color: '#333',
    marginTop: 2,
    textAlign: 'left'
  }
})

export const CustomToast = toast => {
  const containerStyle = {
    width: '85%',
    paddingVertical: 10,
    marginVertical: 4,
    borderRadius: 8,
    borderLeftWidth: 6,
    justifyContent: 'center',
    paddingLeft: 16,
    opacity: 1
  }

  switch (toast.data.notificationType) {
    case 'success':
      containerStyle.borderLeftColor = '#00C851'
      containerStyle.backgroundColor = '#d2f7e0'
      break

    case 'warning':
      containerStyle.borderLeftColor = '#ed6c02'
      containerStyle.backgroundColor = '#f2ccac'
      break

    case 'error':
      containerStyle.borderLeftColor = '#d32f2f'
      containerStyle.backgroundColor = '#f5baba'
      break

    default:
      containerStyle.borderLeftColor = '#0c7beb'
      containerStyle.backgroundColor = '#c6dff7'
  }

  return (
    <View style={containerStyle}>
      <Text style={styles.toastTitle}>{toast.data.title}</Text>
      <Text style={styles.toastMessage}>{toast.message}</Text>
    </View>
  )
}
