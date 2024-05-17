import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, StyleSheet, Alert, LogBox } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import i18n from '../utils/i18n'
import theme from '../config/theme'

// Import actions.
import * as cartActions from '../redux/actions/cartActions'

// Components
import Spinner from '../components/Spinner'
import VendorsCartsList from '../components/VendorsCartsList'
import CartProductList from '../components/CartProductList'

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  topBtn: {
    padding: 10
  },
  trashIcon: {
    height: 20,
    fontSize: 20
  }
})

export const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch()

  const cart = useSelector(state => state.cart)
  const auth = useSelector(state => state.auth)

  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(cartActions.fetch(undefined, cart.coupons))

      let productsAmount
      if (Object.keys(cart.carts).length) {
        if (cart.isSeparateCart) {
          productsAmount = Object.keys(cart.carts).reduce((accumulator, el) => {
            return el !== 'general'
              ? accumulator + cart.carts[el].amount
              : accumulator
          }, 0)
        } else {
          productsAmount = cart.carts.general.amount
        }
      }
    }

    fetchData()
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const setTrashIcon = () => (
      <Icon.Button
        name={'trash-outline'}
        size={25}
        borderRadius={0}
        backgroundColor={theme.$navBarBackgroundColor}
        color={theme.$navBarButtonColor}
        onPress={() => {
          Alert.alert(
            i18n.t('Clear all cart ?'),
            '',
            [
              {
                text: i18n.t('Cancel'),
                onPress: () => null,
                style: 'cancel'
              },
              {
                text: i18n.t('Ok'),
                onPress: () => dispatch(cartActions.clear())
              }
            ],
            { cancelable: true }
          )
        }}
      />
    )

    navigation.setOptions({
      headerRight: setTrashIcon
    })
  })

  const renderSpinner = () => {
    if (refreshing || !Object.keys(cart.carts).length) {
      return false
    }

    return <Spinner visible={cart.fetching} />
  }

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await dispatch(cartActions.fetch(undefined, cart.coupons))
    setRefreshing(false)
  }, [cart.coupons, dispatch])

  const renderList = () => {
    if (isLoading) {
      return renderSpinner()
    }

    return (
      <CartProductList
        navigation={navigation}
        cart={cart.carts.general}
        auth={auth}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        cartActions={cartActions}
      />
    )
  }

  const renderVendorsList = () => {
    if (isLoading) {
      return renderSpinner()
    }

    const newCarts = Object.keys(cart.carts).reduce((result, el) => {
      if (el !== 'general') {
        result.push(cart.carts[el])
      }
      return result
    }, [])

    return (
      <VendorsCartsList
        carts={newCarts}
        auth={auth}
        handleRefresh={handleRefresh}
        refreshing={refreshing}
        cartActions={cartActions}
        navigation={navigation}
      />
    )
  }

  return (
    <View style={styles.container}>
      {cart.isSeparateCart ? renderVendorsList() : renderList()}
    </View>
  )
}
