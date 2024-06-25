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
      const response = await AxiosInstance.get('/sra_staff');
      console.log('Full response:', response);
      console.log('Response data:', response.data);

      if (response.data) {
        if (Array.isArray(response.data)) {
          console.log('Data is an array with length:', response.data.length);
          if (response.data.every(item => typeof item === 'object' && item.id)) {
            console.log('All items in the array have an id property');
            dispatch(fetchStaffSuccess(response.data));
          } else {
            console.error('Not all items in the array have an id property');
            throw new Error('Invalid response structure');
          }
        } else {
          console.error('Response data is not an array:', typeof response.data);
          throw new Error('Invalid response structure');
        }
      } else {
        console.error('Response data is undefined or null');
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Fetch staff error:', error);
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
      const response = await AxiosInstance.get(`/sra_staff/${staffId}`);
      console.log('Staff detail response:', response.data);
      if (response.data && response.data.id) {
        dispatch(fetchStaffDetailSuccess(response.data));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Fetch staff detail error:', error);
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
        url: `/sra_staff/${staff.id || ''}`,
        data: staff,
      });
      console.log('Save staff response:', response.data);
      if (response.data && response.data.id) {
        dispatch(saveStaffSuccess(response.data));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Save staff error:', error);
      dispatch(saveStaffFailure(error.message));
    }
  };
};
