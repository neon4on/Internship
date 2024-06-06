import AxiosInstance from '../../services/api';

export const FETCH_REVIEWS_REQUEST = 'FETCH_REVIEWS_REQUEST';
export const FETCH_REVIEWS_SUCCESS = 'FETCH_REVIEWS_SUCCESS';
export const FETCH_REVIEWS_FAILURE = 'FETCH_REVIEWS_FAILURE';

export const fetchReviewsRequest = () => ({
  type: FETCH_REVIEWS_REQUEST,
});

export const fetchReviewsSuccess = (reviews) => ({
  type: FETCH_REVIEWS_SUCCESS,
  payload: reviews,
});

export const fetchReviewsFailure = (error) => ({
  type: FETCH_REVIEWS_FAILURE,
  payload: error,
});

export const fetchReviews = () => {
  return async (dispatch) => {
    dispatch(fetchReviewsRequest());
    try {
      const response = await AxiosInstance.get('/sra_discussion_messages');
      console.log('Response from API:', response.data);
      if (response.data && response.data.posts) {
        dispatch(fetchReviewsSuccess(response.data.posts));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
      dispatch(fetchReviewsFailure(error.message));
    }
  };
};
