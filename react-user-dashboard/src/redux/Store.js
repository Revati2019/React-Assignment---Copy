import { configureStore } from '@reduxjs/toolkit';
import userReducer from './UserSlice';
import authReducer from './AuthSlice';

export const store = configureStore({
  reducer: {
    users: userReducer,
    auth: authReducer
  },
});
