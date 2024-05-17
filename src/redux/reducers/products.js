import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_FAIL,
  FETCH_PRODUCTS_SUCCESS,
  CHANGE_PRODUCTS_SORT,
  FETCH_PRODUCT_BLOCKS_REQUEST,
  FETCH_PRODUCT_BLOCKS_FAIL,
  FETCH_PRODUCT_BLOCKS_SUCCESS
} from '../../constants'

const initialState = {
  sortParams: {
    sort_by: 'product',
    sort_order: 'asc'
  },
  params: {
    page: 1
  },
  items: {},
  filters: [],
  fetching: false,
  hasMore: false,
  blocks: []
}

let params = {}
let items = {}

export default function (state = initialState, action) {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        fetching: true
      }

    case FETCH_PRODUCTS_SUCCESS:
      items = { ...state.items }
      params = { ...action.payload.params }
      if (items[params.cid] && action.payload.params.page != 1) {
        items[params.cid] = [...items[params.cid], ...action.payload.products]
      } else {
        items[params.cid] = [...action.payload.products]
      }
      return {
        ...state,
        params,
        items,
        filters: action.payload.filters || [],
        hasMore: params.items_per_page * params.page < +params.total_items,
        fetching: false
      }

    case FETCH_PRODUCTS_FAIL:
      return {
        ...state,
        fetching: false
      }

    case CHANGE_PRODUCTS_SORT:
      return {
        ...state,
        sortParams: action.payload
      }
    case FETCH_PRODUCT_BLOCKS_SUCCESS:
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

    default:
      return state
  }
}
