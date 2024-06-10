import {
    FETCH_STAFF_REQUEST,
    FETCH_STAFF_SUCCESS,
    FETCH_STAFF_FAILURE,
    FETCH_STAFF_DETAIL_REQUEST,
    FETCH_STAFF_DETAIL_SUCCESS,
    FETCH_STAFF_DETAIL_FAILURE,
    SAVE_STAFF_REQUEST,
    SAVE_STAFF_SUCCESS,
    SAVE_STAFF_FAILURE,
  } from '../actions/staffActions';
  
  const initialState = {
    list: [],
    detail: null,
    loading: false,
    error: null,
  };
  
  const staffReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_STAFF_REQUEST:
      case FETCH_STAFF_DETAIL_REQUEST:
      case SAVE_STAFF_REQUEST:
        return { ...state, loading: true, error: null };
      case FETCH_STAFF_SUCCESS:
        return { ...state, loading: false, list: action.payload };
      case FETCH_STAFF_DETAIL_SUCCESS:
        return { ...state, loading: false, detail: action.payload };
      case SAVE_STAFF_SUCCESS:
        return { ...state, loading: false };
      case FETCH_STAFF_FAILURE:
      case FETCH_STAFF_DETAIL_FAILURE:
      case SAVE_STAFF_FAILURE:
        return { ...state, loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default staffReducer;
  