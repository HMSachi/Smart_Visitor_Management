import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  Inbox, 
  ChevronLeft,
  ChevronRight,
  LogOut,
  CalendarDays
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, Box, IconButton } from '@mui/material';
import { toggleSidebar, setMobileMenu } from '../../../reducers/uiSlice';
import { LOGOUT } from '../../../constants/LoginConstants';

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <div 
    className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-all duration-500 rounded-xl mb-2 group relative
      ${active ? 'bg-primary shadow-[0_0_20px_rgba(200,16,46,0.2)]' : 'hover:bg-[var(--color-surface-1)]'}
      ${collapsed ? 'justify-center px-2' : ''}`}
    onClick={onClick}
  >
    <div className={`transition-transform duration-500 ${active ? 'text-white' : 'text-[var(--color-text-dim)] group-hover:text-primary group-hover:scale-110'}`}>
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    </div>
    
    {!collapsed && (
      <span className={`uppercase text-[13px] font-medium tracking-[0.2em] transition-all duration-500 ${active ? 'text-white' : 'text-[var(--color-text-dim)] group-hover:text-[var(--color-text-primary)]'}`}>
        {label}
      </span>
    )}

    {collapsed && (
       <div className="absolute left-[120%] px-3 py-2 bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] rounded-lg text-[12px] font-medium text-[var(--color-text-primary)] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none z-50 shadow-2xl">
         {label}
       </div>
    )}
  </div>
);

const SidebarContent = ({ isCollapsed, currentPath, onNavigate, onLogout }) => {
  const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/contact_person/dashboard' },
      { id: 'visit-requests', label: 'Visit Requests', icon: CalendarDays, path: '/contact_person/visit-requests' },
      { id: 'inbox', label: 'Requests Inbox', icon: Inbox, path: '/contact_person/requests-inbox' },
      { id: 'all-visitors', label: 'All Visitors', icon: Inbox, path: '/contact_person/all-visitors' },
  ];

  return (
    <Box className="h-full flex flex-col pt-10 p-4 bg-[var(--color-bg-paper)] border-r border-[var(--color-border-soft)]">
      {/* Sidebar Top: Logo */}
      <div className={`mb-12 flex items-center ${isCollapsed ? 'justify-center' : 'px-4 gap-3'}`}>
         <img src="/logo_mas.png" alt="Logo" className={`${isCollapsed ? 'h-5' : 'h-5'} w-auto transition-all duration-500`} />
         {!isCollapsed && <span className="text-[var(--color-text-primary)] font-medium tracking-tighter text-sm flex-none uppercase animate-fade-in">Contact <span className="text-primary">Portal</span></span>}
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={currentPath === item.path}
            onClick={() => onNavigate(item.path)}
            collapsed={isCollapsed}
          />
        ))}
      </nav>

      {/* Sidebar Bottom: User & Logout */}
      <div className={`mt-auto pt-6 border-t border-[var(--color-border-soft)]`}>
        <button
          onClick={onLogout}
          className={`w-full mb-4 flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--color-border-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-primary/40 hover:bg-[var(--color-surface-1)] transition-all ${isCollapsed ? 'justify-center' : ''}`}
          title="Logout"
        >
          <LogOut size={16} />
          {!isCollapsed && <span className="uppercase text-[12px] tracking-[0.2em] font-medium">Logout</span>}
        </button>

        <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
            <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] flex items-center justify-center shrink-0">
                <span className="text-primary font-medium text-xs">SA</span>
            </div>
            {!isCollapsed && (
                <div className="animate-fade-in overflow-hidden">
                <p className="text-[var(--color-text-primary)] text-[13px] font-medium uppercase tracking-wider truncate">Sachi</p>
                <p className="text-[var(--color-text-dim)] text-[14px] uppercase tracking-widest truncate">Contact Person</p>
                </div>
            )}
        </div>
      </div>
    </Box>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const isCollapsed = useSelector(state => state.ui.isSidebarCollapsed);
  const isMobile = useSelector(state => state.ui.isMobile);
  const isMobileMenuOpen = useSelector(state => state.ui.isMobileMenuOpen);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) {
      dispatch(setMobileMenu(false));
    }
  };

  const handleLogout = () => {
    const shouldLogout = window.confirm('Are you sure you want to logout?');
    if (!shouldLogout) return;

    localStorage.removeItem('user_session');
    dispatch({ type: LOGOUT });
    navigate('/login');
  };

  // Mobile Version stays as a drawer
  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={() => dispatch(setMobileMenu(false))}
        PaperProps={{ sx: { width: 280, border: 'none' } }}
      >
        <SidebarContent 
          isCollapsed={false} 
          currentPath={location.pathname} 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      </Drawer>
    );
  }

  // Desktop version
  return (
    <aside 
      className={`flex-none relative h-screen transition-[width] duration-500 ease-in-out z-40 bg-[var(--color-bg-paper)] border-r border-[var(--color-border-soft)]
        ${isCollapsed ? 'w-24' : 'w-72'}`}
    >
      <SidebarContent 
        isCollapsed={isCollapsed} 
        currentPath={location.pathname} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Floating Toggle Button */}
      <IconButton 
        onClick={() => dispatch(toggleSidebar())}
        className="absolute -right-4 top-24 bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] text-primary hover:bg-primary hover:text-white transition-all shadow-xl z-50 p-1 rounded-full"
        size="small"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </IconButton>
    </aside>
  );
};

export default Sidebar;
