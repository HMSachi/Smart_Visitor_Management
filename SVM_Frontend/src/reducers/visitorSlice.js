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
  vehicleType: "Car",
  plateNumber: "",

  // Stage 2: Detailed Clearance
  visitors: [{ id: Date.now(), fullName: "", nic: "", contact: "" }],
  equipment: [{ id: Date.now(), itemName: "", quantity: "", description: "" }],

  // Status & References
  status: null, // 'step1_pending', 'step1_approved', 'step2_pending', 'fully_approved'
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
    // Step 2 dynamic lists
    addVisitor: (state) => {
      state.visitors.push({
        id: Date.now(),
        fullName: "",
        nic: "",
        contact: "",
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
    addEquipment: (state) => {
      state.equipment.push({
        id: Date.now(),
        itemName: "",
        quantity: "",
        description: "",
      });
    },
    removeEquipment: (state, action) => {
      state.equipment = state.equipment.filter((e) => e.id !== action.payload);
    },
    updateEquipmentDetail: (state, action) => {
      const { id, field, value } = action.payload;
      const item = state.equipment.find((e) => e.id === id);
      if (item) item[field] = value;
    },
    // Status updates
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setRequestRef: (state, action) => {
      state.requestRef = action.payload;
    },
    resetVisitorForm: () => initialState,
  },
});

export const {
  updateField,
  toggleArea,
  updateVisitorCount,
  addVisitor,
  removeVisitor,
  updateVisitorDetail,
  addEquipment,
  removeEquipment,
  updateEquipmentDetail,
  setStatus,
  setRequestRef,
  resetVisitorForm,
} = visitorSlice.actions;

export default visitorSlice.reducer;
