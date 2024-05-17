import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, StyleSheet, ScrollView } from 'react-native'
import DiscussionList from '../components/DiscussionList'
import theme from '../config/theme'

// Actions
import * as productsActions from '../redux/actions/productsActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor,
    paddingVertical: 20
  },
  scrollContainer: {
    paddingHorizontal: theme.$containerPadding
  }
})

export class Discussion extends Component {
  constructor(props) {
    super(props)
    this.requestSent = false

    this.state = {
      discussion: {}
    }
  }

  UNSAFE_componentWillMount() {
    const { discussion, route } = this.props
    const { productId } = route.params
    let activeDiscussion = discussion.items[`p_${productId}`]

    if (!activeDiscussion) {
      activeDiscussion = {
        disable_adding: false,
        average_rating: 0,
        posts: [],
        search: {
          page: 1,
          total_items: 0
        }
      }
    }

    this.setState({
      discussion: activeDiscussion
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { route } = this.props
    const { productId } = route.params
    const activeDiscussion = nextProps.discussion.items[`p_${productId}`]

    this.setState(
      {
        discussion: activeDiscussion
      },
      () => {
        this.requestSent = false
      }
    )
  }

  handleLoadMore() {
    const { route } = this.props
    const { productId } = route.params
    const { discussion } = this.state
    const hasMore = discussion.search.total_items != discussion.posts.length

    if (hasMore && !this.requestSent && !this.props.discussion.fetching) {
      this.requestSent = true
      this.props.productsActions.fetchDiscussion(productId, {
        page: discussion.search.page + 1
      })
    }
  }

  render() {
    const { discussion } = this.state
    const { navigation } = this.props

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          <DiscussionList
            infinite
            type={discussion.type}
            items={discussion.posts}
            fetching={this.props.discussion.fetching}
            onEndReached={() => this.handleLoadMore()}
            navigation={navigation}
          />
        </ScrollView>
      </View>
    )
  }
}

export default connect(
  state => ({
    discussion: state.discussion
  }),
  dispatch => ({
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(Discussion)
