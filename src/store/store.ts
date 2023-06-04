import { configureStore } from '@reduxjs/toolkit';
import instanceReducer from './api_instance_slice';
import phoneReducer from './phone_slice';

export const store = configureStore({
  reducer: {
    apiInstance: instanceReducer,
    phone: phoneReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
