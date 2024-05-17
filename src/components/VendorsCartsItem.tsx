import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from './Icon'

// Components
import CartProductList from './CartProductList'

// Utils
import { formatPrice } from '../utils'

const styles = StyleSheet.create({
  container: {
    marginBottom: 20
  },
  headerWrapper: {
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleWrapper: {
    flexDirection: 'row'
  },
  headerTitle: {
    fontSize: 20
  }
})

const VendorsCartsItem = ({
  item,
  auth,
  navigation,
  handleRefresh,
  refreshing,
  cartActions
}) => {
  const [cartIsOpen, setCartIsOpen] = useState(true)

  const renderHeader = title => (
    <TouchableOpacity
      style={styles.headerWrapper}
      onPress={() => setCartIsOpen(!cartIsOpen)}>
      <View style={styles.titleWrapper}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Icon
          name={cartIsOpen ? 'arrow-drop-up' : 'arrow-drop-down'}
          style={styles.clearIcon}
        />
      </View>
      {!cartIsOpen && <Text>{formatPrice(item.total_formatted.price)}</Text>}
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      {/* FIXME: Backward compatibility */}
      {item.cart_name
        ? renderHeader(item.cart_name)
        : item.product_groups[0] && renderHeader(item.product_groups[0].name)}
      {cartIsOpen && (
        <CartProductList
          cart={item}
          products={item.products}
          auth={auth}
          navigation={navigation}
          handleRefresh={handleRefresh}
          refreshing={refreshing}
          cartActions={cartActions}
        />
      )}
    </View>
  )
}

export default VendorsCartsItem
