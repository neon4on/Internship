import React, { useEffect, useRef, useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Switch,
  TextInput,
  Keyboard,
  StyleSheet
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  FEATURE_TYPE_DATE,
  FEATURE_TYPE_CHECKBOX,
  FEATURE_TYPE_SELECT,
  FEATURE_TYPE_BRAND,
  FEATURE_TYPE_CHECKBOX_MULTIPLE,
  FEATURE_TYPE_TEXT,
  FEATURE_TYPE_NUMBER_SLIDER
} from '../../constants'
import theme from '../../config/theme'

// Utils
import i18n from '../../utils/i18n'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'

// Components
import Spinner from '../../components/Spinner'
import BottomActions from '../../components/BottomActions'

// Actions
import * as productsActions from '../../redux/actions/vendorManage/productsActions'

const featuresWithSelectInterface = [
  FEATURE_TYPE_SELECT,
  FEATURE_TYPE_BRAND,
  FEATURE_TYPE_NUMBER_SLIDER
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.$containerPadding,
    backgroundColor: theme.$screenBackgroundColor
  },
  featureWrapper: {
    borderBottomWidth: 1,
    borderColor: theme.$mediumGrayColor,
    paddingVertical: 14
  },
  checkboxWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  scrollContainer: {
    paddingBottom: 40
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowDescriptionWrapper: {
    width: '40%'
  },
  rowVariantWrapper: {
    alignItems: 'flex-end',
    textAlign: 'right'
  },
  text: {
    fontSize: 13,
    color: theme.$darkColor,
    textAlign: 'left'
  },
  input: {
    fontSize: 13,
    color: theme.$darkColor,
    padding: 0,
    textAlignVertical: 'top',
    textAlign: 'right'
  },
  noFeaturesMessageWrapper: {
    padding: theme.$containerPadding
  },
  noFeaturesMessageText: {
    textAlign: 'center',
    fontSize: 13,
    color: theme.$mediumGrayColor
  }
})

interface Feature {
  description: string
  feature_id: number
  feature_type: string
  value: string
  variant: string
  variant_id: number
  value_int: number
  variants: {
    variant: string
    variant_id: number
    selected: boolean
  }[]
}

interface FeatureForSend {
  feature_id: number
  value: string | number
  value_int?: number
  variants: {
    variant: string
    variant_id: number
    selected?: boolean
  }[]
}

interface ProductFeatures {
  [key: string]: Feature
}

interface FeaturesProps {
  route: {
    params: {
      productID: string
    }
  }
  productsActions: {
    [key: string]: Function
  }
  productFeatures: ProductFeatures
}

export const Features: React.FC<FeaturesProps> = ({
  productsActions,
  route,
  settings,
  productFeatures,
  navigation
}) => {
  const { productID } = route.params
  const inputsRef = useRef<Array<TextInput | null>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getProductFeatures = async () => {
      await productsActions.fetchProductFeatures(productID)
      setIsLoading(false)
    }
    getProductFeatures()
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {})
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {})

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [productID, productsActions])

  const renderCheckbox = (feature: Feature) => {
    const { value, description } = feature
    const switcherValue = value === 'Y'

    return (
      <View
        style={{ ...styles.checkboxWrapper, ...styles.featureWrapper }}
        key={uuidv4()}>
        <View style={styles.rowDescriptionWrapper}>
          <Text style={styles.text}>{description}: </Text>
        </View>
        <Switch
          value={switcherValue}
          onValueChange={() =>
            changeCheckboxValueHandler(feature, switcherValue)
          }
        />
      </View>
    )
  }

  const renderSelect = (feature: Feature) => {
    const { variant, description } = feature

    let pickerValues: string[] = []
    if (feature.variants) {
      pickerValues = feature.variants.map(variant => variant.variant)
    }

    return (
      <TouchableOpacity
        key={uuidv4()}
        style={styles.featureWrapper}
        onPress={() =>
          navigation.navigate('ScrollPicker', {
            pickerValues: pickerValues,
            changePickerValueHandler: (
              selectedFeatureVariant: string,
              feature: { [key: string]: any }
            ) => changeSelectValueHandler(selectedFeatureVariant, feature),
            selectValue: variant,
            title: i18n.t('Select Feature'),
            additionalData: feature
          })
        }>
        <View style={styles.row}>
          <View style={styles.rowDescriptionWrapper}>
            <Text style={styles.text}>{description}</Text>
          </View>
          <View style={styles.rowVariantWrapper}>
            <Text style={styles.text}>{variant}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderTextInput = (feature: Feature) => {
    const { description, value } = feature

    return (
      <TouchableOpacity
        key={feature.feature_id}
        style={styles.featureWrapper}
        onPress={() => {
          inputsRef.current[feature.feature_id].focus()
        }}>
        <View style={styles.row}>
          <View style={styles.rowDescriptionWrapper}>
            <Text style={styles.text}>{description}</Text>
          </View>
          <View style={styles.rowVariantWrapper}>
            <TextInput
              ref={el => (inputsRef.current[feature.feature_id] = el)}
              onSubmitEditing={Keyboard.dismiss}
              style={styles.input}
              placeholder={i18n.t('Click here…')}
              value={value}
              onChangeText={newValue =>
                changeTextInputHandler(newValue, feature)
              }
            />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const changeTextInputHandler = (newValue: string, feature: Feature) => {
    const featureCopy = JSON.parse(JSON.stringify(feature))
    const productFeaturesCopy = JSON.parse(JSON.stringify(productFeatures))

    featureCopy.value = newValue
    productFeaturesCopy[featureCopy.feature_id] = featureCopy
    productsActions.updateLocalProductFeatures(productFeaturesCopy)
  }

  const renderDate = (feature: Feature) => {
    const { description, value_int } = feature
    const date = format(value_int * 1000, settings.dateFormat)

    return (
      <TouchableOpacity
        key={uuidv4()}
        style={styles.featureWrapper}
        onPress={() =>
          navigation.navigate('DatePickerScreen', {
            feature,
            changeDateHandler
          })
        }>
        <View style={styles.row}>
          <View style={styles.rowDescriptionWrapper}>
            <Text style={styles.text}>{description}</Text>
          </View>
          <View style={styles.rowVariantWrapper}>
            <Text style={styles.text}>{date}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderMultipleCheckbox = (feature: Feature) => {
    const { description, variants } = feature

    return (
      <TouchableOpacity
        key={uuidv4()}
        style={styles.featureWrapper}
        onPress={() =>
          navigation.navigate('MultipleCheckboxPicker', {
            featureId: feature.feature_id,
            changeMultipleCheckboxValueHandler
          })
        }>
        <View style={styles.row}>
          <View style={styles.rowDescriptionWrapper}>
            <Text style={styles.text}>{description}</Text>
          </View>
          <View style={styles.rowVariantWrapper}>
            {variants.map((variant, index) => {
              if (variant.selected) {
                return (
                  <Text style={styles.text} key={index}>
                    {variant.variant}
                  </Text>
                )
              }
            })}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const changeDateHandler = (feature: Feature, date: Date) => {
    if (!productFeatures) {
      return
    }

    const productFeaturesCopy = JSON.parse(JSON.stringify(productFeatures))

    productFeaturesCopy[feature.feature_id].value_int = date.getTime() / 1000
    productsActions.updateLocalProductFeatures(productFeaturesCopy)
  }

  const changeSelectValueHandler = (
    selectedFeatureVariant: string,
    feature: { [key: string]: any }
  ) => {
    const { feature_id } = feature
    let selectedFeatureVariantId

    for (let i = 0; i < feature.variants.length; i++) {
      if (feature.variants[i].variant === selectedFeatureVariant) {
        selectedFeatureVariantId = feature.variants[i].variant_id
      }
    }

    if (!productFeatures) {
      return
    }

    const productFeaturesCopy = JSON.parse(JSON.stringify(productFeatures))

    productFeaturesCopy[feature_id].variant_id = selectedFeatureVariantId
    productFeaturesCopy[feature_id].variant = selectedFeatureVariant

    productsActions.updateLocalProductFeatures(productFeaturesCopy)
  }

  const changeCheckboxValueHandler = (
    feature: Feature,
    switcherValue: boolean
  ) => {
    const { feature_id } = feature

    if (!productFeatures) {
      return
    }

    const productFeaturesCopy = JSON.parse(JSON.stringify(productFeatures))

    productFeaturesCopy[feature_id].value = switcherValue ? 'N' : 'Y'
    productsActions.updateLocalProductFeatures(productFeaturesCopy)
  }

  const changeMultipleCheckboxValueHandler = (
    featureId: number,
    feature: Feature
  ) => {
    if (!productFeatures) {
      return
    }

    const productFeaturesCopy = JSON.parse(JSON.stringify(productFeatures))

    productFeaturesCopy[featureId] = JSON.parse(JSON.stringify(feature))
    productsActions.updateLocalProductFeatures(productFeaturesCopy)
  }

  const saveHandler = async () => {
    if (!productFeatures) {
      return
    }

    const productFeaturesCopy = JSON.parse(JSON.stringify(productFeatures))

    const sentProductFeatures: { [key: number]: FeatureForSend } = {}
    const productFeaturesKeys = Object.keys(productFeaturesCopy)

    for (let i = 0; i < productFeaturesKeys.length; i++) {
      const feature: FeatureForSend = {
        feature_id: 0,
        value: '',
        variants: []
      }
      feature.feature_id =
        productFeaturesCopy[productFeaturesKeys[i]].feature_id
      feature.value = productFeaturesCopy[productFeaturesKeys[i]].value

      if (productFeaturesCopy[productFeaturesKeys[i]].value_int) {
        feature.value = productFeaturesCopy[productFeaturesKeys[i]].value_int
      }

      if (
        productFeaturesCopy[productFeaturesKeys[i]].variants.length &&
        featuresWithSelectInterface.includes(
          productFeaturesCopy[productFeaturesKeys[i]].feature_type
        )
      ) {
        feature.variants = productFeaturesCopy[
          productFeaturesKeys[i]
        ].variants.map(variant => {
          variant.selected =
            variant.variant_id ===
            productFeaturesCopy[productFeaturesKeys[i]].variant_id
          return variant
        })
      }

      if (
        productFeaturesCopy[productFeaturesKeys[i]].variants.length &&
        productFeaturesCopy[productFeaturesKeys[i]].feature_type ===
          FEATURE_TYPE_CHECKBOX_MULTIPLE
      ) {
        feature.variants = productFeaturesCopy[productFeaturesKeys[i]].variants
      }

      sentProductFeatures[
        productFeaturesCopy[productFeaturesKeys[i]].feature_id
      ] = JSON.parse(JSON.stringify(feature))
    }

    await productsActions.updateProductFeatures(productID, sentProductFeatures)
    navigation.pop()
  }

  const renderNoFeaturesMessage = () => {
    return (
      <View style={styles.noFeaturesMessageWrapper}>
        <Text style={styles.noFeaturesMessageText}>
          {i18n.t('There are no features.')}
        </Text>
      </View>
    )
  }

  const renderFeatureItem = (feature: Feature) => {
    const { feature_type } = feature

    let renderElement = null

    switch (feature_type) {
      case FEATURE_TYPE_DATE:
        renderElement = () => renderDate(feature)
        break
      case FEATURE_TYPE_CHECKBOX:
        renderElement = () => renderCheckbox(feature)
        break
      case FEATURE_TYPE_SELECT:
      case FEATURE_TYPE_NUMBER_SLIDER:
      case FEATURE_TYPE_BRAND:
        renderElement = () => renderSelect(feature)
        break
      case FEATURE_TYPE_CHECKBOX_MULTIPLE:
        renderElement = () => renderMultipleCheckbox(feature)
        break
      case FEATURE_TYPE_TEXT:
        renderElement = () => renderTextInput(feature)
        break
      default:
        return
    }

    return renderElement()
  }

  if (!productFeatures) {
    return null
  }

  if (isLoading) {
    return <Spinner visible />
  }

  const features = Object.keys(productFeatures).map(
    (k: string) => productFeatures[k]
  )

  if (!features.length) {
    return renderNoFeaturesMessage()
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView enableResetScrollToCoords={false} contentContainerStyle={styles.scrollContainer}>
        {features.map(item => renderFeatureItem(item))}
      </KeyboardAwareScrollView>
      <BottomActions onBtnPress={saveHandler} btnText={i18n.t('Save')} />
    </View>
  )
}

export default connect(
  state => ({
    product: state.vendorManageProducts.current,
    settings: state.settings,
    productFeatures: state.vendorManageProducts.productFeatures
  }),
  dispatch => ({
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(Features)
