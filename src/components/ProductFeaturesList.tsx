import React from 'react'
import { FEATURE_TYPE_DATE, FEATURE_TYPE_CHECKBOX, FEATURE_TYPE_CHECKBOX_MULTIPLE } from '../constants'
import { format } from 'date-fns'
import { connect, useSelector } from 'react-redux'
import i18n from '../utils/i18n'
import { StyleSheet } from 'react-native'
import { v4 as uuidv4 } from 'uuid'

// Components
import Section from './Section'
import SectionRow from './SectionRow'

const styles = StyleSheet.create({
  container: {
    padding: 20
  }
})

interface Feature {
  description: string
  feature_id: number
  feature_type: string
  value: string
  variant: string
  variant_id: string
  value_int: number
}

interface ProductFeaturesListProps {
  productFeatures: {
    [key: string]: Feature
  }
  title: boolean
}

export const ProductFeaturesList: React.FC<ProductFeaturesListProps> = ({
  productFeatures,
  title = true,
  settings
}) => {
  const renderFeatureItem = (feature: Feature) => {
    const { description, feature_type, value_int, value, variant } = feature
    const settings = useSelector((state) => state.settings)

    let newValue = null
    switch (feature_type) {
      case FEATURE_TYPE_DATE:
        newValue = format(value_int * 1000, settings.dateFormat)
        break
      case FEATURE_TYPE_CHECKBOX:
        newValue = feature.value === 'Y' ? i18n.t('Yes') : i18n.t('No')
        break
      case FEATURE_TYPE_CHECKBOX_MULTIPLE:
        newValue = Object.values(feature.variants).map(item => item.variant).join(', ')
        break
      default:
        newValue = value || variant
    }

    return <SectionRow name={description} value={newValue} key={uuidv4()} />
  }

  const features = Object.keys(productFeatures).map(
    (k: string) => productFeatures[k]
  )

  if (!features.length) {
    return null
  }

  return (
    <Section
      title={title ? i18n.t('Features') : ''}
      wrapperStyle={styles.wrapperStyle}
      topDivider>
      {features.map(item => renderFeatureItem(item))}
    </Section>
  )
}

export default connect(state => ({
  settings: state.settings
}))(ProductFeaturesList)
