import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

// Components
import Icon from './Icon'

// Utils
import i18n from '../utils/i18n'

const styles = StyleSheet.create({
  emptyListContainer: {
    marginTop: 48,
    flexDirection: 'column',
    alignItems: 'center'
  },
  emptyListIconWrapper: {
    backgroundColor: '#3FC9F6',
    width: 192,
    height: 192,
    borderRadius: 96,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyListIcon: {
    backgroundColor: 'transparent',
    color: '#fff',
    fontSize: 96
  },
  emptyListHeader: {
    fontSize: 19,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 16
  },
  emptyListDesc: {
    fontSize: 16,
    color: '#24282b',
    marginTop: 8
  }
})

const EmptyCart = () => (
  <View style={styles.emptyListContainer}>
    <View style={styles.emptyListIconWrapper}>
      <Icon name="add-shopping-cart" style={styles.emptyListIcon} />
    </View>
    <Text style={styles.emptyListHeader}>
      {i18n.t('Your shopping cart is empty.')}
    </Text>
    <Text style={styles.emptyListDesc}>{i18n.t('Looking for ideas?')}</Text>
  </View>
)

export default EmptyCart
