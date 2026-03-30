import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Dashboard Metrics
  metrics: {
    totalVisits: 12540,
    activeVisitors: 42,
    todayStats: [
      { label: 'Total Visits Today', value: '1,284', iconName: 'Users', trend: '+12%', colorClass: 'mas-red' },
      { label: 'Active Visitors', value: '42', iconName: 'UserCheck', trend: 'Stable', colorClass: 'mas-red' },
      { label: 'Alerts & Violations', value: '03', iconName: 'AlertTriangle', trend: '+2', colorClass: 'mas-red' },
    ],
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
  },
  
  // Approval Management
  approvals: {
    visitorList: [
      { 
        batchId: "BATCH-2026-001",
        id: "MAS-VAS-001", 
        name: 'Adithya Bandara', 
        isLeader: true,
        nic: '958273645V',
        contact: '+94 77 123 4567', 
        email: 'adithya@example.com',
        date: '2026-03-25',
        timeIn: '08:30 AM', 
        purpose: 'BUSINESS MEETING',
        visitorCount: 3,
        vehicle: 'WP CAS-1234 (Car)',
        areas: ['MAIN RECEPTION', 'PRODUCTION FLOOR 2'],
        status: 'Approved', 
        contactPerson: 'Saman Kumara',
        equipment: [],
        members: [
          { name: 'Sameera Perera', nic: '940012345V', contact: '+94 77 111 2222' },
          { name: 'Dulani Silva', nic: '967788990V', contact: '+94 77 333 4444' }
        ]
      },
      { 
        batchId: "BATCH-2026-002",
        id: "MAS-VAS-002", 
        name: 'Kasun Perera', 
        isLeader: true,
        nic: '921123456V',
        contact: '+94 71 987 6543', 
        email: 'kasun@gmail.com',
        date: '2026-03-25',
        timeIn: '09:15 AM', 
        purpose: 'CLIENT VISIT',
        visitorCount: 1,
        vehicle: 'None',
        areas: ['ADMIN BLOCK'],
        status: 'Pending', 
        contactPerson: 'Nimali Silva',
        equipment: ['Laptop (1)'],
        members: []
      },
      { 
        batchId: "BATCH-2026-003",
        id: "MAS-VAS-003", 
        name: 'Sarah Jenkins', 
        isLeader: true,
        nic: 'N/A (Passport)',
        contact: '+44 20 7123 4567', 
        email: 'sarah.j@global.com',
        date: '2026-03-24',
        timeIn: '10:00 AM', 
        purpose: 'TECHNICAL AUDIT',
        visitorCount: 2,
        vehicle: 'WP KN-5566 (Van)',
        areas: ['IT DEPARTMENT', 'DATA CENTER'],
        status: 'Checked Out', 
        contactPerson: 'Rohit Sharma',
        equipment: ['Diagnostic Kit (2)'],
        members: [
          { name: 'Michael Chen', nic: 'E1234567 (Passport)', contact: '+1 415 555 0123' }
        ]
      },
    ],
    searchTerm: '',
  },

  // Security Monitoring
  monitoring: {
    alerts: [
      { type: 'Unauthorized Zone Breach', location: 'Server Room - Level 2', time: '12:44 PM', severity: 'high' },
      { type: 'ID Card Scan Failure', location: 'Main Entrance Gate', time: '12:38 PM', severity: 'low' },
      { type: 'Extended Stay Alert', location: 'Production Block B', time: '12:15 PM', severity: 'low' },
    ],
  }
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Dashboard actions
    updateActiveVisitors: (state, action) => {
      state.metrics.activeVisitors = action.payload;
    },
    
    // Approval actions
    setSearchTerm: (state, action) => {
      state.approvals.searchTerm = action.payload;
    },
    updateVisitorStatus: (state, action) => {
      const { id, status } = action.payload;
      const visitor = state.approvals.visitorList.find(v => v.id === id);
      if (visitor) {
        visitor.status = status;
      }
    },

    // Monitoring actions
    addSecurityAlert: (state, action) => {
      state.monitoring.alerts.unshift(action.payload);
    },
  },
});

export const { 
    updateActiveVisitors, 
    setSearchTerm, 
    updateVisitorStatus, 
    addSecurityAlert 
} = adminSlice.actions;

export default adminSlice.reducer;
