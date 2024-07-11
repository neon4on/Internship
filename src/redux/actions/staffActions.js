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
      console.log('Request URL:', `${AxiosInstance.defaults.baseURL}staff_management_valeriy`);
      const response = await AxiosInstance.get('staff_management_valeriy');
      console.log('Full response:', response);
      
      if (response.data && Array.isArray(response.data.staff)) {
        const formattedData = response.data.staff.map(item => ({
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
          image_path: item.main_pair?.icon?.https_image_path || null,
          timestamp: item.timestamp
        }));
        console.log('Formatted data:', formattedData);
        dispatch(fetchStaffSuccess(formattedData));
      } else {
        console.error('Unexpected response structure:', response.data);
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
      console.log('Fetching staff detail for ID:', staffId);
      const response = await AxiosInstance.get(`staff_management_valeriy/${staffId}`);
      console.log('Full staff detail response:', response);
      
      if (response.data) {
        console.log('Staff detail data:', response.data);
        dispatch(fetchStaffDetailSuccess(response.data));
      } else {
        throw new Error('No data in response');
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

export const saveStaff = (staffData, staffId) => {
  return async (dispatch) => {
    console.log('Starting saveStaff action');
    dispatch(saveStaffRequest());
    try {
      console.log('Creating FormData');
      const formData = new FormData();
      
      console.log('Checking required fields');
      const requiredFields = ['name', 'job_title', 'email'];
      requiredFields.forEach(field => {
        if (!staffData[field]) {
          throw new Error(`Field '${field}' is required`);
        }
      });

      console.log('Adding staffData to FormData');
      Object.keys(staffData).forEach(key => {
        if (key !== 'image') {
          formData.append(`staff_data[${key}]`, staffData[key]);
        }
      });
      
      console.log('Adding staff_id to FormData');
      formData.append('staff_id', staffId || 0);
      
      console.log('Checking for image');
      if (staffData.image && staffData.image.uri) {
        console.log('Adding image to FormData');
        formData.append('staff_image', {
          uri: staffData.image.uri,
          type: staffData.image.type || 'image/jpeg',
          name: staffData.image.name || 'staff_image.jpg',
        });
      }

      console.log('Sending data:', formData);
      
      console.log('Making API request');
      const response = await AxiosInstance.post('staff_management_valeriy', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Full server response:', response);
      console.log('Save staff response data:', response.data);
      console.log('Response status:', response.status);
      
      if (typeof response.data === 'string' && response.data.includes('Tygh\\Exceptions\\AException')) {
        console.log('Server returned HTML error');
        const errorMessage = response.data.match(/<p[^>]*>(.*?)<\/p>/)[1] || 'Unknown server error';
        throw new Error(errorMessage);
      } else if (response.data && (response.data.staff_id || typeof response.data === 'number')) {
        console.log('Server returned valid staff_id');
        const savedStaffId = response.data.staff_id || response.data;
        dispatch(saveStaffSuccess({ ...staffData, staff_id: savedStaffId }));
      } else {
        console.error('Invalid server response structure:', response.data);
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Save staff error:', error);
      console.error('Error stack:', error.stack);
      dispatch(saveStaffFailure(error.message));
    }
  };
};

export const createStaff = (staffData) => {
  return async (dispatch) => {
    dispatch(saveStaffRequest());
    try {
      const response = await AxiosInstance.post('staff_management_valeriy', staffData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
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
