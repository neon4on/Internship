import React from 'react'
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux'
import {
  CATEGORY_VIEW_WITHOUT_BACKGROUND,
  CATEGORY_VIEW_WITH_BACKGROUND
} from '../constants/index'
import theme from '../config/theme'

// Utils
import { getImagePath } from '../utils'

const styles = StyleSheet.create({
  solidImageContainer: {
    width: '32%',
    marginVertical: 5,
    marginHorizontal: 2
  },
  solidImage: {
    height: 100,
    borderRadius: theme.$borderRadius,
    resizeMode: 'cover',
    backgroundColor: theme.$categoryBlockBackgroundColor
  },
  pngImageContainer: {
    width: '32%',
    padding: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: theme.$borderRadius,
    resizeMode: 'contain',
    backgroundColor: theme.$categoryBlockBackgroundColor,
    marginHorizontal: 2
  },
  pngImage: {
    height: 100,
    width: '100%',
    resizeMode: 'contain',
    backgroundColor: theme.$categoryBlockBackgroundColor
  },
  categoryTitleWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 4,
    paddingRight: 4
  },
  categoryTitle: {
    textAlign: 'center',
    fontSize: 12,
    paddingLeft: 4,
    paddingRight: 4,
    color: theme.$categoryBlockTextColor
  }
})

const CategoryListView = ({ category, onPress, appearance }) => {
  const imageUri = getImagePath(category)

  if (!appearance) {
    appearance = useSelector(state => state.settings.categoryAppearance)
  }

  const renderSolidImage = () => {
    return (
      <TouchableOpacity
        onPress={() => onPress(category)}
        style={styles.solidImageContainer}>
        {imageUri ? (
          <Image
            source={{
              uri: imageUri
            }}
            style={styles.solidImage}
          />
        ) : null}
        <View style={styles.categoryTitleWrapper}>
          <Text numberOfLines={3} style={styles.categoryTitle}>
            {category.category}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderPngImage = () => {
    return (
      <TouchableOpacity
        style={styles.pngImageContainer}
        onPress={() => onPress(category)}>
        <Image source={{ uri: imageUri }} style={styles.pngImage} />
        <View style={styles.categoryTitleWrapper}>
          <Text numberOfLines={3} style={styles.categoryTitle}>
            {category.category}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  const renderWithoutImage = () => {
    return (
      <TouchableOpacity
        style={styles.pngImageContainer}
        onPress={() => onPress(category)}>
        <View style={styles.categoryTitleWrapper}>
          <Text numberOfLines={3} style={styles.categoryTitle}>
            {category.category}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  switch (appearance) {
    case CATEGORY_VIEW_WITHOUT_BACKGROUND:
      return renderPngImage()
    case CATEGORY_VIEW_WITH_BACKGROUND:
      return renderSolidImage()
    default:
      return renderWithoutImage()
  }
}

export default CategoryListView
