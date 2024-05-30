import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiClient from '@/app/services/apiClient';
// TYPES
import { WritableDraft } from 'immer';
import { StorageState } from '@/app/types';

export const getSearchedFiles = createAsyncThunk(
  'search',
  async (payload: { limit?: number; offset?: number }, { rejectWithValue }) => {
    let params = [];
    if (payload.limit) {
      params.push(`limit=${payload.limit}`);
    }
    if (payload.offset) {
      params.push(`offset=${payload.offset}`);
    }
    try {
      const response = await apiClient.get(
        `/v0/storage/search${params.length ? `?${params.join('&')}` : ''}`
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

export const getFileDetails = createAsyncThunk(
  'details',
  async (payload: { fileId: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`v0/storage/${payload.fileId}`);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const initialState: StorageState = {
  data: null,
  status: 'idle',
  error: null,
};

const storageSlice = createSlice({
  name: 'storage',
  initialState,
  reducers: {
    clear: (state?: any) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getSearchedFiles.pending,
        (state: WritableDraft<StorageState>) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addCase(
        getSearchedFiles.fulfilled,
        (state: WritableDraft<StorageState>, action: PayloadAction<any>) => {
          state.data = action.payload;
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addCase(
        getSearchedFiles.rejected,
        (state: WritableDraft<StorageState>, action: PayloadAction<any>) => {
          state.status = 'failed';
          state.error = action.payload as string;
        }
      )

      .addCase(getFileDetails.pending, (state: WritableDraft<StorageState>) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(
        getFileDetails.fulfilled,
        (state: WritableDraft<StorageState>, action: PayloadAction<any>) => {
          state.status = 'succeeded';
          state.error = null;
        }
      )
      .addCase(
        getFileDetails.rejected,
        (state: WritableDraft<StorageState>, action: PayloadAction<any>) => {
          state.status = 'failed';
          state.error = action.payload as string;
        }
      );
  },
});

export const {} = storageSlice.actions;
export default storageSlice.reducer;
