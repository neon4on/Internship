import React, { PureComponent } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import theme from '../config/theme'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 4
  },
  title: {
    fontWeight: 'bold',
    paddingRight: 4,
    fontSize: 14,
    textAlign: 'left',
    color: theme.$darkColor,
    opacity: 0.8
  },
  text: {
    color: '#7C7C7C',
    fontSize: 14,
    flex: 1,
    textAlign: 'right'
  }
})

export default class extends PureComponent {
  render() {
    const { title, children } = this.props

    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text} numberOfLines={4}>
          {children}
        </Text>
      </View>
    )
  }
}
