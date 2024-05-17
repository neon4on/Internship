import React, { Component } from 'react'
import { View, Text, I18nManager, StyleSheet } from 'react-native'
import i18n from '../utils/i18n'
import { connect } from 'react-redux'

// Component
import Icon from './Icon'
import theme from '../../users/com.simtech.multivendor/src/config/theme'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
    borderTopWidth: 1,
    borderTopColor: '#EAEAEA',
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    marginLeft: -14,
    marginRight: -14,
    marginTop: -14,
    marginBottom: 0,
    overflow: 'hidden'
  },
  checkIcon: {
    height: 27,
    width: 27,
    marginLeft: 4,
    marginRight: 4,
    opacity: 0.4,
    color: theme.$darkColor
  },
  stepContainer: {
    position: 'relative'
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 10,
    height: 30
  },
  arrowContainer: {
    height: 50,
    width: 20,
    right: 0,
    top: -12,
    position: 'absolute'
  },
  arrowTop: {
    borderRightWidth: 1,
    borderRightColor: '#D6D6D6',
    height: 30,
    right: 0,
    position: 'absolute',
    top: -0,
    transform: [{ rotate: I18nManager.isRTL ? '30deg' : '-30deg' }]
  },
  arrowBottom: {
    borderRightWidth: 1,
    borderRightColor: '#D6D6D6',
    height: 30,
    right: 0,
    position: 'absolute',
    bottom: -6,
    transform: [{ rotate: I18nManager.isRTL ? '-30deg' : '30deg' }]
  },
  roundNumber: {
    minWidth: 20,
    height: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242424',
    marginRight: 6
  },
  roundNumberText: {
    color: '#fff',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 12,
    marginTop: -1
  },
  roundNumberGray: {
    backgroundColor: '#989898',
    [I18nManager.isRTL ? 'marginRight' : 'marginLeft']: 6
  },
  stepTitle: {
    color: theme.$darkColor
  }
})

export class StepByStepSwitcher extends Component {
  renderArrow = () => (
    <View style={styles.arrowContainer}>
      <View style={styles.arrowTop} />
      <View style={styles.arrowBottom} />
    </View>
  )

  renderPassedSteps() {
    const { currentStep } = this.props
    const stepsList = []

    for (let i = 0; i !== currentStep.stepNumber; i += 1) {
      stepsList.push(
        <View style={styles.stepContainer} key={i}>
          <View style={styles.stepContent}>
            <Icon name="check" style={styles.checkIcon} />
          </View>
          {this.renderArrow()}
        </View>
      )
    }
    return stepsList
  }

  renderActiveStep() {
    const { currentStep } = this.props

    return (
      <View style={styles.stepContainer}>
        <View style={styles.stepContent}>
          <View style={styles.roundNumber}>
            <Text style={styles.roundNumberText}>
              {currentStep.stepNumber + 1}
            </Text>
          </View>
          <Text style={styles.stepTitle}>{i18n.t(currentStep.title)}</Text>
        </View>
        {this.renderArrow()}
      </View>
    )
  }

  renderNextSteps() {
    const { stateSteps, currentStep } = this.props
    const stepsList = []

    for (
      let i = currentStep.stepNumber + 1;
      i < Object.keys(stateSteps.flowSteps).length;
      i += 1
    ) {
      stepsList.push(
        <View style={styles.stepContainer} key={i}>
          <View style={styles.stepContent}>
            <View style={[styles.roundNumber, styles.roundNumberGray]}>
              <Text style={styles.roundNumberText}>{i + 1}</Text>
            </View>
          </View>
          {this.renderArrow()}
        </View>
      )
    }
    return stepsList
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderPassedSteps()}
        {this.renderActiveStep()}
        {this.renderNextSteps()}
      </View>
    )
  }
}

export default connect(state => ({
  stateSteps: state.steps
}))(StepByStepSwitcher)
