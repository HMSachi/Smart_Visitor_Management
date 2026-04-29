import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  metrics: [
    {
      label: "Scans Today",
      value: "0",
      iconName: "QrCode",
      trend: "Today",
      color: "text-white",
    },
    {
      label: "People Inside",
      value: "0",
      iconName: "Users",
      trend: "On-Premise",
      color: "text-white",
    },
  ],
  activeVisitors: [],
  accessLogs: [],
  alerts: [],
};

const securitySlice = createSlice({
  name: "security",
  initialState,
  reducers: {
    updateMetric: (state, action) => {
      const { label, value } = action.payload;
      const metric = state.metrics.find((m) => m.label === label);
      if (metric) {
        metric.value = value;
      }
    },
    setActiveVisitors: (state, action) => {
      state.activeVisitors = action.payload;
    },
    setAccessLogs: (state, action) => {
      state.accessLogs = action.payload;
    },
    setAlerts: (state, action) => {
      state.alerts = action.payload;
    },
    addAlert: (state, action) => {
      state.alerts.unshift(action.payload);
    },
  },
});

export const { updateMetric, setCommandStatus, addAlert, setActiveVisitors, setAccessLogs, setAlerts } =
  securitySlice.actions;

export default securitySlice.reducer;
