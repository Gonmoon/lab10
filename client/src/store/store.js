import { configureStore } from '@reduxjs/toolkit';
import editionsReducer from '../features/editions/editionsSlice';

export const store = configureStore({
  reducer: {
    editions: editionsReducer
  }
});
