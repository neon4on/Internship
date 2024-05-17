import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { PRODUCT_NUM_COLUMNS } from '../utils'
import { I18nManager } from 'react-native'
import theme from '../config/theme'
import {
  View,
  Text,
  FlatList,
  Platform,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet
} from 'react-native'

// Utils
import debounce from 'lodash/debounce'
import uniqueId from 'lodash/uniqueId'
import i18n from '../utils/i18n'

// Actions
import * as productsActions from '../redux/actions/productsActions'

// Components
import ProductListView from '../components/ProductListView'
import Spinner from '../components/Spinner'

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  },
  topSearch: {
    backgroundColor: '#FAFAFA',
    height: Platform.OS === 'ios' ? 80 : 60,
    padding: 14,
    paddingTop: Platform.OS === 'ios' ? 30 : 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB'
  },
  input: {
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 8,
    flex: 2,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#EBEBEB',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    color: theme.$darkColor
  },
  inputAndroid: {
    height: 44,
    paddingLeft: 10,
    paddingRight: 10,
    flex: 2,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    color: theme.$darkColor
  },
  content: {
    flex: 1
  },
  emptyContainer: {
    marginTop: 80
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#989898'
  }
})

export class SearchScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      q: ''
    }
    this.searchResultsRef = React.createRef()
  }

  handleLoadMore = () => {
    const { productsActions, search } = this.props
    const { q } = this.state

    if (search.fetching || !search.hasMore) {
      return
    }

    productsActions.search({
      q,
      page: search.params.page + 1
    })
  }

  handleInputChange(q) {
    const { productsActions } = this.props

    if (q.length < 2) {
      return
    }

    this.setState(
      {
        q
      },
      () => {
        this.searchResultsRef.current.scrollToOffset({
          animated: false,
          offset: 0
        })
        productsActions.search({
          q
        })
      }
    )
  }

  renderEmptyList = () => {
    const { search } = this.props

    if (search.fetching) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" animating />
        </View>
      )
    }

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{i18n.t('List is empty')}</Text>
      </View>
    )
  }

  renderSpinner = () => <Spinner visible />

  renderFooter() {
    const { search } = this.props

    if (search.fetching && search.hasMore) {
      return <ActivityIndicator size="large" animating />
    }

    return null
  }

  render() {
    const { search, navigation } = this.props
    const _renderitem = item => (
      <ProductListView
        product={item}
        onPress={product => {
          navigation.navigate('ProductDetail', {
            pid: product.product_id
          })
        }}
      />
    )

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.topSearch}>
          <TextInput
            autoCorrect={false}
            autoCapitalize="none"
            onChangeText={debounce(t => this.handleInputChange(t), 1000)}
            style={Platform.os === 'ios' ? styles.input : styles.inputAndroid}
            clearButtonMode="while-editing"
            placeholder={i18n.t('Search')}
            placeholderTextColor={theme.$mediumGrayColor}
            returnKeyType="search"
          />
        </View>
        <View style={styles.content}>
          <FlatList
            data={search.items}
            keyExtractor={item => +item.product_id}
            removeClippedSubviews
            numColumns={PRODUCT_NUM_COLUMNS}
            ListEmptyComponent={() => this.renderEmptyList()}
            ListFooterComponent={() => this.renderFooter()}
            onEndReached={this.handleLoadMore}
            renderItem={_renderitem}
            ref={this.searchResultsRef}
          />
        </View>
      </SafeAreaView>
    )
  }
}

export default connect(
  state => ({
    search: state.search
  }),
  dispatch => ({
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(SearchScreen)
