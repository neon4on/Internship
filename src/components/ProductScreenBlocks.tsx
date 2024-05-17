import React from 'react'
import { v4 as uuidv4 } from 'uuid'

// Utils
import get from 'lodash/get'
import { toArray } from '../utils'

// Constants
import { BLOCK_PRODUCTS } from '../constants'

// Components
import ProductBlock from '../components/ProductBlock'

export const ProductScreenBlocks = ({
  productScreenBlocks,
  navigation,
  containerPadding
}) => {
  const renderBlock = block => {
    const items = toArray(get(block, 'content.items'))
    if (!items.length) {
      return null
    }

    switch (block.type) {
      case BLOCK_PRODUCTS:
        return (
          <ProductBlock
            name={block.name}
            wrapper={block.wrapper}
            items={items}
            onPress={product =>
              navigation.push('ProductDetail', {
                pid: product.product_id
              })
            }
            key={uuidv4()}
            containerPadding={containerPadding}
          />
        )

      default:
        return null
    }
  }

  if (!productScreenBlocks) {
    return null
  }

  const blocksList = Object.keys(productScreenBlocks).map(blockId =>
    renderBlock(productScreenBlocks[blockId])
  )

  return <>{blocksList}</>
}
