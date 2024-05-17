import React, { Component } from 'react'
import { PermissionsAndroid, Platform } from 'react-native'
import { uniqueId } from 'lodash'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DeviceInfo from 'react-native-device-info'
import { launchImageLibrary } from 'react-native-image-picker'
import i18n from '../../utils/i18n'
import theme from '../../config/theme'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Alert,
  StyleSheet
} from 'react-native'

// Components
import BottomActions from '../../components/BottomActions'
import StepByStepSwitcher from '../../components/StepByStepSwitcher'

// Actions
import * as stepsActions from '../../redux/actions/stepsActions'
import * as imagePickerActions from '../../redux/actions/imagePickerActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  },
  scrollContainer: {
    paddingBottom: 14
  },
  emptyList: {
    textAlign: 'center'
  },
  header: {
    marginLeft: 14,
    marginTop: 14
  },
  imageWrapper: {
    position: 'relative'
  },
  imagePickerWrapper: {
    padding: 20,
    backgroundColor: '#fff'
  },
  sectionText: {
    color: theme.$buttonBackgroundColor
  }
})

const IMAGE_NUM_COLUMNS = 4

export class AddProductStep1 extends Component {
  handleGoNext = () => {
    const { stateSteps, navigation, images, route, stepsActions } = this.props
    const { currentStep, category_ids } = route.params

    // Define next step
    const nextStep =
      stateSteps.flowSteps[
        Object.keys(stateSteps.flowSteps)[currentStep.stepNumber + 1]
      ]
    stepsActions.setNextStep(nextStep)

    navigation.navigate(nextStep.screenName, {
      stepsData: { images, category_ids },
      currentStep: nextStep
    })
  }

  handleRemoveImage = async imageIndex => {
    const { images, imagePickerActions } = this.props
    const newSelectedPhotos = [...images]

    newSelectedPhotos.splice(imageIndex, 1)
    await imagePickerActions.toggle(newSelectedPhotos)
  }

  renderImagePicker = async () => {
    const { navigation, imagePickerActions } = this.props
    let granted = ''

    if (Platform.OS === 'android') {
      try {
        const deviceVersion = Number(DeviceInfo.getSystemVersion())

        if (deviceVersion >= 13) {
          granted = PermissionsAndroid.RESULTS.GRANTED
        } else {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: i18n.t('App Media Permission'),
              message: i18n.t('Allow to access photos, media on your device?'),
              buttonNegative: i18n.t('Cancel'),
              buttonPositive: i18n.t('OK')
            }
          )
        }
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(i18n.t('Photo gallery permission denied'))
        }
      } catch (error) {
        let errorMessage = 'Permission error'
        if (error instanceof Error) {
          errorMessage = error.message
        }
        console.log(errorMessage)
      }
    }

    try {
      const photos = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0
      })

      if (photos.assets) {
        const photosUris = photos.assets.map(photo => photo.uri)
        await imagePickerActions.toggle(photosUris)
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  renderHeader = () => {
    const { route } = this.props
    const { currentStep } = route.params

    return (
      <View>
        <View style={styles.header}>
          <StepByStepSwitcher currentStep={currentStep} />
        </View>
        <TouchableOpacity
          style={styles.imagePickerWrapper}
          onPress={() => {
            this.renderImagePicker()
          }}>
          <Text style={styles.sectionText}>{i18n.t('Select image')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderEmptyList = () => (
    <Text style={styles.emptyList}>{i18n.t('There are no images')}</Text>
  )

  renderImage = image => {
    const { navigation } = this.props
    const IMAGE_WIDTH = Dimensions.get('window').width / IMAGE_NUM_COLUMNS

    return (
      <TouchableOpacity
        style={styles.imageWrapper}
        key={uniqueId('image-')}
        onPress={() =>
          navigation.navigate('Gallery', {
            images: [image.item],
            onRemove: () => this.handleRemoveImage(image.index)
          })
        }>
        <Image
          style={{
            width: IMAGE_WIDTH,
            height: IMAGE_WIDTH
          }}
          source={{ uri: image.item }}
        />
      </TouchableOpacity>
    )
  }

  render() {
    const { images } = this.props

    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.scrollContainer}
          data={images}
          keyExtractor={item => item}
          ListHeaderComponent={() => this.renderHeader()}
          numColumns={IMAGE_NUM_COLUMNS}
          renderItem={this.renderImage}
          ListEmptyComponent={() => this.renderEmptyList()}
        />
        <BottomActions
          onBtnPress={this.handleGoNext}
          btnText={i18n.t('Next')}
        />
      </View>
    )
  }
}

export default connect(
  state => ({
    images: state.imagePicker.selected,
    stateSteps: state.steps
  }),
  dispatch => ({
    imagePickerActions: bindActionCreators(imagePickerActions, dispatch),
    stepsActions: bindActionCreators(stepsActions, dispatch)
  })
)(AddProductStep1)
