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

      if (response.data && Array.isArray(response.data) && response.data.every(item => item.staff_id)) {
        const formattedData = response.data.map(item => ({
          id: item.staff_id,
          name: item.name,
          job_title: item.job_title,
          position: item.position,
          email: item.email,
          status: item.status,
          gender: item.gender,
          short_description: item.short_description,
          lang_code: item.lang_code,
          country: item.country,
          state: item.state,
          city: item.city,
          zipcode: item.zipcode,
          address: item.address,
          image_path: item.image_path,
        }));
        dispatch(fetchStaffSuccess(formattedData));
      } else {
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
      if (response.data && response.data.staff_id) {
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
      if (response.data && response.data.staff_id) {
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

// Экспорт функции createStaff
export const createStaff = (staff) => {
  return async (dispatch) => {
    dispatch(saveStaffRequest());
    try {
      const response = await AxiosInstance.post('/sra_staff', staff);
      console.log('Create staff response:', response.data);
      if (response.data && response.data.staff_id) {
        dispatch(saveStaffSuccess(response.data));
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Create staff error:', error);
      dispatch(saveStaffFailure(error.message));
    }
  };
};
