import { SET_FLOW, SET_NEXT_STEP } from '../../constants'
import { filterObject } from '../../utils'
import { Dispatch } from 'redux'

const filterFlowSteps = (flowSteps, payload) => {
  let filteredFlowSteps = JSON.parse(JSON.stringify(flowSteps))
  // Filter steps if the order doesn't need delivery
  if (payload.cart?.isShippingRequired) {
    filteredFlowSteps = filterObject(
      flowSteps,
      step => step.title !== 'Shipping'
    )
  }

  // Add step numbers
  Object.keys(filteredFlowSteps).forEach((stepKey, index) => {
    filteredFlowSteps[stepKey].stepNumber = index
  })

  return filteredFlowSteps
}

export const setFlow = (flowName, flowSteps, payload) => {
  return (dispatch: Dispatch) => {
    const filteredFlowSteps = filterFlowSteps(flowSteps, payload)

    dispatch({
      type: SET_FLOW,
      payload: {
        flowName,
        filteredFlowSteps
      }
    })

    return filteredFlowSteps[Object.keys(filteredFlowSteps)[0]]
  }
}

export const setNextStep = nextStep => {
  return (dispatch: Dispatch) => {
    dispatch({
      type: SET_NEXT_STEP,
      payload: nextStep
    })
  }
}
