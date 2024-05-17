import React from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import i18n from '../utils/i18n'
import { formatPrice } from '../utils'
import { v4 as uuidv4 } from 'uuid'

// Components
import Section from '../components/Section'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    textAlign: 'left'
  },
  rowTitle: {
    paddingVertical: 5,
    paddingRight: 10,
    fontWeight: 'bold',
    fontSize: 14
  },
  text: {
    fontSize: 14,
    padding: 5
  }
})

interface Price {
  product_id: string
  lower_limit: string
  percentage_discount: number
  price: string
}

interface QuantityDiscountsProps {
  prices: [Price]
  title: boolean
}

export const QuantityDiscounts: React.FC<QuantityDiscountsProps> = ({
  prices
}) => {
  if (!prices) {
    return null
  }

  return (
    <Section
      title={i18n.t('Our quantity discounts')}
      wrapperStyle={styles.wrapperStyle}
      topDivider>
      <ScrollView horizontal={true}>
        <View style={styles.container}>
          <View>
            <Text style={styles.rowTitle}>{i18n.t('Quantity')}</Text>
            <Text style={styles.rowTitle}>{i18n.t('Price')}</Text>
          </View>
          {prices.map((item: Price) => {
            const { lower_limit, price } = item
            return (
              <View key={uuidv4()}>
                <Text style={styles.text}>{`${lower_limit}+`}</Text>
                <Text style={styles.text}>{formatPrice(price)}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </Section>
  )
}

export default connect(state => ({
  productReviews: state.productReviews
}))(QuantityDiscounts)
