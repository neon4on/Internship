import React, { Component } from 'react'
import theme from '../config/theme'
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  I18nManager,
  StyleSheet
} from 'react-native'
import { v4 as uuidv4 } from 'uuid'
import i18n from '../utils/i18n'

// Utils
import { PRODUCT_NUM_COLUMNS } from '../utils'

// Components
import ProductListView from './ProductListView'

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: theme.$borderRadius,
    paddingTop: 5
  },
  headerWrapper: {
    flexDirection: 'row'
  },
  header: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    color: theme.$categoriesHeaderColor
  }
})

export default class ProductBlock extends Component {
  render() {
    const { items, name, wrapper, containerPadding } = this.props
    const width = containerPadding
      ? Dimensions.get('window').width - containerPadding * 2
      : Dimensions.get('window').width
    const fullWidth = 100
    const widthForItems = 94
    const itemMargin = 10
    const itemWidth =
      (width / fullWidth) * Math.floor(widthForItems / PRODUCT_NUM_COLUMNS)

    // If ProductBlock has only one product we have to recalculate it's width.
    let contentContainerStyleWidthIndex = items.length
    if (contentContainerStyleWidthIndex === 1) {
      contentContainerStyleWidthIndex *= PRODUCT_NUM_COLUMNS
    }

    let contentContainerWidth =
      (itemWidth + itemMargin) * contentContainerStyleWidthIndex

    if (contentContainerWidth < width) {
      contentContainerWidth = width
    }

    return (
      <View style={styles.container}>
        {wrapper !== '' && (
          <View style={styles.headerWrapper}>
            <Text style={styles.header}>{i18n.t(name)}</Text>
          </View>
        )}
        <ScrollView
          contentContainerStyle={{
            width: contentContainerWidth
          }}
          showsHorizontalScrollIndicator={false}
          horizontal>
          {items.map(item => (
            <ProductListView
              key={uuidv4()}
              product={{ item }}
              onPress={() => this.props.onPress(item)}
            />
          ))}
        </ScrollView>
      </View>
    )
  }
}
