import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  CheckSquare,
  ShieldAlert,
  UserX,
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, Box, IconButton } from '@mui/material';
import { toggleSidebar, setMobileMenu } from '../../../reducers/uiSlice';
import { LOGOUT } from '../../../constants/LoginConstants';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { id: 'approvals', label: 'Approvals', icon: CheckSquare, path: '/admin/approval-management' },
  { id: 'security', label: 'Security Monitor', icon: ShieldAlert, path: '/admin/security-monitoring' },
  { id: 'blacklist', label: 'Restricted List', icon: UserX, path: '/admin/blacklist-management' },
  { id: 'all-users', label: 'All Users', icon: UserPlus, path: '/admin/all-users' },
];

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-300 mb-1 group relative text-left
      ${active
        ? 'bg-primary/15 border border-primary/25 text-primary shadow-[0_0_16px_rgba(200,16,46,0.12)]'
        : 'hover:bg-[var(--color-surface-2)] border border-transparent text-[var(--color-text-dim)] hover:text-[var(--color-text-primary)]'}
      ${collapsed ? 'justify-center px-2.5' : ''}`}
  >
    <div className={`shrink-0 transition-transform duration-300 ${!active && 'group-hover:scale-110'}`}>
      <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
    </div>

    {!collapsed && (
      <span className="text-[13.5px] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
        {label}
      </span>
    )}

    {/* Active indicator */}
    {active && !collapsed && (
      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
    )}

    {/* Collapsed tooltip */}
    {collapsed && (
      <div className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[var(--color-bg-elevated)] border border-[var(--color-border-medium)] rounded-lg text-[12px] font-semibold text-[var(--color-text-primary)] whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 shadow-xl transition-all duration-200 translate-x-1 group-hover:translate-x-0">
        {label}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[var(--color-border-medium)]" />
      </div>
    )}
  </button>
);

const SidebarContent = ({ isCollapsed, currentPath, onNavigate, onLogout, user }) => {
  const displayName = user?.ResultSet?.[0]?.VA_Name || user?.ResultSet?.[0]?.VCP_Name || 'Admin';
  const displayEmail = user?.ResultSet?.[0]?.VA_Email || user?.ResultSet?.[0]?.VCP_Email || '';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';

  return (
    <Box className="h-full flex flex-col" style={{ background: 'var(--color-bg-paper)', borderRight: '1px solid var(--color-border-soft)' }}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-[var(--color-border-soft)] ${isCollapsed ? 'justify-center' : ''}`}>
        <img
          src="/logo_mas.png"
          alt="MAS Logo"
          className="h-7 w-auto shrink-0 transition-all duration-300"
        />
        {!isCollapsed && (
          <div className="min-w-0 animate-fade-in">
            <p className="text-[var(--color-text-primary)] text-[13px] font-bold tracking-tight leading-tight">Admin Panel</p>
            <p className="text-primary text-[11px] font-medium tracking-wide">MAS Holdings</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar">
        {!isCollapsed && (
          <p className="text-[10.5px] uppercase font-semibold text-[var(--color-text-dim)] tracking-widest px-3 mb-3">
            Navigation
          </p>
        )}
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

      {/* User & Logout */}
      <div className="px-3 py-4 border-t border-[var(--color-border-soft)]">
        {/* Logout */}
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[var(--color-border-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-error)] hover:border-[var(--color-error)]/30 hover:bg-[var(--color-error)]/8 transition-all duration-300 mb-3 ${isCollapsed ? 'justify-center' : ''}`}
          title="Sign Out"
        >
          <LogOut size={17} className="shrink-0" />
          {!isCollapsed && <span className="text-[13px] font-medium">Sign Out</span>}
        </button>

        {/* User info */}
        <div className={`flex items-center gap-3 px-2 ${isCollapsed ? 'justify-center' : ''}`}>
          <div
            className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white text-[13px] font-bold"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), #8B0C1F)' }}
          >
            {initials}
          </div>
          {!isCollapsed && (
            <div className="min-w-0 animate-fade-in">
              <p className="text-[var(--color-text-primary)] text-[13px] font-semibold truncate">{displayName}</p>
              <p className="text-[var(--color-text-dim)] text-[11px] truncate">{displayEmail || 'System Administrator'}</p>
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
  const user = useSelector(state => state.login.user);
  const isCollapsed = useSelector(state => state.ui.isSidebarCollapsed);
  const isMobile = useSelector(state => state.ui.isMobile);
  const isMobileMenuOpen = useSelector(state => state.ui.isMobileMenuOpen);

  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) dispatch(setMobileMenu(false));
  };

  const handleLogout = () => {
    if (!window.confirm('Are you sure you want to sign out?')) return;
    localStorage.removeItem('user_session');
    dispatch({ type: LOGOUT });
    navigate('/login');
  };

  const contentProps = {
    isCollapsed: false,
    currentPath: location.pathname,
    onNavigate: handleNavigate,
    onLogout: handleLogout,
    user,
  };

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={isMobileMenuOpen}
        onClose={() => dispatch(setMobileMenu(false))}
        PaperProps={{ sx: { width: 280, border: 'none', background: 'transparent' } }}
      >
        <SidebarContent {...contentProps} />
      </Drawer>
    );
  }

  return (
    <aside
      className={`flex-none relative h-screen transition-[width] duration-500 ease-in-out z-40`}
      style={{ width: isCollapsed ? '72px' : '256px' }}
    >
      <SidebarContent {...contentProps} isCollapsed={isCollapsed} />

      {/* Toggle button */}
      <IconButton
        onClick={() => dispatch(toggleSidebar())}
        size="small"
        sx={{
          position: 'absolute',
          right: -14,
          top: 88,
          width: 28,
          height: 28,
          background: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border-medium)',
          color: 'var(--color-primary)',
          boxShadow: 'var(--shadow-card)',
          '&:hover': { background: 'var(--color-primary)', color: '#fff' },
          zIndex: 50,
        }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </IconButton>
    </aside>
  );
};

export default Sidebar;
