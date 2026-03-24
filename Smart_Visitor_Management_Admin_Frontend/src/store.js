import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './reducers/dashboardSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});
