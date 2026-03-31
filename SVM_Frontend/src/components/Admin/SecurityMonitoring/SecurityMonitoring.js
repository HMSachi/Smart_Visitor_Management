import React from 'react';
import { useSelector } from 'react-redux';
import { ShieldAlert, MapPin, Eye, CheckCircle, Navigation } from 'lucide-react';

const AlertItem = ({ type, location, time, severity }) => (
  <div className="p-4 border border-mas-border bg-mas-dark hover:border-mas-red transition-all group">
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <ShieldAlert size={16} className={severity === 'high' ? 'text-mas-red animate-pulse' : 'text-yellow-500'} />
        <span className="uppercase text-white">{type}</span>
      </div>
      <span className="text-gray-300 uppercase">{time}</span>
    </div>
    <div className="flex items-center gap-2 mb-3">
      <MapPin size={12} className="text-gray-300" />
      <span className="text-gray-300 uppercase">{location}</span>
    </div>
    <div className="flex gap-2">
      <button className="flex-1 bg-mas-gray uppercase py-1.5 border border-mas-border hover:border-mas-red hover:text-white transition-all">
        Investigate
      </button>
      <button className="px-3 bg-mas-red/10 text-mas-red border border-mas-red/30 hover:bg-mas-red hover:text-white transition-all">
        <CheckCircle size={14} />
      </button>
    </div>
  </div>
);

const SecurityMonitoring = () => {
  const alerts = useSelector(state => state.admin.monitoring.alerts);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 mas-panel min-h-[400px] relative overflow-hidden group border-white/[0.05]">
        <div className="absolute inset-0 bg-mas-black/20 z-10 pointer-events-none"></div>
        <div className="absolute top-6 left-6 z-20">
          <h2 className="uppercase text-white">Zone Tracking Map</h2>
          <p className="text-gray-300 uppercase mt-1">Real-time visitor location monitoring</p>
        </div>
        
        {/* Mock Map Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d0e]">
          <div className="w-full h-full opacity-70 pointer-events-none">
             <div className="grid grid-cols-12 h-full w-full">
                {[...Array(144)].map((_, i) => (
                   <div key={i} className="border-[0.5px] border-mas-red/20"></div>
                ))}
             </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="relative w-[200px] h-[200px] border border-mas-red/10 transform rotate-45 flex items-center justify-center">
                <div className="absolute w-2 h-2 bg-mas-red animate-ping rounded-full"></div>
                <div className="w-2 h-2 bg-mas-red rounded-full"></div>
                <div className="absolute -top-4 -left-4 text-mas-red">
                  <Navigation size={24} className="-rotate-45" />
                </div>
             </div>
          </div>
          <p className="z-20 text-gray-300 uppercase animate-pulse">Scanning live zones...</p>
        </div>

        <div className="absolute bottom-6 right-6 z-20 flex gap-2">
          <button className="p-2 mas-glass hover:text-mas-red transition-all border border-mas-border">
            <Eye size={16} />
          </button>
          <button className="mas-button-primary py-1 px-4">Expand view</button>
        </div>
      </div>

      <div className="mas-panel flex flex-col h-full border-white/[0.05]">
        <div className="p-6 border-b border-mas-border flex justify-between items-center bg-mas-dark/50">
          <h2 className="uppercase text-white">Live Alerts</h2>
          <span className="w-2 h-2 bg-mas-red rounded-full animate-pulse shadow-[0_0_8px_#C8102E]"></span>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto flex-1 h-[320px]">
          {alerts.map((alert, i) => (
            <AlertItem key={i} {...alert} />
          ))}
        </div>
        <div className="p-4 border-t border-mas-border bg-mas-dark/30 text-center">
          <button className="uppercase text-gray-300 hover:text-white transition-all underline">
            View all security logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoring;
