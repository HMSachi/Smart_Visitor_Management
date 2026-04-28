import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visitationDetails: {
    VVR_Visitor_id: "",
    VVR_Visit_Date: "",
    VVR_Places_to_Visit: "",
    VVR_Purpose: "",
    VVR_Status: "PENDING",
  },
  selectedVisitorDetails: null,
  vehicles: [],
  people: [],
  items: [],
  isSubmitting: false,
  error: null,
};

const visitRequestFormSlice = createSlice({
  name: "visitRequestForm",
  initialState,
  reducers: {
    updateVisitationDetails: (state, action) => {
      state.visitationDetails = { ...state.visitationDetails, ...action.payload };
    },
    setSelectedVisitor: (state, action) => {
      state.selectedVisitorDetails = action.payload;
    },
    // Vehicles
    setVehicles: (state, action) => {
      state.vehicles = action.payload;
    },
    addVehicle: (state) => {
      state.vehicles = [{ type: "Car", number: "", isConfirmed: false }, ...state.vehicles];
    },
    toggleVehicleConfirmed: (state, action) => {
      state.vehicles[action.payload].isConfirmed = !state.vehicles[action.payload].isConfirmed;
    },
    removeVehicle: (state, action) => {
      state.vehicles = state.vehicles.filter((_, i) => i !== action.payload);
    },
    updateVehicle: (state, action) => {
      const { index, field, value } = action.payload;
      state.vehicles[index][field] = value;
    },
    // People
    setPeople: (state, action) => {
      state.people = action.payload;
    },
    addPerson: (state) => {
      state.people = [{ name: "", nic: "", phone: "", isConfirmed: false }, ...state.people];
    },
    togglePersonConfirmed: (state, action) => {
      state.people[action.payload].isConfirmed = !state.people[action.payload].isConfirmed;
    },
    removePerson: (state, action) => {
      state.people = state.people.filter((_, i) => i !== action.payload);
    },
    updatePerson: (state, action) => {
      const { index, field, value } = action.payload;
      state.people[index][field] = value;
    },
    // Items
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state) => {
      state.items = [{ name: "", quantity: "", description: "", isConfirmed: false }, ...state.items];
    },
    toggleItemConfirmed: (state, action) => {
      state.items[action.payload].isConfirmed = !state.items[action.payload].isConfirmed;
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((_, i) => i !== action.payload);
    },
    updateItem: (state, action) => {
      const { index, field, value } = action.payload;
      state.items[index][field] = value;
    },
    // Meta
    resetForm: () => initialState,
    setSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const {
  updateVisitationDetails,
  setSelectedVisitor,
  setVehicles,
  addVehicle,
  toggleVehicleConfirmed,
  removeVehicle,
  updateVehicle,
  setPeople,
  addPerson,
  togglePersonConfirmed,
  removePerson,
  updatePerson,
  setItems,
  addItem,
  toggleItemConfirmed,
  removeItem,
  updateItem,
  resetForm,
  setSubmitting,
  setError
} = visitRequestFormSlice.actions;

export default visitRequestFormSlice.reducer;
