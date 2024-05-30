import { createSlice } from '@reduxjs/toolkit';
// TYPES
import { ApplicationState } from '@/app/types';

const initialState: ApplicationState = {
  loader: false,
};

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    showLoader: (state?: any) => {
      state.loader = true;
    },
    hideLoader: (state?: any) => {
      state.loader = false;
    },
  },
});

export const { showLoader, hideLoader } = applicationSlice.actions;

export default applicationSlice.reducer;
