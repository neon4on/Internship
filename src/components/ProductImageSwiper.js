import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { AppCarousel } from './AppCarousel'
import { SCREEN_WIDTH } from '../constants'
import theme from '../config/theme'

const NUMBER_HORIZONTAL_SCREEN_SIDES = 2

const styles = StyleSheet.create({
  productImage: {
    width:
      SCREEN_WIDTH - theme.$containerPadding * NUMBER_HORIZONTAL_SCREEN_SIDES,
    height: 300,
    resizeMode: 'contain'
  }
})

const SwiperWrapper = ({ children, navigation }) => {
  const renderImage = (slide, index) => {
    const { item } = slide

    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          navigation.navigate('Gallery', {
            images: [...children]
          })
        }}>
        <Image source={{ uri: item }} style={styles.productImage} />
      </TouchableOpacity>
    )
  }

  return (
    <AppCarousel
      items={children}
      renderItem={renderImage}
      carouselContainerHeight={300}
    />
  )
}

const MemoizedSwiperWrapper = React.memo(SwiperWrapper)
export default MemoizedSwiperWrapper
