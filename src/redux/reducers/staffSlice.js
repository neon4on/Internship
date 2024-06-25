import { createSlice } from '@reduxjs/toolkit';
import { fetchStaff } from '../actions/staffActions';

const staffSlice = createSlice({
  name: 'sra_staff',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default staffSlice.reducer;
