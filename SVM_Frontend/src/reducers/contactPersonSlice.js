import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  requests: [
    {
      id: 'REQ-001',
      batchId: 'BATCH-2026-001',
      name: 'ADITHYA BANDARA',
      contactPerson: 'SAMAN KUMARA',
      date: '2026-03-25',
      timeIn: '08:30 AM',
      areas: ['MAIN RECEPTION', 'ADMIN BLOCK'],
      status: 'Approved',
      members: [{}, {}], 
    },
    {
      id: 'REQ-002',
      batchId: 'BATCH-2026-002',
      name: 'KASUN PERERA',
      contactPerson: 'NIMALI SILVA',
      date: '2026-03-25',
      timeIn: '09:15 AM',
      areas: ['ADMIN BLOCK'],
      status: 'Pending',
      members: [],
    },
    {
      id: 'REQ-003',
      batchId: 'BATCH-2026-003',
      name: 'SARAH JENKINS',
      contactPerson: 'ROHIT SHARMA',
      date: '2026-03-24',
      timeIn: '10:00 AM',
      areas: ['IT DEPARTMENT', 'DATA CENTER'],
      status: 'Checked Out',
      members: [{}],
    }
  ],
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
