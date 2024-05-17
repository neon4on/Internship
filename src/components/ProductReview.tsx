import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

// Utils
import { format } from 'date-fns'
import { capitalizeFirstLetter } from '../utils/index'
import { v4 as uuidv4 } from 'uuid'

// Actions
import * as productsActions from '../redux/actions/productsActions'

// Components
import StarsRating from './StarsRating'
import Icon from './Icon'
import i18n from '../utils/i18n'

import {
  REPORT_TYPE_REVIEW,
  REPORT_TYPE_USER,
  PRODUCT_REVIEWS_MESSAGE_TYPES_COMMENT
} from '../constants'
import theme from '../config/theme'

const RATING_STAR_SIZE = 14

const styles = StyleSheet.create({
  reviewContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#d9d9d9'
  },
  reviewContainerNoBorder: {
    borderBottomWidth: 0,
    marginBottom: 0
  },
  reviewNameStarsDateWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  reviewNameStarsWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  reviewName: {
    fontSize: 14,
    marginRight: 5
  },
  reviewDate: {
    color: '#8F8F8F'
  },
  reviewCountry: {
    color: '#8F8F8F'
  },
  reviewCommentTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '300'
  },
  reviewCommentText: {
    fontSize: 14,
    marginBottom: 20,
    color: '#8F8F8F'
  },
  reviewLikesWrapper: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    marginLeft: 'auto',
    marginRight: 5
  },
  voteUpWrapper: {
    flexDirection: 'row',
    fontSize: 14,
    alignItems: 'center',
    marginRight: 20
  },
  voteDownWrapper: {
    flexDirection: 'row',
    fontSize: 14,
    alignItems: 'center'
  },
  likeDislikeIcons: {
    fontSize: 25,
    color: '#d4d4d4',
    marginRight: 5
  },
  votesCountText: {
    color: '#8F8F8F'
  },
  reportIconContainer: {
    width: '100%',
    marginBottom: 10
  },
  reportIconContainerLast: {
    marginBottom: 40
  },
  menuItemIcon: {
    fontSize: 24,
    color: theme.$buttonWithoutBackgroundTextColor,
    textAlign: 'right'
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

interface ProductReviewsProps {
  review: Review
  productId: number
  productsActions: {
    [key: string]: Function
  }
  settings: {
    dateFormat: string
    productReviewsAddon: {
      isEnabled: boolean
      isCommentOnly: boolean
    }
  }
}

export const ProductReview: React.FC<ProductReviewsProps> = ({
  review,
  productId,
  productsActions,
  settings,
  isLast,
  navigation
}) => {
  const reviewDate = format(
    new Date(review.product_review_timestamp * 1000),
    settings.dateFormat || 'MM/dd/yyyy'
  )

  const likeDislikeHandler = async (value: string, productReviewId: number) => {
    await productsActions.likeDislikeReview({
      action: value,
      product_review_id: productReviewId,
      productId: productId
    })
  }

  const reportTypes = [
    {
      value: REPORT_TYPE_REVIEW,
      title: i18n.t('Report review')
    },
    {
      value: REPORT_TYPE_USER,
      title: i18n.t('Report user')
    }
  ]

  const pickerValues = reportTypes.map(variant => variant.title)

  const changePickerValueHandler = value => {
    const selectedVariant = reportTypes.find(
      variant => variant.title.toLowerCase() === value.toLowerCase()
    )

    return {
      report_object_id:
        selectedVariant?.value === REPORT_TYPE_REVIEW
          ? review.product_review_id
          : review.user_data.user_id,
      report_type: selectedVariant?.value
    }
  }

  return (
    <View
      style={[
        styles.reviewContainer,
        isLast && styles.reviewContainerNoBorder
      ]}>
      <View style={styles.reviewNameStarsDateWrapper}>
        <View style={styles.reviewNameStarsWrapper}>
          <Text style={styles.reviewName}>
            {review.user_data?.name || i18n.t('Anonymous')}
          </Text>
          <StarsRating
            size={RATING_STAR_SIZE}
            isRatingSelectionDisabled
            value={Number(review.rating_value)}
          />
        </View>
        <Text style={styles.reviewDate}>{reviewDate}</Text>
      </View>
      <Text style={styles.reviewCountry}>{review.country}</Text>
      {Object.keys(review.message).map((el: string, index: number) => {
        if (!review.message[el]) {
          return null
        }

        return (
          <View key={uuidv4()}>
            {!settings.productReviewsAddon?.isCommentOnly && (
              <Text style={styles.reviewCommentTitle}>
                {i18n.t(capitalizeFirstLetter(el))}
              </Text>
            )}
            {(!settings.productReviewsAddon?.isCommentOnly ||
              (settings.productReviewsAddon?.isCommentOnly &&
                el === PRODUCT_REVIEWS_MESSAGE_TYPES_COMMENT)) && (
              <Text style={styles.reviewCommentText}>{review.message[el]}</Text>
            )}
          </View>
        )
      })}
      <TouchableOpacity
        style={[
          styles.reportIconContainer,
          isLast && styles.reportIconContainerLast
        ]}
        onPress={() => {
          navigation.push('ScrollPicker', {
            pickerValues: pickerValues,
            changePickerValueHandler,
            selectValue: '',
            title: i18n.t('Write a Report'),
            nextScreen: 'WriteReport'
          })
        }}>
        <Icon name="report-problem" style={styles.menuItemIcon} />
      </TouchableOpacity>
      {review.reply.reply ? (
        <>
          <View style={styles.divider} />
          <View style={styles.adminReplyContainer}>
            <Text style={styles.reviewCommentTitle}>
              {review.reply.reply_company
                ? i18n.t('Vendor reply')
                : i18n.t('Administrator reply')}
            </Text>
            <Text style={styles.reviewCommentText}>{review.reply.reply}</Text>
          </View>
        </>
      ) : (
        <></>
      )}
      {false && ( // TODO likes/dislikes for product reviews
        <View style={styles.reviewLikesWrapper}>
          <TouchableOpacity
            style={styles.voteUpWrapper}
            onPress={() => likeDislikeHandler('up', review.product_review_id)}>
            <Icon name={'thumb-up'} style={styles.likeDislikeIcons} />
            <Text style={styles.votesCountText}>
              {review.helpfulness.vote_up}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.voteDownWrapper}
            onPress={() =>
              likeDislikeHandler('down', review.product_review_id)
            }>
            <Icon name={'thumb-down'} style={styles.likeDislikeIcons} />
            <Text style={styles.votesCountText}>
              {review.helpfulness.vote_down}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default connect(
  state => ({
    settings: state.settings
  }),
  dispatch => ({
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(ProductReview)
