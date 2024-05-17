import React, { Component } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, FlatList, InteractionManager, StyleSheet } from 'react-native'

// Actions
import * as ordersActions from '../redux/actions/ordersActions'

// Components
import Spinner from '../components/Spinner'
import EmptyList from '../components/EmptyList'
import OrderListItem from '../components/OrderListItem'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

export class Orders extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { ordersActions } = this.props
    InteractionManager.runAfterInteractions(() => {
      ordersActions.fetch()
    })
  }

  renderList = () => {
    const { orders, navigation } = this.props

    if (orders.fetching) {
      return null
    }

    return (
      <FlatList
        keyExtractor={(item, index) => `order_${index}`}
        data={orders.items}
        ListEmptyComponent={<EmptyList />}
        renderItem={({ item }) => (
          <OrderListItem
            key={uuidv4()}
            item={item}
            onPress={() => {
              navigation.navigate('OrderDetail', {
                orderId: item.order_id
              })
            }}
          />
        )}
      />
    )
  }

  render() {
    const { orders } = this.props
    if (orders.fetching) {
      return <Spinner visible />
    }

    return <View style={styles.container}>{this.renderList()}</View>
  }
}

export default connect(
  state => ({
    orders: state.orders
  }),
  dispatch => ({
    ordersActions: bindActionCreators(ordersActions, dispatch)
  })
)(Orders)
