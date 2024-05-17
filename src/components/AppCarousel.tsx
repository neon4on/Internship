import React, { useRef, useState } from 'react'
import { ListRenderItem, StyleSheet } from 'react-native'
import Carousel, { Pagination } from 'react-native-snap-carousel'
import theme from '../config/theme'

// Utils
import { WINDOW_WIDTH } from '../utils/index'

const styles = (carouselContainerHeight: string | number | undefined) =>
  StyleSheet.create({
    carouselContainer: {
      height: carouselContainerHeight
    },
    dots: {
      width: 5,
      height: 5,
      borderRadius: 5,
      marginHorizontal: 8,
      backgroundColor: theme.$dotsSwiperColor
    },
    dotsContainer: {
      marginTop: -25
    }
  })

export const AppCarousel = ({
  items,
  renderItem,
  carouselContainerHeight
}: {
  items: readonly unknown[]
  renderItem: ListRenderItem<unknown>
  carouselContainerHeight: string | number | undefined
}) => {
  const ref = useRef(null)
  const [activeSlide, setActiveSlide] = useState(0)

  const pagination = () => {
    return (
      <Pagination
        dotsLength={items.length}
        activeDotIndex={activeSlide}
        dotStyle={styles(undefined).dots}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        containerStyle={styles(undefined).dotsContainer}
      />
    )
  }

  return (
    <>
      <Carousel
        ref={ref}
        data={items}
        renderItem={renderItem}
        sliderWidth={WINDOW_WIDTH}
        itemWidth={WINDOW_WIDTH}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        activeAnimationType={'spring'}
        onSnapToItem={index => setActiveSlide(index)}
        contentContainerCustomStyle={
          styles(carouselContainerHeight).carouselContainer
        }
        enableSnap={true}
        decelerationRate={0.9}
        enableMomentum={true}
      />
      {pagination()}
    </>
  )
}
