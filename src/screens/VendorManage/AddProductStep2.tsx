import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, StyleSheet, Text } from 'react-native'
import { bindActionCreators } from 'redux'
import * as yup from 'yup'
import { Formik, Field } from 'formik'
import theme from '../../config/theme'

// Utils
import i18n from '../../utils/i18n'

// Constants
import { FIELD_INPUT } from '../../constants'

// Components
import StepByStepSwitcher from '../../components/StepByStepSwitcher'
import FormField from '../../components/FormField'

// Actions
import * as stepsActions from '../../redux/actions/stepsActions'
import BottomActions from '../../components/BottomActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  },
  header: {
    marginLeft: 14,
    marginTop: 14
  },
  scrollContainer: {
    paddingBottom: 14
  },
  formWrapper: {
    padding: 20
  },
  inputContainer: {
    marginTop: 15
  },
  submitBtn: {
    marginTop: 15,
    backgroundColor: '#4fbe31',
    borderRadius: 3
  }
})

export class AddProductStep2 extends Component {
  constructor(props) {
    super(props)
    this.formRef = React.createRef()
  }

  handleGoNext = value => {
    const { stateSteps, navigation, route } = this.props
    const { stepsData, currentStep } = route.params

    if (value) {
      // Define next step
      const nextStep =
        stateSteps.flowSteps[
          Object.keys(stateSteps.flowSteps)[currentStep.stepNumber + 1]
        ]
      stepsActions.setNextStep(nextStep)
      navigation.navigate(nextStep.screenName, {
        stepsData: {
          ...stepsData,
          name: value.name,
          description: value.description,
          steps: stepsData.steps
        },
        currentStep: nextStep
      })
    }
  }

  renderHeader = () => {
    const { route } = this.props
    const { currentStep } = route.params

    return (
      <View style={styles.header}>
        <StepByStepSwitcher currentStep={currentStep} />
      </View>
    )
  }

  render() {
    const formFields = {
      name: {
        name: 'name',
        label: i18n.t('Name'),
        fieldType: FIELD_INPUT
      },
      description: {
        name: 'description',
        label: i18n.t('Description'),
        clearButtonMode: 'while-editing',
        multiline: true,
        numberOfLines: 6,
        keyboardType: 'default',
        fieldType: FIELD_INPUT
      }
    }

    const validationSchema = yup.object({
      name: yup.string().required(
        i18n.t('The {{field}} field is required', {
          field: i18n.t('Name'),
          interpolation: { escapeValue: false }
        })
      ),
      description: yup.string()
    })
    
    return (
      <View style={styles.container}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{ name: '', description: '' }}
          onSubmit={values => this.handleGoNext(values)}>
          {({ handleSubmit }) => (
            <>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {this.renderHeader()}
                <View style={styles.formWrapper}>
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
                </View>
              </ScrollView>
              <BottomActions
                onBtnPress={handleSubmit}
                btnText={i18n.t('Next')}
              />
            </>
          )}
        </Formik>
      </View>
    )
  }
}

export default connect(
  state => ({
    stateSteps: state.steps
  }),
  dispatch => ({
    stepsActions: bindActionCreators(stepsActions, dispatch)
  })
)(AddProductStep2)
