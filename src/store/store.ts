import { configureStore } from '@reduxjs/toolkit';
import instanceReducer from './api_instance_slice';

export const store = configureStore({
  reducer: {
    apiInstance: instanceReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
