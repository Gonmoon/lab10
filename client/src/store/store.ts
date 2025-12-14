import { configureStore } from '@reduxjs/toolkit';
import editionsReducer from '../features/editions/editionsSlice';
import recipientsReducer from '../features/recipients/recipientsSlice';
import subscriptionsReducer from '../features/subscriptions/subscriptionsSlice';

export const store = configureStore({
  reducer: {
    editions: editionsReducer,
    recipients: recipientsReducer,
    subscriptions: subscriptionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;