import { Action, configureStore, ThunkDispatch } from '@reduxjs/toolkit';
import storageReducer from './storageSlice';
import applicationReducer from './applicationSlice';
import { useDispatch } from 'react-redux';

const store = configureStore({
  reducer: {
    storage: storageReducer,
    application: applicationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type ThunkAppDispatch = ThunkDispatch<RootState, void, Action>;
export const useAppThunkDispatch = () => useDispatch<ThunkAppDispatch>();
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;

export default store;
