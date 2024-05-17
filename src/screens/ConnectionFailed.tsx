import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import i18n from '../utils/i18n_local'
import theme from '../config/theme'

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  signWrapper: {
    height: 150,
    width: 220,
    backgroundColor: '#fe5652',
    borderRadius: theme.$borderRadius,
    padding: 10,
    marginVertical: 20
  },
  signTextWrapper: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    borderWidth: 3,
    borderRadius: theme.$borderRadius,
    borderColor: '#fff'
  },
  signText: {
    fontSize: 30,
    fontWeight: 'normal',
    textAlign: 'center',
    color: '#fff'
  },
  message: {
    padding: 20,
    fontSize: 18,
    textAlign: 'center'
  }
})

export const ConnectionFailed = () => {
  return (
    <View style={styles.container}>
      <View style={styles.signWrapper}>
        <View style={styles.signTextWrapper}>
          <Text style={styles.signText}>{i18n.t('Sorry').toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.message}>
        {i18n.t(
          "We couldn't load this page right now. Our server may be unavailable, or it could be a problem with your Internet connection."
        )}
      </Text>
    </View>
  )
}
