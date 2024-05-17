import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

import i18n from '../utils/i18n'

const styles = StyleSheet.create({
  container: {
    marginTop: 30
  },
  header: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center'
  }
})

/**
 * Renders empty information block.
 *
 * @return {JSX.Element}
 */
const EmptyList = () => (
  <View style={styles.container}>
    <Text style={styles.header}>{i18n.t('List is empty')}.</Text>
  </View>
)

export default EmptyList
