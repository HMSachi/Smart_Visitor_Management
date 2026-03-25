import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  QrCode, 
  ShieldAlert, 
  UserX, 
  FileText, 
  Users 
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <div 
    className={`mas-sidebar-item ${active ? 'active' : ''}`}
    onClick={onClick}
  >
    <div className={`p-2 transition-all ${active ? 'text-white' : 'text-mas-text-dim group-hover:text-mas-red'}`}>
      <Icon size={18} strokeWidth={2} />
    </div>
    <span className={`text-[11px] font-black tracking-[0.15em] uppercase transition-all ${active ? 'text-white' : 'text-mas-text-dim group-hover:text-white'}`}>
      {label}
    </span>
  </div>
);

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'approvals', label: 'Approval Management', icon: CheckSquare },
    { id: 'qrcode', label: 'QR Code Management', icon: QrCode },
    { id: 'security', label: 'Security Monitoring', icon: ShieldAlert },
    { id: 'blacklist', label: 'Blacklist Management', icon: UserX },
    { id: 'reports', label: 'Reports & Logs', icon: FileText },
    { id: 'users', label: 'User Management', icon: Users },
  ];

  return (
    <div className="w-72 h-screen fixed left-0 top-0 bg-mas-dark border-r border-mas-border flex flex-col z-50">
      <div className="p-8 border-b border-mas-border">
        <div className="flex items-center gap-4">
          <img 
            src="/logo_mas.png" 
            alt="MAS Logo" 
            className="h-10 w-auto"
          />
          <div className="h-8 w-[1px] bg-mas-border mx-1"></div>
          <div>
            <h1 className="text-xl font-bold tracking-[0.2em] text-white">MAS</h1>
            <p className="text-[10px] tracking-[0.3em] text-mas-text-dim uppercase">Visitor Management</p>
          </div>
        </div>
      </div>

      <div className="flex-1 py-8 overflow-y-auto">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeTab === item.id}
            onClick={() => setActiveTab(item.id)}
          />
        ))}
      </div>

      <div className="p-6 border-t border-mas-border">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-mas-gray flex items-center justify-center border border-mas-border">
            <span className="text-xs font-bold text-mas-red">JD</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-white">John Doe</p>
            <p className="text-[10px] text-mas-text-dim uppercase">Senior Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
