import React, { Component } from 'react'
import {
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
  StyleSheet
} from 'react-native'

// Components
import Icon from '../components/Icon'
import { AppCarousel } from '../components/AppCarousel'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  img: {
    width: '94%',
    height: 400,
    resizeMode: 'contain'
  },
  slide: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  removeBtnContainer: {
    position: 'absolute',
    bottom: 0,
    left: 10,
    right: 10,
    flex: 1,
    alignItems: 'center'
  },
  removeBtn: {
    padding: 10
  },
  closeBtn: {
    color: 'black'
  },
  wrapper: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

export default class Gallery extends Component {
  constructor(props) {
    super(props)

    this.backHandler = null
  }

  removeImage() {
    const { route, navigation } = this.props
    const { onRemove } = route.params

    onRemove()
    navigation.pop()
  }

  render() {
    const { route } = this.props
    const { images, onRemove } = route.params

    if (!images.length) {
      return null
    }

    const renderImage = (slide, index) => {
      const { item } = slide
      return (
        <View style={styles.slide} key={index}>
          <Image style={styles.img} source={{ uri: item }} />
        </View>
      )
    }

    return (
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.container}>
          <AppCarousel
            items={images}
            renderItem={renderImage}
            carouselContainerHeight={'100%'}
          />
          {onRemove && (
            <View style={styles.removeBtnContainer}>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => this.removeImage()}>
                <Icon name="delete" style={styles.closeBtn} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    )
  }
}
