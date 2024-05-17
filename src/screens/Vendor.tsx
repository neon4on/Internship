import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, FlatList, ActivityIndicator, Animated, StyleSheet } from 'react-native'

// Utils
import { PRODUCT_NUM_COLUMNS } from '../utils'

// Actions
import * as vendorActions from '../redux/actions/vendorActions'
import * as productsActions from '../redux/actions/productsActions'

// Components
import Spinner from '../components/Spinner'
import VendorInfo from '../components/VendorInfo'
import CategoryBlock from '../components/CategoryBlock'
import ProductListView from '../components/ProductListView'
import SortProducts from '../components/SortProducts'
import theme from '../config/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  }
})

export class Vendor extends Component {
  constructor(props) {
    super(props)
    this.isFirstLoad = true

    this.state = {
      filters: '',
      products: [],
      vendor: {
        logo_url: null
      },
      discussion: {
        search: {
          page: 1
        }
      }
    }
  }

  componentDidMount() {
    const { navigation, route } = this.props
    const { vendorName } = route.params

    if (typeof vendorName !== 'undefined') {
      navigation.setOptions({ title: vendorName })
    }
  }

  UNSAFE_componentWillMount() {
    const { vendors, vendorActions, productsActions, route } = this.props
    const { companyId } = route.params

    vendorActions.categories(companyId)
    this.handleLoad()

    if (!vendors.items[companyId] && !vendors.fetching) {
      vendorActions.fetch(companyId)
    } else {
      this.setState(
        {
          vendor: vendors.items[companyId]
        },
        () => {
          productsActions.fetchDiscussion(
            this.state.vendor.company_id,
            { page: this.state.discussion.search.page },
            'M'
          )
        }
      )
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { products, vendors, route } = nextProps
    const { companyId } = route.params
    const vendorProducts = products.items[companyId]

    if (vendorProducts) {
      this.setState(
        {
          products: vendorProducts
        },
        () => {
          this.isFirstLoad = false
        }
      )
    }

    if (vendors.items[companyId]) {
      this.setState({ vendor: vendors.items[companyId] })
    }
  }

  componentDidUpdate() {
    const { navigation } = this.props
    const { vendor } = this.state
    const vendorName = vendor?.company
    if (typeof vendorName !== 'undefined') {
      navigation.setOptions({ title: vendorName })
    }
  }

  handleLoad = (page = 1) => {
    const { route, vendorActions, products } = this.props
    const { companyId } = route.params
    const { filters } = this.state
    return vendorActions.products(companyId, page, {
      ...products.sortParams,
      features_hash: filters
    })
  }

  handleLoadMore() {
    const { products } = this.props
    if (products.hasMore && !products.fetching && !this.isFirstLoad) {
      this.handleLoad(products.params.page + 1)
    }
  }

  renderHeader() {
    const { vendorCategories, route, products, productsActions, navigation } =
      this.props
    const { companyId } = route.params
    const { vendor } = this.state

    if (!vendor.logo_url) {
      return null
    }

    const productHeader = (
      <SortProducts
        sortParams={products.sortParams}
        filters={products.filters}
        onChange={sort => {
          productsActions.changeSort(sort)
          this.handleLoad()
        }}
        onChangeFilter={filters => {
          this.setState({ filters }, this.handleLoad)
        }}
      />
    )

    return (
      <View>
        <VendorInfo
          onViewDetailPress={() =>
            navigation.navigate('VendorDetail', { vendorId: companyId })
          }
          logoUrl={vendor.logo_url}
          productsCount={vendor.products_count}
        />
        <CategoryBlock
          items={vendorCategories.items}
          onPress={category => {
            navigation.push('Categories', {
              category,
              companyId
            })
          }}
        />
        {productHeader}
      </View>
    )
  }

  renderFooter() {
    const { products } = this.props

    if (products.fetching && products.hasMore) {
      return <ActivityIndicator size="large" animating />
    }

    return null
  }

  render() {
    const { vendorCategories, vendors, navigation } = this.props
    const { products } = this.state

    if ((vendorCategories.fetching && this.isFirstLoad) ||
    (vendors.fetching && this.isFirstLoad)) {
      return <Spinner visible />
    }

    return (
      <View style={styles.container}>
        <FlatList
          data={products}
          keyExtractor={item => +item.product_id}
          removeClippedSubviews
          initialNumToRender={20}
          ListHeaderComponent={() => this.renderHeader()}
          ListFooterComponent={() => this.renderFooter()}
          numColumns={PRODUCT_NUM_COLUMNS}
          renderItem={item => (
            <ProductListView
              product={item}
              onPress={product =>
                navigation.push('ProductDetail', {
                  pid: product.product_id
                })
              }
            />
          )}
          onEndReached={() => this.handleLoadMore()}
        />
      </View>
    )
  }
}

export default connect(
  state => ({
    vendorCategories: state.vendorCategories,
    products: state.products,
    vendors: state.vendors
  }),
  dispatch => ({
    vendorActions: bindActionCreators(vendorActions, dispatch),
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(Vendor)
