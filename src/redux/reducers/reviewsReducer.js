import {
  FETCH_REVIEWS_REQUEST,
  FETCH_REVIEWS_SUCCESS,
  FETCH_REVIEWS_FAILURE,
} from '../actions/reviewsActions';

const initialState = {
  loading: false,
  reviews: [],
  error: null,
};

const reviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REVIEWS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_REVIEWS_SUCCESS:
      return { ...state, loading: false, reviews: action.payload };
    case FETCH_REVIEWS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default reviewsReducer;
