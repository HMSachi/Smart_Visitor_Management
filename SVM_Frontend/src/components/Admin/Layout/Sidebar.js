import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, 
  CheckSquare, 
  ShieldAlert, 
  UserX, 
  FileText, 
  Users,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserPlus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Drawer, Box, IconButton, Tooltip } from '@mui/material';
import { toggleSidebar, setMobileMenu } from '../../../reducers/uiSlice';

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <div 
    className={`flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-all duration-500 rounded-xl mb-2 group relative
      ${active ? 'bg-primary shadow-[0_0_20px_rgba(200,16,46,0.2)]' : 'hover:bg-white/[0.03]'}
      ${collapsed ? 'justify-center px-2' : ''}`}
    onClick={onClick}
  >
    <div className={`transition-transform duration-500 ${active ? 'text-white' : 'text-gray-500 group-hover:text-primary group-hover:scale-110'}`}>
      <Icon size={20} strokeWidth={active ? 2.5 : 2} />
    </div>
    
    {!collapsed && (
      <span className={`uppercase text-[13px] font-medium tracking-[0.2em] transition-all duration-500 ${active ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
        {label}
      </span>
    )}

    {collapsed && (
       <div className="absolute left-[120%] px-3 py-2 bg-background-paper border border-white/10 rounded-lg text-[12px] font-medium text-white uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all pointer-events-none z-50 shadow-2xl">
         {label}
       </div>
    )}
  </div>
);

const SidebarContent = ({ isCollapsed, currentPath, onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'approvals', label: 'Approvals', icon: CheckSquare, path: '/admin/approval-management' },
    { id: 'security', label: 'Monitor', icon: ShieldAlert, path: '/admin/security-monitoring' },
    { id: 'blacklist', label: 'Blacklist', icon: UserX, path: '/admin/blacklist-management' },
    { id: 'reports', label: 'Reports', icon: FileText, path: '/admin/reports-logs' },
    { id: 'users', label: 'System Users', icon: Users, path: '/admin/user-management' },
    { id: 'all-users', label: 'All Users', icon: UserPlus, path: '/admin/all-users' },
  ];

  return (
    <Box className="h-full flex flex-col p-4 bg-mas-dark/95 border-r border-white/10">
      {/* Sidebar Top: Logo */}
      <div className={`mb-12 flex items-center ${isCollapsed ? 'justify-center' : 'px-4 gap-3'}`}>
         <img src="/logo_mas.png" alt="Logo" className={`${isCollapsed ? 'h-5' : 'h-5'} w-auto transition-all duration-500`} />
         {!isCollapsed && <span className="text-white font-medium tracking-tighter text-sm flex-none uppercase animate-fade-in">Admin <span className="text-primary">Panel</span></span>}
      </div>

      <nav className="flex-1">
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
      <div className={`mt-auto pt-6 border-t border-white/5`}>
        <div className={`flex items-center gap-4 ${isCollapsed ? 'justify-center' : 'px-2'}`}>
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-medium text-xs">JD</span>
            </div>
            {!isCollapsed && (
                <div className="animate-fade-in overflow-hidden">
                    <p className="text-white text-[13px] font-medium uppercase tracking-wider truncate">Samith</p>
                    <p className="text-gray-500 text-[14px] uppercase tracking-widest truncate">System Admin</p>
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
        />
      </Drawer>
    );
  }

  // Desktop version
  return (
    <aside 
      className={`flex-none relative h-screen transition-[width] duration-500 ease-in-out z-40 bg-mas-dark/95 border-r border-white/10
        ${isCollapsed ? 'w-24' : 'w-72'}`}
    >
      <SidebarContent 
        isCollapsed={isCollapsed} 
        currentPath={location.pathname} 
        onNavigate={handleNavigate} 
      />

      {/* Floating Toggle Button */}
      <IconButton 
        onClick={() => dispatch(toggleSidebar())}
        className="absolute -right-4 top-24 bg-background-paper border border-white/10 text-primary hover:bg-primary hover:text-white transition-all shadow-xl z-50 p-1 rounded-full"
        size="small"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </IconButton>
    </aside>
  );
};

export default Sidebar;
