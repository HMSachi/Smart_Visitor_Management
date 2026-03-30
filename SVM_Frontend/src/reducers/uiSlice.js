import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isMobileMenuOpen: false,
  isSidebarCollapsed: false,
  isMobile: window.innerWidth < 768,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenu: (state, action) => {
      state.isMobileMenuOpen = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
    setSidebarCollapsed: (state, action) => {
      state.isSidebarCollapsed = action.payload;
    },
    updateIsMobile: (state) => {
      state.isMobile = window.innerWidth < 768;
    },
  },
});

export const { 
  toggleMobileMenu, 
  setMobileMenu, 
  toggleSidebar, 
  setSidebarCollapsed,
  updateIsMobile 
} = uiSlice.actions;

export default uiSlice.reducer;
