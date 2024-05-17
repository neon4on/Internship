import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import theme from '../../users/com.simtech.multivendor/src/config/theme'

// Utils
import { formatPrice } from '../utils'

const styles = StyleSheet.create({
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
    padding: 14,
    backgroundColor: '#fff',
    width: '100%',
    overflow: 'hidden',
    height: 70
  },
  orderItemEmail: {
    fontSize: 11,
    color: 'gray'
  },
  orderItemCustomer: {
    marginRight: 20
  },
  orderItemCustomerText: {
    fontWeight: 'bold',
    color: theme.$darkColor
  },
  orderItemStatusText: {
    textAlign: 'right'
  },
  orderItemTotal: {
    fontWeight: 'bold',
    fontSize: 11,
    textAlign: 'right',
    color: theme.$darkColor
  }
})

const OrderListItem = props => {
  const { onPress, item } = props

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.orderItem}
      activeOpacity={1}>
      <View style={styles.orderItemCustomer}>
        <Text style={styles.orderItemCustomerText}>
          #{item.order_id} {item.firstname} {item.lastname}
        </Text>
        <Text style={styles.orderItemEmail}>{item.email}</Text>
      </View>
      <View style={styles.orderItemStatus}>
        <Text
          style={[
            styles.orderItemStatusText,
            { color: item?.status_data?.color }
          ]}>
          {item.status_data.description}
        </Text>
        <Text style={styles.orderItemTotal}>
          {item.total_formatted
            ? formatPrice(item.total_formatted.price)
            : item.total}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

export default OrderListItem
