import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import i18n from '../utils/i18n'

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    padding: 14
  }
})

export default class PaymentYandexKassaForm extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>{i18n.t('YooKassa')}</Text>
      </View>
    )
  }
}
