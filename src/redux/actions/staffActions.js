import AxiosInstance from '../../services/api';

export const FETCH_STAFF_REQUEST = 'FETCH_STAFF_REQUEST';
export const FETCH_STAFF_SUCCESS = 'FETCH_STAFF_SUCCESS';
export const FETCH_STAFF_FAILURE = 'FETCH_STAFF_FAILURE';

export const FETCH_STAFF_DETAIL_REQUEST = 'FETCH_STAFF_DETAIL_REQUEST';
export const FETCH_STAFF_DETAIL_SUCCESS = 'FETCH_STAFF_DETAIL_SUCCESS';
export const FETCH_STAFF_DETAIL_FAILURE = 'FETCH_STAFF_DETAIL_FAILURE';

export const SAVE_STAFF_REQUEST = 'SAVE_STAFF_REQUEST';
export const SAVE_STAFF_SUCCESS = 'SAVE_STAFF_SUCCESS';
export const SAVE_STAFF_FAILURE = 'SAVE_STAFF_FAILURE';

export const fetchStaffRequest = () => ({
  type: FETCH_STAFF_REQUEST,
});

export const fetchStaffSuccess = (staff) => ({
  type: FETCH_STAFF_SUCCESS,
  payload: staff,
});

export const fetchStaffFailure = (error) => ({
  type: FETCH_STAFF_FAILURE,
  payload: error,
});

export const fetchStaff = () => {
  return async (dispatch) => {
    dispatch(fetchStaffRequest());
    try {
      const response = await AxiosInstance.get('/staff');
      if (response.data) {
        dispatch(fetchStaffSuccess(response.data));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      dispatch(fetchStaffFailure(error.message));
    }
  };
};

export const fetchStaffDetailRequest = () => ({
  type: FETCH_STAFF_DETAIL_REQUEST,
});

export const fetchStaffDetailSuccess = (staff) => ({
  type: FETCH_STAFF_DETAIL_SUCCESS,
  payload: staff,
});

export const fetchStaffDetailFailure = (error) => ({
  type: FETCH_STAFF_DETAIL_FAILURE,
  payload: error,
});

export const fetchStaffDetail = (staffId) => {
  return async (dispatch) => {
    dispatch(fetchStaffDetailRequest());
    try {
      const response = await AxiosInstance.get(`/staff/${staffId}`);
      if (response.data) {
        dispatch(fetchStaffDetailSuccess(response.data));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      dispatch(fetchStaffDetailFailure(error.message));
    }
  };
};

export const saveStaffRequest = () => ({
  type: SAVE_STAFF_REQUEST,
});

export const saveStaffSuccess = (staff) => ({
  type: SAVE_STAFF_SUCCESS,
  payload: staff,
});

export const saveStaffFailure = (error) => ({
  type: SAVE_STAFF_FAILURE,
  payload: error,
});

export const saveStaff = (staff) => {
  return async (dispatch) => {
    dispatch(saveStaffRequest());
    try {
      const method = staff.id ? 'PUT' : 'POST';
      const response = await AxiosInstance({
        method,
        url: `/staff/${staff.id || ''}`,
        data: staff,
      });
      if (response.data) {
        dispatch(saveStaffSuccess(response.data));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      dispatch(saveStaffFailure(error.message));
    }
  };
};
