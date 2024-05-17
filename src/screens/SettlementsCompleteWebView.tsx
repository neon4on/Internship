import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'

// Components
import { WebViewer } from '../components/WebViewer'

// Actions
import * as authActions from '../redux/actions/authActions'
import * as cartActions from '../redux/actions/cartActions'

// Utils
import { objectToQuerystring } from '../utils/index'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

export class SettlementsCompleteWebView extends Component {
  componentDidMount() {
    const { navigation, route } = this.props
    const { title } = route.params
    navigation.setOptions({
      title: title,
      headerBackVisible: false,
      headerLeft: () => null
    })
  }

  onNavigationStateChange = async nativeEvent => {
    const { route, cartActions, navigation } = this.props
    const { return_url, orderId, cancel_url, cart } = route.params

    if (
      nativeEvent?.url &&
      return_url &&
      nativeEvent?.url.toLowerCase().startsWith(return_url.toLowerCase())
    ) {
      await cartActions.clear(cart)
      navigation.reset({
        index: 0,
        routes: [{ name: 'CartScreen' }]
      })
      navigation.push('CheckoutComplete', { orderId })
    }

    if (
      nativeEvent?.url &&
      cancel_url &&
      nativeEvent?.url.toLowerCase().startsWith(cancel_url.toLowerCase())
    ) {
      navigation.pop()
    }
  }

  render() {
    const { route } = this.props
    const {
      payment_url,
      return_url,
      query_parameters,
      cart,
      orderId,
      storeCart,
      cancel_url
    } = route.params
    let url = payment_url

    if (Object.keys(query_parameters)?.length) {
      url = `${url}?${objectToQuerystring(query_parameters)}`
    }

    return (
      <View style={styles.container}>
        <WebViewer
          uri={url}
          returnUrl={return_url}
          cancelUrl={cancel_url}
          cart={cart}
          orderId={orderId}
          storeCart={storeCart}
          onNavigationStateChange={this.onNavigationStateChange}
        />
      </View>
    )
  }
}

export default connect(
  state => ({
    auth: state.auth
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch)
  })
)(SettlementsCompleteWebView)
