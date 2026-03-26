import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalVisits: 12540,
  activeVisitors: 42,
  history: [
    { name: 'Mon', visits: 400 },
    { name: 'Tue', visits: 300 },
    { name: 'Wed', visits: 500 },
    { name: 'Thu', visits: 280 },
    { name: 'Fri', visits: 590 },
    { name: 'Sat', visits: 320 },
    { name: 'Sun', visits: 450 },
  ],
  alerts: [
    { id: 1, type: 'critical', message: 'Unauthorized access attempt in Zone B', time: '2 mins ago' },
    { id: 2, type: 'warning', message: 'Visitor duration exceeded in Lobby', time: '15 mins ago' },
    { id: 3, type: 'info', message: 'New VIP visitor registered', time: '1 hour ago' },
  ],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    updateActiveVisitors: (state, action) => {
      state.activeVisitors = action.payload;
    },
    addAlert: (state, action) => {
      state.alerts.unshift(action.payload);
    },
  },
});

export const { updateActiveVisitors, addAlert } = dashboardSlice.actions;
export default dashboardSlice.reducer;
