import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, RefreshControl, StyleSheet, Platform } from 'react-native'
import theme from '../config/theme'
import { v4 as uuidv4 } from 'uuid'
import { pushNotificationsInit } from '../services/pushNotifications'

// Utils
import get from 'lodash/get'
import { toArray } from '../utils'
import { registerDrawerDeepLinks } from '../services/deepLinks'

// Constants
import {
  BLOCK_BANNERS,
  BLOCK_CATEGORIES,
  BLOCK_PRODUCTS,
  BLOCK_PAGES,
  BLOCK_VENDORS
} from '../constants'

// Actions
import * as layoutsActions from '../redux/actions/layoutsActions'

// Components
import Spinner from '../components/Spinner'
import BannerBlock from '../components/BannerBlock'
import VendorBlock from '../components/VendorBlock'
import PageBlock from '../components/PageBlock'
import ProductBlock from '../components/ProductBlock'
import CategoryBlock from '../components/CategoryBlock'
import NotificationControllerAndroid from '../services/NotificationController.android'
import NotificationControllerIos from '../services/NotificationController.ios'

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  }
})

export const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const layouts = useSelector(state => state.layouts)

  useEffect(() => {
    const getData = async () => {
      await dispatch(layoutsActions.fetch())
      setIsLoading(false)
    }

    getData()
    pushNotificationsInit()
  }, [dispatch])

  if (Platform.OS === 'android') {
    NotificationControllerAndroid()
  } else {
    NotificationControllerIos()
  }

  const renderBlock = block => {
    if (!get(block, 'content.items')) {
      return null
    }

    const items = toArray(block.content.items)

    switch (block.type) {
      case BLOCK_BANNERS:
        return (
          <BannerBlock
            name={block.name}
            wrapper={block.wrapper}
            items={items}
            onPress={banner => {
              registerDrawerDeepLinks(
                {
                  link: banner.url,
                  payload: {
                    ...banner,
                    title: banner.banner
                  }
                },
                navigation
              )
            }}
            key={uuidv4()}
          />
        )

      case BLOCK_PRODUCTS:
        return (
          <ProductBlock
            name={block.name}
            wrapper={block.wrapper}
            items={items}
            onPress={product =>
              navigation.navigate('ProductDetail', {
                pid: product.product_id
              })
            }
            key={uuidv4()}
          />
        )

      case BLOCK_CATEGORIES:
        return (
          <CategoryBlock
            name={block.name}
            appearance={block.properties.category_appearance}
            wrapper={block.wrapper}
            items={items}
            onPress={category =>
              navigation.navigate('Categories', { category })
            }
            key={uuidv4()}
          />
        )

      case BLOCK_PAGES:
        return (
          <PageBlock
            name={block.name}
            wrapper={block.wrapper}
            items={items}
            onPress={page => {
              registerDrawerDeepLinks(
                {
                  link: `dispatch=pages.view&page_id=${page.page_id}`,
                  payload: {
                    title: page.page
                  }
                },
                navigation
              )
            }}
            key={uuidv4()}
          />
        )

      case BLOCK_VENDORS:
        return (
          <VendorBlock
            name={block.name}
            wrapper={block.wrapper}
            items={items}
            onPress={vendor =>
              navigation.navigate('Vendor', {
                companyId: vendor.company_id,
                vendorName: vendor.company
              })
            }
            key={uuidv4()}
          />
        )

      default:
        return null
    }
  }

  const onRefresh = async () => {
    setIsLoading(true)
    await dispatch(layoutsActions.fetch(undefined, true))
    setIsLoading(false)
  }

  if (isLoading) {
    return <Spinner visible />
  }

  const blocksList = layouts.blocks.map(block => renderBlock(block))

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={onRefresh} />
      }>
      {blocksList}
    </ScrollView>
  )
}
