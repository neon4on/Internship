import React from 'react'
import { connect } from 'react-redux'
import { ScrollView, Text, View, Switch, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    padding: 10
  },
  itemWrapper: {
    marginVertical: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  itemText: {
    fontSize: 16
  }
})

interface FeatureVariant {
  variant: string
  variant_id: number
  selected: boolean
}

interface ProductFeatures {
  [key: string]: Feature
}

interface Feature {
  description: string
  feature_id: number
  feature_type: string
  value: string
  variant: string
  variant_id: number
  value_int: number
  variants: [FeatureVariant]
}

interface MultipleCheckboxPickerProps {
  route: {
    params: {
      featureId: string
      changeMultipleCheckboxValueHandler: Function
    }
  }
  productFeatures: ProductFeatures
}

export const MultipleCheckboxPicker: React.FC<MultipleCheckboxPickerProps> = ({
  route,
  productFeatures
}) => {
  const { featureId, changeMultipleCheckboxValueHandler } = route.params

  const changeHandler = (variantId: number) => {
    if (!productFeatures[featureId]) {
      return
    }

    const productFeaturesCopy = JSON.parse(JSON.stringify(productFeatures))

    productFeaturesCopy[featureId].variants.map(variant => {
      if (variant.variant_id === variantId) {
        variant.selected = !variant.selected
      }
      return variant
    })

    changeMultipleCheckboxValueHandler(
      featureId,
      productFeaturesCopy[featureId]
    )
  }

  const renderItem = (featureVariant: FeatureVariant, index: number) => {
    const { variant, selected, variant_id } = featureVariant

    return (
      <View style={styles.itemWrapper} key={index}>
        <Text style={styles.itemText}>{variant}</Text>
        <Switch
          value={selected}
          onValueChange={() => changeHandler(variant_id)}
        />
      </View>
    )
  }

  if (!productFeatures[featureId]) {
    return <View />
  }

  return (
    <ScrollView style={styles.container}>
      {productFeatures[featureId].variants.map((featureVariant, index) => {
        return renderItem(featureVariant, index)
      })}
    </ScrollView>
  )
}

export default connect(state => ({
  productFeatures: state.vendorManageProducts.productFeatures
}))(MultipleCheckboxPicker)
