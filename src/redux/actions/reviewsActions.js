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
      console.log('API response:', response.data);
      
      let posts = [];
      if (response.data && response.data.data && Array.isArray(response.data.data.posts)) {
        posts = response.data.data.posts;
      } else if (response.data && Array.isArray(response.data)) {
        posts = response.data;
      } else if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
        posts = response.data.posts;
      } else {
        throw new Error('Invalid response structure');
      }
      
      dispatch(fetchReviewsSuccess(posts));
    } catch (error) {
      console.error('Error fetching reviews:', error.message);
      dispatch(fetchReviewsFailure(error.message));
    }
  };
};
