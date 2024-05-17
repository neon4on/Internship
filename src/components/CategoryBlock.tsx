import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import theme from '../config/theme'
import { v4 as uuidv4 } from 'uuid'

// Utils
import orderBy from 'lodash/orderBy'
import i18n from '../utils/i18n'

// Components
import CategoryListView from './CategoryListView'

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: theme.$borderRadius
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    alignItems: 'stretch'
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    color: theme.$categoriesHeaderColor,
    textAlign: 'left'
  }
})

export default class CategoriesBlocks extends Component {
  render() {
    const { items, wrapper, onPress, appearance } = this.props

    if (!items.length) {
      return null
    }

    const itemsList = orderBy(items, i => parseInt(i.position, 10), [
      'asc'
    ]).map(item => (
      <CategoryListView
        appearance={appearance}
        category={item}
        onPress={() => onPress(item)}
        key={uuidv4()}
      />
    ))

    return (
      <View style={styles.container}>
        {wrapper !== '' && (
          <Text style={styles.header}>{i18n.t('Categories')}</Text>
        )}
        <View style={styles.wrapper}>{itemsList}</View>
      </View>
    )
  }
}
