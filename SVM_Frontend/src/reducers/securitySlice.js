import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  metrics: [
    {
      label: "Scans Today",
      value: "142",
      iconName: "QrCode",
      trend: "+12%",
      color: "text-white",
    },
    {
      label: "People Inside",
      value: "28",
      iconName: "Users",
      trend: "Normal",
      color: "text-white",
    },
    {
      label: "Safety Check",
      value: "100%",
      iconName: "ShieldCheck",
      trend: "Steady",
      color: "text-green-500",
    },
    {
      label: "Open Alerts",
      value: "02",
      iconName: "AlertTriangle",
      trend: "Needs Attention",
      color: "text-primary",
    },
  ],
  commandStatus: "All Systems Working",
  stationId: "NODE-08-MAIN",
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
