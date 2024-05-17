import {
  FETCH_LAYOUTS_BLOCKS_REQUEST,
  FETCH_LAYOUTS_BLOCKS_SUCCESS,
  FETCH_LAYOUTS_BLOCKS_FAIL
} from '../../constants'

const initialState = {
  blocks: []
}

let newState = null

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_LAYOUTS_BLOCKS_REQUEST:
      return {
        ...state
      }

    case FETCH_LAYOUTS_BLOCKS_SUCCESS:
      newState = Object.keys(action.payload.blocks)
        .map(k => {
          action.payload.blocks[k].location = action.payload.location
          return action.payload.blocks[k]
        })
        .sort((a, b) => a.order - b.order)
      return {
        ...state,
        blocks: newState
      }

    case FETCH_LAYOUTS_BLOCKS_FAIL:
      return {
        ...state
      }

    default:
      return state
  }
}
