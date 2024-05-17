import {
  SEND_REPORT_REQUEST,
  SEND_REPORT_SUCCESS,
  SEND_REPORT_FAIL
} from '../../constants'

const initialState = {
  fetching: false
}

export default function (state = initialState, action) {
  switch (action.type) {
    case SEND_REPORT_REQUEST:
      return {
        ...state,
        fetching: true
      }

    case SEND_REPORT_SUCCESS:
      return {
        ...state,
        fetching: false
      }

    case SEND_REPORT_FAIL:
      return {
        ...state,
        fetching: false
      }

    default:
      return state
  }
}
