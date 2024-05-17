import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native'
import Api from '../services/api'
import theme from '../config/theme'

// Components
import Spinner from '../components/Spinner'
import FormBlock from '../components/FormBlock'
import FormBlockField from '../components/FormBlockField'

// Utils
import i18n from '../utils/i18n'
import { formatPrice, getImagePath } from '../utils'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  contentContainer: {
    padding: 14
  },
  mainHeader: {
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 5,
    color: theme.$darkColor
  },
  subHeader: {
    fontSize: 13,
    color: '#7C7C7C',
    marginBottom: 24
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.$darkColor
  },
  date: {
    fontSize: 11,
    color: '#7C7C7C'
  },
  flexWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  productsWrapper: {
    marginTop: 30
  },
  productItem: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#F1F1F1',
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden'
  },
  productItemImage: {
    flex: 1,
    height: 100
  },
  productItemDetail: {
    flex: 3
  },
  productItemName: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
    fontWeight: 'bold'
  },
  productItemPrice: {
    fontSize: 11,
    color: 'black'
  }
})

export const CheckoutComplete = ({ route }) => {
  const auth = useSelector(state => state.auth)
  const cart = useSelector(state => state.cart)
  const { orderId } = route.params

  const [isLoading, setIsLoading] = useState(true)
  const [orderDetail, setOrderDetail] = useState(null)
  const [fields, setFields] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      const ordersResponse = await Api.get(`/sra_orders/${orderId}`)

      setOrderDetail(ordersResponse.data)

      const params = {
        location: 'checkout',
        action: 'update'
      }

      const profileResponse = await Api.get('/sra_profile', { params })

      const { fields } = profileResponse.data

      delete fields.E
      setFields(fields)
      setIsLoading(false)
    }

    try {
      fetchData()
    } catch (error) {
      console.log('ERROR get order: ', error)
      setIsLoading(false)
    }
  }, [])

  const renderProduct = (item, index) => {
    let productImage = null
    const imageUri = getImagePath(item)

    if (imageUri) {
      productImage = (
        <Image source={{ uri: imageUri }} style={styles.productItemImage} />
      )
    }

    return (
      <View style={styles.productItem} key={index}>
        {productImage}
        <View style={styles.productItemDetail}>
          <Text style={styles.productItemName} numberOfLines={1}>
            {item.product}
          </Text>
          <Text style={styles.productItemPrice}>
            {`${item.amount} x ${formatPrice(item.price_formatted.price)}`}
          </Text>
        </View>
      </View>
    )
  }

  const renderFields = () => {
    return Object.entries(fields).map(([key, section]) => {
      const country = { code: null, name: null }
      const state = { name: null }

      // Search for country (if exist)
      section.fields.forEach(field => {
        if (field.field_type === 'O') {
          country.code = field.value
          country.name = field.values[orderDetail[field.field_id]]
        }
      })

      // Search for state (if exist)
      if (country.code) {
        section.fields.forEach(field => {
          if (field.field_type === 'A' && field.values[country.code]) {
            state.name = field.values[country.code][orderDetail[field.field_id]]
          }
        })
      }

      return (
        <FormBlock
          key={key}
          title={section.description}
          style={styles.formBlockWraper}>
          <View>
            {section.fields.map(field => {
              if (orderDetail[field.field_id]) {
                return (
                  <FormBlockField
                    title={`${field.description}:`}
                    key={field.field_id}>
                    {field.field_type === 'O' && country.name
                      ? country.name
                      : field.field_type === 'A' && state.name
                      ? state.name
                      : orderDetail[field.field_id]}
                  </FormBlockField>
                )
              }

              return null
            })}
          </View>
        </FormBlock>
      )
    })
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Spinner visible />
      </View>
    )
  }

  const productsList = orderDetail.product_groups.map(group => {
    const products = Object.keys(group.products).map(k => group.products[k])
    return products.map((p, i) => renderProduct(p, i))
  })

  const date = new Date(orderDetail.timestamp * 1000)

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.mainHeader}>{i18n.t('Congratulations!')}</Text>
        <Text style={styles.subHeader}>
          {i18n.t('Your order has been successfully placed.')}
        </Text>
        <FormBlock>
          <View style={styles.flexWrap}>
            <Text style={styles.header}>
              {i18n.t('order').toUpperCase()} #{orderDetail.order_id}
            </Text>
            <Text style={styles.date}>
              {`${
                date.getMonth() + 1
              }/${date.getDate()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`}
            </Text>
          </View>

          <Text style={styles.header}>
            {i18n.t('Products information').toUpperCase()}
          </Text>
          <View style={styles.productsWrapper}>{productsList}</View>
        </FormBlock>
        {renderFields()}
      </ScrollView>
    </View>
  )
}
