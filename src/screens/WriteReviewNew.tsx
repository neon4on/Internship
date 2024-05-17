import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import i18n from '../utils/i18n'
import theme from '../config/theme'
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet
} from 'react-native'

// Components
import StarsRating from '../components/StarsRating'
import { AgreementUGC } from '../components/AgreementUGC'

// Actions
import * as productsActions from '../redux/actions/productsActions'

const RATING_STAR_SIZE = 25

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.$containerPadding
  },
  ratingWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  ratingAndCommentWrapper: {
    width: '100%'
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#B3B3B3',
    width: '100%',
    fontSize: 18,
    marginTop: 35,
    paddingBottom: 5
  },
  requiredInputDangerColor: {
    borderColor: theme.$dangerColor
  },
  sendReviewWrapper: {
    width: '100%',
    borderWidth: 1,
    height: 100
  },
  sendButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: theme.$buttonBackgroundColor,
    paddingVertical: 10,
    borderRadius: theme.$borderRadius
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 22
  }
})

export const WriteReviewNew = ({
  productsActions,
  settings,
  route,
  navigation
}) => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState({
    advantages: '',
    disadvantages: '',
    comment: ''
  })
  const [requredFiledsNotice, setRequredFiledsNotice] = useState(false)
  const [agreementUser, setAgreementUser] = useState(false)
  const [agreementError, setAgreementError] = useState(false)

  const handleSendReview = async () => {
    const { fetchData, productId } = route.params

    if (!agreementUser) {
      setAgreementError(true)

      return
    }

    if (!comment.comment.length) {
      setRequredFiledsNotice(true)
      productsActions.sendErrorNotification(
        i18n.t('Error'),
        i18n.t('Please fill in the required fields.')
      )
      return
    }

    await productsActions.sendReview({
      product_id: productId.toString(),
      rating_value: rating,
      ...comment
    })
    await fetchData(productId)
    navigation.pop()
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.ratingAndCommentWrapper}>
        <StarsRating
          size={RATING_STAR_SIZE}
          value={rating}
          isRatingSelectionDisabled={false}
          onFinishRating={value => setRating(value)}
          containerStyle={styles.ratingWrapper}
          isEmpty={true}
        />
        {!settings.productReviewsAddon?.isCommentOnly && (
          <>
            <TextInput
              numberOfLines={3}
              multiline
              style={styles.input}
              value={comment.advantages}
              placeholder={i18n.t('Advantages')}
              placeholderTextColor={'#B3B3B3'}
              onChangeText={value => {
                setComment({ ...comment, advantages: value })
              }}
            />
            <TextInput
              numberOfLines={3}
              multiline
              style={styles.input}
              value={comment.input}
              placeholder={i18n.t('Disadvantages')}
              placeholderTextColor={'#B3B3B3'}
              onChangeText={value => {
                setComment({ ...comment, disadvantages: value })
              }}
            />
          </>
        )}
        <TextInput
          numberOfLines={3}
          multiline
          style={{
            ...styles.input,
            ...(requredFiledsNotice && styles.requiredInputDangerColor)
          }}
          value={comment.input}
          placeholder={`${i18n.t('Comment')}*`}
          placeholderTextColor={
            requredFiledsNotice ? theme.$dangerColor : '#B3B3B3'
          }
          onChangeText={value => {
            setRequredFiledsNotice(false)
            setComment({ ...comment, comment: value })
          }}
        />

        <AgreementUGC
          navigation={navigation}
          onPress={() => {
            setAgreementUser(!agreementUser)
            setAgreementError(false)
          }}
          agreementError={agreementError}
          agreementUser={agreementUser}
        />
      </ScrollView>
      {!!rating && (
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => handleSendReview()}>
          <Text style={styles.sendButtonText}>
            {i18n.t('send').toUpperCase()}
          </Text>
        </TouchableOpacity>
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
)(WriteReviewNew)
