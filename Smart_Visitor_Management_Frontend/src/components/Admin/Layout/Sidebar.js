import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  ShieldAlert, 
  UserX, 
  FileText, 
  Users 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    className={`mas-sidebar-item group ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    <div className={`p-2 transition-all ${active ? 'text-white' : 'text-mas-text-dim group-hover:text-mas-red'}`}>
      <Icon size={18} strokeWidth={2} />
    </div>
    <span className={`uppercase transition-all text-xs font-semibold tracking-wider ${active ? 'text-white' : 'text-mas-text-dim group-hover:text-white'}`}>
      {label}
    </span>
  </div>
);

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'approvals', label: 'Approval Management', icon: CheckSquare, path: '/admin/approval-management' },
    { id: 'security', label: 'Security Monitoring', icon: ShieldAlert, path: '/admin/security-monitoring' },
    { id: 'blacklist', label: 'Blacklist Management', icon: UserX, path: '/admin/blacklist-management' },
    { id: 'reports', label: 'Reports & Logs', icon: FileText, path: '/admin/reports-logs' },
    { id: 'users', label: 'User Management', icon: Users, path: '/admin/user-management' },
  ];

  return (
    <div className="w-72 h-screen fixed left-0 top-0 bg-[#0F0F10] border-r border-white/5 flex flex-col z-50">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-4">
          <img 
            src="/logo_mas.png" 
            alt="MAS Logo" 
            className="h-10 w-auto"
          />
          <div className="h-8 w-[1px] bg-white/10 mx-1"></div>
          <div>
            <h1 className="text-white font-bold tracking-tighter text-xl">MAS</h1>
            <p className="text-mas-text-dim uppercase text-[10px] tracking-widest font-medium">Visitor Management</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-8 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      <div className="p-6 border-t border-white/5 bg-[#0A0A0B]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-white/5 flex items-center justify-center border border-white/10 rounded-sm">
            <span className="text-mas-red font-bold text-xs">JD</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold">Samith</p>
            <p className="text-mas-text-dim uppercase text-[9px] tracking-widest font-medium">Senior Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
