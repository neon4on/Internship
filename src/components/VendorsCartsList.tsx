import React from 'react'
import { FlatList } from 'react-native'

// Components
import VendorsCartsItem from './VendorsCartsItem'
import EmptyCart from './EmptyCart'

const VendorsCartsList = ({
  carts,
  auth,
  handleRefresh,
  refreshing,
  cartActions,
  navigation
}) => (
  <FlatList
    data={carts}
    keyExtractor={(item, index) => `${index}`}
    renderItem={({ item }) => (
      <VendorsCartsItem
        item={item}
        auth={auth}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        cartActions={cartActions}
        navigation={navigation}
      />
    )}
    ListEmptyComponent={() => <EmptyCart />}
  />
)

export default VendorsCartsList
