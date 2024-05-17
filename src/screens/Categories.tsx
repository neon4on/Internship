import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { BLOCK_CATEGORIES } from '../constants'
import theme from '../config/theme'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Animated,
  StyleSheet
} from 'react-native'

// Utils
import { PRODUCT_NUM_COLUMNS, PRODUCT_IMAGE_WIDTH } from '../utils'
import i18n from '../utils/i18n'

// Actions
import * as productsActions from '../redux/actions/productsActions'

// Components
import Spinner from '../components/Spinner'
import VendorInfo from '../components/VendorInfo'
import SortProducts from '../components/SortProducts'
import CategoryBlock from '../components/CategoryBlock'
import ProductListView from '../components/ProductListView'

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  },
  emptyList: {
    fontSize: 16,
    textAlign: 'center',
    color: theme.$darkColor,
    marginTop: 16
  },
  loadingProductView: {
    borderRadius: theme.$borderRadius,
    backgroundColor: theme.$mediumGrayColor,
    margin: 5,
    height: PRODUCT_IMAGE_WIDTH + 85,
    width: `${Math.floor(94 / PRODUCT_NUM_COLUMNS)}%`
  }
})

export class Categories extends Component {
  constructor(props) {
    super(props)
    this.activeCategoryId = 0
    this.isFirstLoad = true

    this.state = {
      filters: '',
      products: [{}],
      subCategories: [],
      refreshing: false,
      isLoadMoreRequest: false,
      isSortChanging: false,
      fadeAnim: new Animated.Value(0.7)
    }
  }

  async componentDidMount() {
    const { products, layouts, route } = this.props
    const { categoryId } = this.props.categoryId ? this.props : this.props.route.params
    let { category } = route.params

    if (categoryId) {
      const categories = layouts.blocks.find(b => b.type === BLOCK_CATEGORIES)
      const items = Object.keys(categories.content.items).map(
        k => categories.content.items[k]
      )
      category = this.findCategoryById(items)
    }
    this.activeCategoryId = category.category_id
    const categoryProducts = products.items[this.activeCategoryId]
    const newState = {}

    if ('subcategories' in category && category.subcategories.length) {
      newState.subCategories = category.subcategories
    }

    if (categoryProducts) {
      newState.refreshing = false
      newState.products = categoryProducts
    }

    this.setState(
      state => ({
        ...state,
        ...newState
      }),
      this.handleLoad
    )
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { products } = nextProps
    const categoryProducts = products.items[this.activeCategoryId]
    if (categoryProducts) {
      this.setState({
        products: categoryProducts,
        refreshing: false
      })
      this.isFirstLoad = false
    }
  }

  handleLoad = async (page = 1) => {
    const { products, productsActions, route } = this.props
    const { companyId } = route.params
    const { filters } = this.state

    return await productsActions.fetchByCategory(
      this.activeCategoryId,
      page,
      companyId,
      {
        ...products.sortParams,
        features_hash: filters
      }
    )
  }

  findCategoryById(items) {
    const { categoryId } = this.props.categoryId ? this.props : this.props.route.params
    const flatten = []
    const makeFlat = list => {
      list.forEach(i => {
        flatten.push(i)
        if ('subcategories' in i) {
          makeFlat(i.subcategories)
        }
      })
    }
    makeFlat(items)
    return flatten.find(i => i.category_id == categoryId) || null
  }

  handleLoadMore() {
    const { products } = this.props
    const { isLoadMoreRequest } = this.state

    if (products.hasMore && !isLoadMoreRequest) {
      this.setState({
        isLoadMoreRequest: true
      })
      this.handleLoad(products.params.page + 1).then(() => {
        this.setState({
          isLoadMoreRequest: false
        })
      })
    }
  }

  handleRefresh() {
    this.setState(
      {
        refreshing: true
      },
      this.handleLoad
    )
  }

  renderSorting() {
    const { productsActions, products } = this.props

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(this.state.fadeAnim, {
          toValue: 0.3,
          duration: 275,
          useNativeDriver: false
        }),
        Animated.timing(this.state.fadeAnim, {
          toValue: 0.7,
          duration: 275,
          useNativeDriver: false
        })
      ]),
      { iterations: 10 }
    )

    return (
      <SortProducts
        sortParams={products.sortParams}
        filters={products.filters}
        onChange={async sort => {
          animation.start()
          this.setState({ isSortChanging: true })
          await productsActions.changeSort(sort)
          await this.handleLoad()
          this.setState({ isSortChanging: false })
        }}
        onChangeFilter={filters => {
          this.setState({ filters }, this.handleLoad)
        }}
      />
    )
  }

  renderHeader() {
    const { vendors, navigation, route } = this.props
    const { companyId } = route.params

    let vendorHeader = null
    if (companyId && vendors.items[companyId] && !vendors.fetching) {
      const vendor = vendors.items[companyId]
      vendorHeader = (
        <VendorInfo
          onViewDetailPress={() =>
            navigation.push('VendorDetail', { vendorId: companyId })
          }
          logoUrl={vendor.logo_url}
          productsCount={vendor.products_count}
        />
      )
    }

    return (
      <View>
        {vendorHeader}
        <CategoryBlock
          items={this.state.subCategories}
          wrapper={''}
          onPress={category =>
            navigation.push('Categories', { category, companyId })
          }
        />
        {this.renderSorting()}
      </View>
    )
  }

  renderSpinner = () => <Spinner visible />

  renderEmptyList = () => (
    <Text style={styles.emptyList}>
      {i18n.t('There are no products in this section')}
    </Text>
  )

  renderFooter() {
    const { products } = this.props

    if (products.fetching && products.hasMore) {
      return <ActivityIndicator size="large" animating />
    }

    return null
  }

  renderProductListView(item) {
    const { navigation } = this.props

    return (
      <ProductListView
        product={item}
        onPress={item =>
          navigation.push('ProductDetail', {
            pid: item.product_id
          })
        }
      />
    )
  }

  renderEmptyProductListView() {
    return (
      <Animated.View
        style={[styles.loadingProductView, { opacity: this.state.fadeAnim }]}
      />
    )
  }

  renderList() {
    const { products, refreshing } = this.state

    return (
      <FlatList
        data={products}
        keyExtractor={item => +item.product_id}
        ListHeaderComponent={() => this.renderHeader()}
        ListFooterComponent={() => this.renderFooter()}
        numColumns={PRODUCT_NUM_COLUMNS}
        renderItem={
          this.state.isSortChanging
            ? () => this.renderEmptyProductListView()
            : item => this.renderProductListView(item)
        }
        onRefresh={() => this.handleRefresh()}
        refreshing={refreshing}
        onEndReachedThreshold={1}
        onEndReached={() => this.handleLoadMore()}
        ListEmptyComponent={() => this.renderEmptyList()}
      />
    )
  }

  render() {
    const { products } = this.props

    return (
      <View style={styles.container}>
        {products.fetching && this.isFirstLoad
          ? this.renderSpinner()
          : this.renderList()}
      </View>
    )
  }
}

export default connect(
  state => ({
    products: state.products,
    layouts: state.layouts,
    vendors: state.vendors
  }),
  dispatch => ({
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(Categories)
