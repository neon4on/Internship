import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import theme from '../config/theme'
import i18n from '../utils/i18n'

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14
  },
  text: {
    fontSize: 14,
    color: theme.$darkColor
  },
  nameContainer: {
    flex: 1,
    alignItems: 'flex-start',
    flexGrow: 1
  },
  valueContainer: {
    flex: 1,
    alignItems: 'flex-end',
    flexGrow: 2
  }
})

const SectionRow = ({ name, value }) => {
  return (
    <View style={styles.row}>
      <View style={styles.nameContainer}>
        <Text style={styles.text}>{i18n.t(name)}</Text>
      </View>
      <View style={styles.valueContainer}>
        <Text style={styles.text}>{value}</Text>
      </View>
    </View>
  )
}

export default SectionRow
