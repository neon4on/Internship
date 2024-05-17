import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import theme from '../../config/theme'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native'

// Components
import Spinner from '../../components/Spinner'

// Actions
import * as categoriesActions from '../../redux/actions/vendorManage/categoriesActions'
import * as stepsActions from '../../redux/actions/stepsActions'
import { getCategoriesList } from '../../services/vendors'

// Utils
import i18n from '../../utils/i18n'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$grayColor
  },
  scrollContainer: {
    paddingBottom: 14
  },
  itemWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0'
  },
  itemText: {
    color: theme.$categoryBlockTextColor,
    paddingLeft: 14
  },
  selectedIcon: {
    color: '#fff',
    marginRight: 10
  }
})

export class CategoriesPicker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: true,
      categories: []
    }
  }

  async componentDidMount() {
    const { categoriesActions, route } = this.props
    const { parent, categories } = route.params

    if (parent === 0) {
      categoriesActions.clear()
      this.handleLoadCategories()
      return
    }

    this.setState({
      loading: false,
      categories
    })
  }

  handleLoadCategories = async (parent_id = 0, page = 1) => {
    this.setState({ loading: true })
    try {
      const response = await getCategoriesList(parent_id, page)
      if (response.data.categories) {
        this.setState({
          loading: false,
          categories: response.data.categories
        })
      }
    } catch (error) {
      this.setState({ loading: false })
    }
  }

  handleToggle = async item => {
    const { categoriesActions, stateSteps, stepsActions, navigation, route } =
      this.props
    const { onCategoryPress } = route.params

    try {
      const response = await getCategoriesList(item.category_id)
      if (response.data.categories.length) {
        navigation.replace('VendorManageCategoriesPicker', {
          parent: item.category_id,
          categories: response.data.categories,
          onCategoryPress
        })
        return
      }

      categoriesActions.toggleCategory(item)

      if (onCategoryPress) {
        onCategoryPress(item)
        navigation.pop()
        return
      }

      const addProductFlow = stateSteps.flows.addProductFlow

      // Set the flow, filter steps and define the first step.
      const startStep = await stepsActions.setFlow(
        'addProductFlow',
        addProductFlow,
        {
          category_ids: [item.category_id]
        }
      )

      navigation.navigate(startStep.screenName, {
        name: startStep.screenName,
        category_ids: [item.category_id],
        currentStep: startStep
      })
    } catch (error) {
      console.log('Error. CategoriesPicker handleToggle: ', error)
      this.setState({ loading: false })
    }
  }

  renderEmptyList = () => (
    <Text style={styles.emptyList}>{i18n.t('There are no categories')}</Text>
  )

  renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemWrapper}
      onPress={() => this.handleToggle(item)}>
      <Text style={styles.itemText}>{item.category}</Text>
    </TouchableOpacity>
  )

  render() {
    const { categories, loading } = this.state

    if (loading) {
      return <Spinner visible />
    }

    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={categories}
          keyExtractor={item => `${item.category_id}`}
          numColumns={1}
          renderItem={this.renderCategoryItem}
          onEndReachedThreshold={1}
          ListEmptyComponent={() => this.renderEmptyList()}
        />
      </View>
    )
  }
}

export default connect(
  state => ({
    selected: state.vendorManageCategories.selected,
    stateSteps: state.steps
  }),
  dispatch => ({
    categoriesActions: bindActionCreators(categoriesActions, dispatch),
    stepsActions: bindActionCreators(stepsActions, dispatch)
  })
)(CategoriesPicker)
