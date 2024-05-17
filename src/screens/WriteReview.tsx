import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  DISCUSSION_COMMUNICATION,
  DISCUSSION_RATING,
  FIELD_TEMPLATE
} from '../constants'
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet
} from 'react-native'
import theme from '../config/theme'
import store from '../store'
import * as yup from 'yup'
import { Formik, Field } from 'formik'
import { Button } from 'react-native-paper'

// Utils
import cloneDeep from 'lodash/cloneDeep'
import i18n from '../utils/i18n'

// Constants
import { FIELD_CHECKBOX, FIELD_INPUT } from '../constants'

// Actions
import * as productsActions from '../redux/actions/productsActions'

// Components
import Spinner from '../components/Spinner'
import Icon from '../components/Icon'
import FormField from '../components/FormField'
import { AgreementUGC } from '../components/AgreementUGC'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.$screenBackgroundColor,
    padding: 14
  },
  sendReviewButton: {
    marginTop: 20
  }
})

function selectRatingTemplate(rating) {
  const containerStyle = {
    marginTop: 15,
    marginBottom: 20
  }
  const wrapperStyle = {
    flexDirection: 'row',
    height: 30
  }
  const errorTextStyle = {
    color: '#a94442',
    fontSize: 16
  }
  const checkIcon = {
    color: theme.$ratingStarsColor
  }

  const stars = []
  const currentRating = Math.round(rating.value || 0)

  for (let i = 1; i <= currentRating; i += 1) {
    stars.push(
      <TouchableOpacity
        key={`star_${i}`}
        onPress={() => rating.handleChange(i, rating.name)}>
        <Icon name="star" style={checkIcon} />
      </TouchableOpacity>
    )
  }

  for (let r = stars.length; r <= 4; r += 1) {
    stars.push(
      <TouchableOpacity
        key={`star_border_${r}`}
        onPress={() => rating.handleChange(r + 1, rating.name)}>
        <Icon name="star-border" style={checkIcon} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={containerStyle}>
      <View style={wrapperStyle}>{stars}</View>
      {rating.hasError && (
        <Text style={errorTextStyle}>
          {i18n.t('The rating field is mandatory.')}
        </Text>
      )}
    </View>
  )
}

export class WriteReview extends Component {
  constructor(props) {
    super(props)
    this.isNewPostSent = false

    this.state = {
      agreementUser: false,
      agreementError: false
    }
  }

  UNSAFE_componentWillReceiveProps() {
    const { navigation } = this.props

    if (this.isNewPostSent) {
      // this.isNewPostSent = false;
      navigation.pop()
    }
  }

  handleSend(value) {
    const { productsActions, route } = this.props
    const { activeDiscussion, discussionType, discussionId } = route.params

    if (!this.state.agreementUser) {
      this.setState({ agreementError: true })

      return
    }

    if (value) {
      this.isNewPostSent = true
      productsActions.postDiscussion({
        thread_id: activeDiscussion.thread_id,
        name: value.name,
        rating_value: value.rating,
        message: value.message,
        discussionType,
        discussionId
      })
    }
  }

  render() {
    const { discussion, route, navigation } = this.props
    const { activeDiscussion } = route.params

    let formFields = {}
    switch (activeDiscussion.type) {
      case DISCUSSION_COMMUNICATION:
        formFields = {
          name: {
            name: 'name',
            label: i18n.t('Your name'),
            clearButtonMode: 'while-editing',
            fieldType: FIELD_INPUT
          },
          message: {
            name: 'message',
            numberOfLines: 4,
            multiline: true,
            label: i18n.t('Your message'),
            clearButtonMode: 'while-editing',
            fieldType: FIELD_INPUT
          }
        }
        break

      case DISCUSSION_RATING:
        formFields = {
          name: {
            name: 'name',
            label: i18n.t('Your name'),
            clearButtonMode: 'while-editing',
            fieldType: FIELD_INPUT
          },
          rating: {
            name: 'rating',
            template: selectRatingTemplate,
            fieldType: FIELD_TEMPLATE
          }
        }
        break

      default:
        formFields = {
          name: {
            name: 'name',
            label: i18n.t('Your name'),
            clearButtonMode: 'while-editing',
            fieldType: FIELD_INPUT
          },
          rating: {
            name: 'rating',
            template: selectRatingTemplate,
            fieldType: FIELD_TEMPLATE
          },
          message: {
            name: 'message',
            numberOfLines: 4,
            multiline: true,
            label: i18n.t('Your message'),
            clearButtonMode: 'while-editing',
            fieldType: FIELD_INPUT
          }
        }
        break
    }

    const validationSchema = yup.object({
      name: yup.string().required(
        i18n.t('The {{field}} field is required', {
          field: i18n.t('Your name'),
          interpolation: { escapeValue: false }
        })
      ),
      rating: yup.number().oneOf([1, 2, 3, 4, 5]).default(1),
      message:
        activeDiscussion.type === DISCUSSION_RATING
          ? yup.string()
          : yup.string().required(
              i18n.t('The {{field}} field is required', {
                field: i18n.t('Your message'),
                interpolation: { escapeValue: false }
              })
            )
    })

    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{ name: '', rating: 1, message: '' }}
          onSubmit={values => this.handleSend(values)}>
          {({ handleSubmit }) => (
            <>
              {Object.keys(formFields).map((key, index) => (
                // We use index bacause Formik doesn't understand uuidv4
                <View key={index} style={styles.inputContainer}>
                  <Field
                    component={FormField}
                    name={formFields[key].name}
                    label={formFields[key].label}
                    fieldType={formFields[key].fieldType}
                    {...formFields[key]}
                  />
                </View>
              ))}

              <AgreementUGC
                navigation={navigation}
                onPress={() => {
                  this.setState({
                    agreementUser: !this.state.agreementUser,
                    agreementError: false
                  })
                }}
                agreementError={this.state.agreementError}
                agreementUser={this.state.agreementUser}
              />

              <Button
                type="primary"
                onPress={handleSubmit}
                mode="contained"
                style={styles.sendReviewButton}>
                {i18n.t('Send review').toUpperCase()}
              </Button>
            </>
          )}
        </Formik>
        <Spinner visible={discussion.fetching} mode="modal" />
      </ScrollView>
    )
  }
}

export default connect(
  state => ({
    discussion: state.discussion,
    productDetail: state.productDetail
  }),
  dispatch => ({
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(WriteReview)
