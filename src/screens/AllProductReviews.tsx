import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import theme from '../config/theme'

// Actions
import * as productsActions from '../redux/actions/productsActions'

// Components
import ProductReview from '../components/ProductReview'

const styles = StyleSheet.create({
  container: {
    padding: theme.$containerPadding
  }
})

interface Review {
  user_data: {
    name: string
  }
  product_review_timestamp: number
  rating_value: string
  country: string
  message: {
    [key: string]: string
  }
  helpfulness: {
    vote_up: number
    vote_down: number
  }
  product_review_id: number
}

interface ProductReviewsRatingStats {
  ratings: {
    [key: number]: {
      count: number
      percentage: number
    }
  }
}

interface ProductReview {
  reviews: {
    [key: number]: Review
  }
  count: number
  ratingStats: ProductReviewsRatingStats
  averageRating: string
}

interface ProductReviews {
  [key: number]: ProductReview
}

interface AllProductReviewsProps {
  productId: string
  productReviews: ProductReviews
  componentId: string
  fetchData: Function
}

export const AllProductReviews: React.FC<AllProductReviewsProps> = ({
  route,
  navigation
}) => {
  const { productId, productReviews, fetchData } = route.params

  return (
    <ScrollView style={styles.container}>
      {Object.keys(productReviews.reviews).map((reviewNumber, index) => {
        return (
          <ProductReview
            review={productReviews.reviews[parseInt(reviewNumber, 10)]}
            productId={parseInt(productId, 10)}
            key={index}
            isLast={Object.keys(productReviews.reviews).length === index + 1}
            navigation={navigation}
          />
        )
      })}
    </ScrollView>
  )
}

export default connect(
  state => ({
    productReviews: state.productReviews
  }),
  dispatch => ({
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(AllProductReviews)
