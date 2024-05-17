import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  I18nManager
} from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view'
import ActionSheet from '@alessiocancian/react-native-actionsheet'

// Utils
import i18n from '../../utils/i18n'

// Actions
import * as ordersActions from '../../redux/actions/vendorManage/ordersActions'

// Components
import Spinner from '../../components/Spinner'
import EmptyList from '../../components/EmptyList'
import OrderListItem from '../../components/OrderListItem'
import theme from '../../config/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75
  },
  backRightBtnRight: {
    backgroundColor: theme.$buttonBackgroundColor,
    right: 0
  },
  backTextWhite: {
    color: '#FFF'
  }
})

export class Orders extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false
    }

    this.orderID = 0
  }

  componentDidMount() {
    const {
      ordersActions,
      orders: { page }
    } = this.props

    ordersActions.fetch(page)
    ordersActions.getOrderStatuses()
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({
      refreshing: false
    })
  }

  showActionSheet = id => {
    this.orderID = id
    this.ActionSheet.show()
  }

  handleRefresh = () => {
    const { ordersActions } = this.props
    this.setState({
      refreshing: true
    })

    ordersActions.fetch(0)
  }

  handleLoadMore = () => {
    const {
      ordersActions,
      orders: { hasMore, page }
    } = this.props

    if (!hasMore) {
      return
    }

    ordersActions.fetch(page)
  }

  handleChangeStatus = index => {
    const { ordersActions, orders } = this.props

    if (orders.orderStatuses[index]) {
      ordersActions.updateVendorOrderStatus(
        this.orderID,
        orders.orderStatuses[index].status
      )
    }
  }

  renderItem = item => {
    const { navigation } = this.props

    return (
      <OrderListItem
        key={String(item.order_id)}
        item={item}
        onPress={() => {
          navigation.navigate('VendorManageOrderDetail', {
            orderId: item.order_id
          })
        }}
      />
    )
  }

  renderHiddenItem = rowData => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          style={[styles.backRightBtn, styles.backRightBtnRight]}
          onPress={() => this.showActionSheet(rowData.item.order_id)}>
          <Text style={styles.backTextWhite}>Change status</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { orders } = this.props

    if (orders.loading || !orders.orderStatuses) {
      return <Spinner visible />
    }

    if (!orders.items.length) {
      return <EmptyList />
    }

    const orderStatusesList = [
      ...orders.orderStatuses.map(item => item.description),
      i18n.t('Cancel')
    ]

    const ORDER_STATUSES_CANCEL_INDEX = orderStatusesList.length - 1

    return (
      <>
        <ActionSheet
          ref={ref => {
            this.ActionSheet = ref
          }}
          options={orderStatusesList}
          cancelButtonIndex={ORDER_STATUSES_CANCEL_INDEX}
          onPress={this.handleChangeStatus}
        />
        <SwipeListView
          data={orders.items}
          renderItem={({ item }) => this.renderItem(item)}
          renderHiddenItem={this.renderHiddenItem}
          leftOpenValue={I18nManager.isRTL ? 75 : 1}
          rightOpenValue={I18nManager.isRTL ? -1 : -75}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
          disableRightSwipe={I18nManager.isRTL ? false : true}
          disableLeftSwipe={I18nManager.isRTL ? true : false}
        />
      </>
    )
  }
}

export default connect(
  state => ({
    orders: state.vendorManageOrders,
    notifications: state.notifications
  }),
  dispatch => ({
    ordersActions: bindActionCreators(ordersActions, dispatch)
  })
)(Orders)
