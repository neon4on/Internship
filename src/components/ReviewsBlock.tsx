import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import i18n from '../utils/i18n'
import theme from '../config/theme'
import { v4 as uuidv4 } from 'uuid'

// Components
import StarsRating from './StarsRating'
import ProductReview from './ProductReview'

const RATING_STAR_SIZE = 25

const styles = (
  filledRatingPercentage: number | null,
  unfilledRatingPercentage: number | null
) =>
  StyleSheet.create({
    starsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
      marginBottom: 20
    },
    starsRatingContainerStyle: {
      marginRight: 10
    },
    averageRatingText: {
      fontSize: 25,
      marginRight: 10
    },
    reviewCountText: {
      color: '#8F8F8F',
      fontSize: 14
    },
    ratingBarListWrapper: {
      marginBottom: 30
    },
    ratingBarContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 7
    },
    ratingBarWrapper: {
      flexDirection: 'row',
      width: '50%',
      height: 22
    },
    ratingNumberText: {
      marginRight: 10,
      fontSize: 16,
      width: 15
    },
    filedPartRatingBar: {
      backgroundColor: '#FFC107',
      height: '100%',
      width: `${filledRatingPercentage}%`
    },
    unfiledPartRatingBar: {
      backgroundColor: '#ECECEC',
      height: '100%',
      width: `${unfilledRatingPercentage}%`
    },
    ratingPercentageText: {
      marginLeft: 10,
      fontSize: 16
    },
    showAllReviewsButton: {
      marginTop: 10
    },
    showAllReviewsText: {
      color: theme.$buttonWithoutBackgroundTextColor,
      fontSize: 14
    },
    noReviewText: {
      color: '#8F8F8F'
    }
  })

interface ProductReviewsRatingStats {
  ratings: {
    [key: number]: {
      count: number
      percentage: number
    }
  }
}

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

interface ReviewsBlockProps {
  productReviews: ProductReviews
  componentId: string
  productId: number
  fetchData: Function
}

export const ReviewsBlock: React.FC<ReviewsBlockProps> = ({
  productReviews,
  productId,
  fetchData,
  navigation
}) => {
  const [currentProductReviews, setCurrentProductReviews] =
    useState<ProductReview>({
      reviews: {},
      count: 0,
      ratingStats: { ratings: {} },
      averageRating: '0'
    })

  useEffect(() => {
    setCurrentProductReviews(productReviews[productId])
  }, [productReviews, productId])

  const renderStars = () => {
    return (
      <View style={styles(null, null).starsContainer}>
        <StarsRating
          size={RATING_STAR_SIZE}
          value={Number(currentProductReviews.averageRating)}
          isRatingSelectionDisabled
          containerStyle={styles(null, null).starsRatingContainerStyle}
        />
        <Text style={styles(null, null).averageRatingText}>
          {Number(currentProductReviews.averageRating).toFixed(1)}
        </Text>
        <Text style={styles(null, null).reviewCountText}>
          {currentProductReviews.count ? currentProductReviews.count : 0}{' '}
          {i18n.t('reviews')}
        </Text>
      </View>
    )
  }

  const renderRatingBar = (percentage: number, ratingNumber: string) => {
    return (
      <View style={styles(null, null).ratingBarContainer} key={uuidv4()}>
        <Text style={styles(null, null).ratingNumberText}>{ratingNumber}</Text>
        <View style={styles(null, null).ratingBarWrapper}>
          <View style={styles(percentage, null).filedPartRatingBar} />
          <View style={styles(null, 100 - percentage).unfiledPartRatingBar} />
        </View>
        <Text style={styles(null, null).ratingPercentageText}>
          {percentage}%
        </Text>
      </View>
    )
  }

  const renderRatingBarList = () => {
    if (!currentProductReviews.ratingStats) {
      return null
    }

    const ratingStatsNumbers: string[] = Object.keys(
      currentProductReviews.ratingStats.ratings
    )

    return (
      <View style={styles(null, null).ratingBarListWrapper}>
        {ratingStatsNumbers.map(ratingNumber => {
          return renderRatingBar(
            currentProductReviews.ratingStats.ratings[Number(ratingNumber)]
              .percentage,
            ratingNumber
          )
        })}
      </View>
    )
  }

  const renderReviewList = () => {
    if (!currentProductReviews.reviews) {
      return null
    }

    let firstReviews = Object.keys(currentProductReviews.reviews)

    if (firstReviews.length > 2) {
      firstReviews = firstReviews.slice(0, 2)
    }

    return (
      <>
        {firstReviews.map((review: string, index: number) => {
          return (
            <ProductReview
              review={currentProductReviews.reviews[parseInt(review, 10)]}
              productId={productId}
              key={uuidv4()}
              isLast={firstReviews.length === index + 1}
              navigation={navigation}
            />
          )
        })}
        <TouchableOpacity
          style={styles(null, null).showAllReviewsButton}
          onPress={() =>
            navigation.navigate('AllProductReviews', {
              productId: productId,
              fetchData: fetchData,
              productReviews: currentProductReviews
            })
          }>
          <Text style={styles(null, null).showAllReviewsText}>
            {i18n.t('View All')}
          </Text>
        </TouchableOpacity>
      </>
    )
  }

  const renderNoReview = () => {
    return (
      <View>
        <Text style={styles(null, null).noReviewText}>
          {i18n.t('This product has not been reviewed yet.')}
        </Text>
      </View>
    )
  }

  if (!currentProductReviews.count) {
    return renderNoReview()
  }

  return (
    <>
      {renderStars()}
      {renderRatingBarList()}
      {renderReviewList()}
    </>
  )
}

export default connect(state => ({
  productReviews: state.productReviews
}))(ReviewsBlock)
