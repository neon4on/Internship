import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, SafeAreaView, StyleSheet, Text } from 'react-native'

// utils
import { formatPrice } from '../utils'
import i18n from '../utils/i18n'

// Components
import StepByStepSwitcher from '../components/StepByStepSwitcher'
import Spinner from '../components/Spinner'
import ProfileForm from '../components/ProfileForm'

// Actions
import * as authActions from '../redux/actions/authActions'
import * as cartActions from '../redux/actions/cartActions'
import * as stepsActions from '../redux/actions/stepsActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA'
  },
  contentContainer: {
    paddingTop: 14,
    paddingBottom: 0,
    paddingLeft: 14,
    paddingRight: 14
  }
})

export class CheckoutProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fieldsFetching: true
    }
  }

  componentDidMount() {
    const { authActions } = this.props
    const { fieldsFetching } = this.state

    if (fieldsFetching) {
      authActions
        .profileFields({
          location: 'checkout',
          action: 'update'
        })
        .then(({ fields }) => {
          // eslint-disable-next-line no-param-reassign
          delete fields.E

          this.setState({
            fields,
            fieldsFetching: false
          })
        })
    }
  }

  handleNextPress(values) {
    const {
      route,
      cartActions,
      stateSteps,
      stepsActions,
      stateCart,
      navigation
    } = this.props
    const { cart, currentStep } = route.params

    cartActions.saveUserData(
      {
        ...cart.user_data,
        ...values
      },
      stateCart.coupons
    )

    // Define next step
    const nextStep =
      stateSteps.flowSteps[
        Object.keys(stateSteps.flowSteps)[currentStep.stepNumber + 1]
      ]
    stepsActions.setNextStep(nextStep)

    cartActions
      .getUpdatedDetailsForShippingAddress({
        ...cart.user_data,
        ...values
      })
      .then(data => {
        cart.product_groups = data.product_groups.filter(
          product_group => !product_group.shipping_by_marketplace
        )

        navigation.navigate(nextStep.screenName, {
          name: nextStep.screenName,
          cart,
          total: cart.subtotal,
          currentStep: nextStep
        })
      })
  }

  filterProfileFormFields = (cart, fields) => {
    const filteredFields = { ...fields }

    if (!cart.isShippingRequired) {
      delete filteredFields.S
    }

    return filteredFields
  }

  render() {
    const { route, settings, navigation, auth } = this.props
    const { cart, currentStep } = route.params
    const { fieldsFetching, fields } = this.state

    if (fieldsFetching) {
      return (
        <View style={styles.container}>
          <Spinner visible />
        </View>
      )
    }

    const filteredFields = this.filterProfileFormFields(cart, fields)

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <StepByStepSwitcher currentStep={currentStep} />
        </View>

        <ProfileForm
          isLogged={auth.logged}
          dateFormat={settings.dateFormat}
          fields={filteredFields}
          cartFooterEnabled
          showTitles
          totalPrice={formatPrice(cart.total_formatted.price)}
          btnText={i18n.t('Next').toUpperCase()}
          onSubmit={values => {
            this.handleNextPress(values)
          }}
          navigation={navigation}
        />
      </SafeAreaView>
    )
  }
}

export default connect(
  state => ({
    stateCart: state.cart,
    auth: state.auth,
    stateSteps: state.steps,
    settings: state.settings,
    state
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch),
    cartActions: bindActionCreators(cartActions, dispatch),
    stepsActions: bindActionCreators(stepsActions, dispatch)
  })
)(CheckoutProfile)
