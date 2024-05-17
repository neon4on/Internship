import React, { Component } from 'react'
import theme from '../config/theme'
import {
  I18nManager,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native'

// Utils
import { get } from 'lodash'
import { stripTags } from '../utils'

// Components
import { AppCarousel } from './AppCarousel'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: theme.$borderRadius,
    borderBottomRightRadius: theme.$borderRadius
  },
  img: {
    width: 'auto',
    height: '100%',
    resizeMode: 'contain'
  },
  textBannerWrapper: {
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 20
  },
  textBanner: {
    textAlign: 'center',
    fontSize: 21
  },
  header: {
    fontWeight: 'bold',
    fontSize: 21,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
    color: theme.$categoriesHeaderColor,
    textAlign: I18nManager.isRTL ? 'right' : 'left'
  }
})

export default class BannerBlocks extends Component {
  static defaultProps = {
    items: []
  }
  renderImage = (slide, index) => {
    const { item } = slide
    const imageUri = get(item, 'main_pair.icon.image_path')
    const { onPress } = this.props

    return (
      <TouchableOpacity key={index} onPress={() => onPress(item)}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.img} />
        ) : (
          <View style={styles.textBannerWrapper}>
            <Text style={styles.textBanner}>{stripTags(item.description)}</Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  render() {
    const { items, name, wrapper } = this.props

    return (
      <View style={styles.container}>
        {wrapper !== '' && <Text style={styles.header}>{name}</Text>}
        <AppCarousel
          items={items}
          renderItem={this.renderImage}
          carouselContainerHeight={240}
        />
      </View>
    )
  }
}
