import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'

// Utils
import i18n from '../utils/i18n'

// Components
import Button from './Button'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    paddingTop: 20
  }
})

export default class extends PureComponent {
  render() {
    const { onBtnPress, disabled, btnText } = this.props

    return (
      <View style={styles.container}>
        <Button type="primary" onPress={() => onBtnPress()} disabled={disabled}>
          <Text style={styles.placeOrderBtnText}>{i18n.t(btnText)}</Text>
        </Button>
      </View>
    )
  }
}
