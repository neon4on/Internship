import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  PRODUCT_STATUS_REQUIRES_APPROVAL,
  PRODUCT_STATUS_DISAPPROVED
} from '../../constants/index'
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import theme from '../../config/theme'

// Actions
import * as productsActions from '../../redux/actions/vendorManage/productsActions'

// Components
import Spinner from '../../components/Spinner'
import EmptyList from '../../components/EmptyList'

// Utils
import { getImagePath, getProductStatus } from '../../utils'
import i18n from '../../utils/i18n'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  listItem: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#f1f1f1',
    backgroundColor: '#fff',
    justifyContent: 'space-between'
  },
  listItemImage: {
    width: 50,
    marginRight: 14
  },
  listItemContent: {
    maxWidth: '70%'
  },
  statusTextContainer: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center'
  },
  productImage: {
    width: 50,
    height: 50
  },
  listItemHeaderText: {
    fontWeight: 'bold',
    maxWidth: '90%',
    textAlign: 'left',
    color: theme.$darkColor
  },
  listItemText: {
    color: '#8c8c8c',
    textAlign: 'left'
  },
  listItemStatus: {
    fontSize: 11
  }
})

export class Products extends Component {
  constructor(props) {
    super(props)

    this.state = {
      refreshing: false
    }
  }

  componentDidMount() {
    this.handleLoadMore()
  }

  UNSAFE_componentWillReceiveProps() {
    this.setState({
      refreshing: false
    })
  }

  handleLoadMore = () => {
    const { productsActions, hasMore, page } = this.props
    if (!hasMore) {
      return
    }

    productsActions.fetchProducts(page)
  }

  handleRefresh = () => {
    const { productsActions } = this.props
    this.setState({
      refreshing: true
    })

    productsActions.fetchProducts(0)
  }

  handleStatusActionSheet = index => {
    const { productsActions } = this.props
    const statuses = ['A', 'H', 'D']
    const activeStatus = statuses[index]
    productsActions.updateProduct(this.product_id, {
      status: activeStatus
    })
  }

  renderItem = item => {
    const { productsActions, navigation } = this.props
    const swipeoutBtns = [
      {
        text: i18n.t('Delete'),
        type: 'delete',
        backgroundColor: '#ff362b',
        onPress: () => productsActions.deleteProduct(item.product_id)
      }
    ]
    const imageUri = getImagePath(item)
    const status = getProductStatus(item.status)

    if (
      item.status !== PRODUCT_STATUS_REQUIRES_APPROVAL &&
      item.status !== PRODUCT_STATUS_DISAPPROVED
    ) {
      swipeoutBtns.unshift({
        text: i18n.t('Status'),
        type: 'status',
        backgroundColor: '#ff6002',
        onPress: () => {
          this.product_id = item.product_id
          this.StatusActionSheet.show()
        }
      })
    }

    return (
      <TouchableOpacity
        style={styles.listItem}
        onPress={() =>
          navigation.navigate('VendorManageEditProduct', {
            productID: item.product_id,
            title: i18n.t(item.product || '').toUpperCase(),
            showBack: true
          })
        }>
        <View style={styles.listItemImage}>
          {imageUri !== null && (
            <Image
              style={styles.productImage}
              source={{ uri: imageUri }}
              resizeMode="contain"
              resizeMethod="resize"
            />
          )}
        </View>
        <View style={styles.listItemContent}>
          <View style={styles.listItemHeader}>
            <Text
              style={styles.listItemHeaderText}
              numberOfLines={1}
              ellipsizeMode="tail">
              {item.product}
            </Text>
          </View>
          <View>
            <Text style={styles.listItemText}>{item.product_code}</Text>
            <Text style={styles.listItemText}>
              {`${i18n.t('Price')}: ${item.price_formatted.price} ${
                item.amount !== 0 && '|'
              } ${i18n.t('In stock')}: ${item.amount}`}
            </Text>
          </View>
        </View>
        <View style={styles.statusTextContainer}>
          <Text
            style={{
              ...styles.listItemStatus,
              ...status.style
            }}>
            {status.text}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  getStatusActionsList = () => {
    return [
      i18n.t('Make Product Active'),
      i18n.t('Make Product Hidden'),
      i18n.t('Make Product Disabled'),
      i18n.t('Cancel')
    ]
  }

  render() {
    const { loading, products } = this.props
    const { refreshing } = this.state

    if (loading) {
      return <Spinner visible />
    }

    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={(item, index) => `order_${index}`}
          data={products}
          ListEmptyComponent={<EmptyList />}
          renderItem={({ item }) => this.renderItem(item)}
          onEndReached={this.handleLoadMore}
          refreshing={refreshing}
          onRefresh={() => this.handleRefresh()}
        />
      </View>
    )
  }
}

export default connect(
  state => ({
    notifications: state.notifications,
    products: state.vendorManageProducts.items,
    hasMore: state.vendorManageProducts.hasMore,
    loading: state.vendorManageProducts.loading,
    page: state.vendorManageProducts.page
  }),
  dispatch => ({
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(Products)
