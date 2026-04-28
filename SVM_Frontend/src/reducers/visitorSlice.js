import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Stage 1: Basic Information
  fullName: "",
  nic: "",
  emailAddress: "",
  phoneNumber: "",
  representingCompany: "",
  visitorClassification: "",
  visitingArea: "",
  proposedVisitDate: "",
  purposeOfVisitation: "",
  
  // Stage 2: Detailed Logistics
  vehicles: [{ id: Date.now(), vehicleType: "Car", plateNumber: "", isConfirmed: false, isSavedToServer: false }],
  visitors: [{ id: Date.now(), fullName: "", nic: "", contact: "", isConfirmed: false }],
  equipment: [{ id: Date.now(), itemName: "", quantity: "", description: "", isConfirmed: false }],

  // Internal Workflow State
  requestId: null,
  isSubmitting: false,
  error: null,
  status: null, // 'step1_pending', 'step2_pending', etc.
  requestRef: "MAS-VAS-PENDING",
};

const visitorSlice = createSlice({
  name: "visitor",
  initialState,
  reducers: {
    updateField: (state, action) => {
      const { name, value } = action.payload;
      state[name] = value;
    },
    toggleArea: (state, action) => {
      const areaId = action.payload;
      if (state.selectedAreas.includes(areaId)) {
        state.selectedAreas = state.selectedAreas.filter((id) => id !== areaId);
      } else {
        state.selectedAreas.push(areaId);
      }
    },
    updateVisitorCount: (state, action) => {
      state.visitorCount = Math.max(1, state.visitorCount + action.payload);
    },
    // Vehicle actions
    addVehicle: (state) => {
      state.vehicles.push({
        id: Date.now(),
        vehicleType: "Car",
        plateNumber: "",
        isConfirmed: false,
        isSavedToServer: false,
      });
    },
    removeVehicle: (state, action) => {
      if (state.vehicles.length > 1) {
        state.vehicles = state.vehicles.filter((v) => v.id !== action.payload);
      }
    },
    updateVehicleDetail: (state, action) => {
      const { id, field, value } = action.payload;
      const vehicle = state.vehicles.find((v) => v.id === id);
      if (vehicle) vehicle[field] = value;
    },
    toggleVehicleConfirmed: (state, action) => {
      const vehicle = state.vehicles.find((v) => v.id === action.payload);
      if (vehicle) vehicle.isConfirmed = !vehicle.isConfirmed;
    },
    markVehicleSavedVisitor: (state, action) => {
      const vehicle = state.vehicles.find((v) => v.id === action.payload);
      if (vehicle) {
        vehicle.isSavedToServer = true;
        vehicle.isConfirmed = true;
      }
    },

    // Step 2 dynamic lists enhancements
    addVisitor: (state) => {
      state.visitors.push({
        id: Date.now(),
        fullName: "",
        nic: "",
        contact: "",
        isConfirmed: false,
        isSavedToServer: false,
      });
    },
    removeVisitor: (state, action) => {
      if (state.visitors.length > 1) {
        state.visitors = state.visitors.filter((v) => v.id !== action.payload);
      }
    },
    updateVisitorDetail: (state, action) => {
      const { id, field, value } = action.payload;
      const visitor = state.visitors.find((v) => v.id === id);
      if (visitor) visitor[field] = value;
    },
    toggleVisitorConfirmed: (state, action) => {
      const visitor = state.visitors.find((v) => v.id === action.payload);
      if (visitor) visitor.isConfirmed = !visitor.isConfirmed;
    },
    markVisitorSaved: (state, action) => {
      const visitor = state.visitors.find((v) => v.id === action.payload);
      if (visitor) { visitor.isSavedToServer = true; visitor.isConfirmed = true; }
    },

    addEquipment: (state) => {
      state.equipment.push({
        id: Date.now(),
        itemName: "",
        quantity: "",
        description: "",
        isConfirmed: false,
        isSavedToServer: false,
      });
    },
    removeEquipment: (state, action) => {
      if (state.equipment.length > 1) {
        state.equipment = state.equipment.filter(
          (e) => e.id !== action.payload,
        );
      }
    },
    updateEquipmentDetail: (state, action) => {
      const { id, field, value } = action.payload;
      const item = state.equipment.find((e) => e.id === id);
      if (item) item[field] = value;
    },
    toggleEquipmentConfirmed: (state, action) => {
      const item = state.equipment.find((e) => e.id === action.payload);
      if (item) item.isConfirmed = !item.isConfirmed;
    },
    markEquipmentSaved: (state, action) => {
      const item = state.equipment.find((e) => e.id === action.payload);
      if (item) { item.isSavedToServer = true; item.isConfirmed = true; }
    },

    // Status updates
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setRequestId: (state, action) => {
      state.requestId = action.payload;
    },
    setRequestRef: (state, action) => {
      state.requestRef = action.payload;
    },
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    resetVisitorForm: () => initialState,
  },
});

export const {
  updateField,
  toggleArea,
  updateVisitorCount,
  addVehicle,
  removeVehicle,
  updateVehicleDetail,
  toggleVehicleConfirmed,
  markVehicleSavedVisitor,
  addVisitor,
  removeVisitor,
  updateVisitorDetail,
  toggleVisitorConfirmed,
  markVisitorSaved,
  addEquipment,
  removeEquipment,
  updateEquipmentDetail,
  toggleEquipmentConfirmed,
  markEquipmentSaved,
  setStatus,
  setRequestId,
  setRequestRef,
  setSubmitting,
  setError,
  resetVisitorForm,
} = visitorSlice.actions;

export default visitorSlice.reducer;
