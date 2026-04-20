import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  requests: [],
  searchTerm: '',
  statusFilter: 'All',
  selectedRequestId: null,
};

const contactPersonSlice = createSlice({
  name: 'contactPerson',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setSelectedRequest: (state, action) => {
      state.selectedRequestId = action.payload;
    },
    updateRequestStatus: (state, action) => {
      const { id, status } = action.payload;
      const request = state.requests.find(r => r.id === id);
      if (request) {
        request.status = status;
      }
    },
  },
});

export const { 
    setSearchTerm, 
    setStatusFilter, 
    setSelectedRequest, 
    updateRequestStatus 
} = contactPersonSlice.actions;

export default contactPersonSlice.reducer;
