import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ShieldAlert, MapPin, Eye, CheckCircle } from 'lucide-react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const AlertItem = ({ type, location, time, severity }) => (
  <div className="p-4 border border-mas-border bg-mas-dark hover:border-primary transition-all group">
    <div className="flex justify-between items-start mb-2">
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2">
        <ShieldAlert size={16} className={severity === 'high' ? 'text-primary animate-pulse' : 'text-yellow-500'} />
        <span className="capitalize text-white">{type}</span>
      </div>
      <span className="text-gray-300 capitalize">{time}</span>
    </div>
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2 mb-3">
      <MapPin size={12} className="text-gray-300" />
      <span className="text-gray-300 capitalize">{location}</span>
    </div>
    <div className="flex flex-col md:flex-row gap-4 md:gap-2">
      <button className="flex-1 bg-mas-gray capitalize py-1.5 border border-mas-border hover:border-primary hover:text-white transition-all">
        Investigate
      </button>
      <button className="px-3 bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white transition-all">
        <CheckCircle size={14} />
      </button>
    </div>
  </div>
);

const SecurityMonitoring = () => {
  const alerts = useSelector(state => state.admin.monitoring.alerts);
  const zoneCoordinates = useMemo(
    () => ({
      'SERVER ROOM - LEVEL 2': [6.9273, 79.8612],
      'MAIN ENTRANCE GATE': [6.9282, 79.8623],
      'PRODUCTION BLOCK B': [6.9264, 79.8601],
    }),
    []
  );

  const alertPoints = useMemo(
    () =>
      (alerts || []).map((alert, index) => ({
        ...alert,
        position: zoneCoordinates[alert.location] || [6.9271 + index * 0.0007, 79.8615 + index * 0.0007],
      })),
    [alerts, zoneCoordinates]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 mas-panel min-h-[400px] relative overflow-hidden group border-white/[0.05]">
        <div className="absolute inset-0 bg-secondary/10 z-10 pointer-events-none"></div>
        <div className="absolute top-6 left-6 z-[500] pointer-events-none">
          <h2 className="capitalize text-white">Monitoring Map</h2>
          <p className="text-gray-300 capitalize mt-1">Track visitors in real-time</p>
        </div>

        <div className="absolute inset-0">
          <MapContainer
            center={[6.9275, 79.8614]}
            zoom={16}
            className="h-full w-full"
            scrollWheelZoom
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {alertPoints.map((alert, idx) => (
              <Marker key={`${alert.location}-${idx}`} position={alert.position}>
                <Popup>
                  <div>
                    <strong>{alert.type}</strong>
                    <br />
                    {alert.location}
                    <br />
                    Time: {alert.time}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-gray-200 capitalize tracking-widest text-[11px]">
              Scanning live zones...
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 z-[500] flex flex-col md:flex-row gap-4 md:gap-2">
          <button className="p-2 mas-glass hover:text-primary transition-all border border-mas-border">
            <Eye size={16} />
          </button>
          <button className="mas-button-primary py-1 px-4">Expand view</button>
        </div>
      </div>

      <div className="mas-panel flex flex-col h-full border-white/[0.05]">
        <div className="p-6 border-b border-mas-border flex justify-between items-center bg-mas-dark/50">
          <h2 className="capitalize text-white">Live Alerts</h2>
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--color-primary)]"></span>
        </div>
        <div className="p-4 space-y-4 overflow-y-auto flex-1 h-[320px]">
          {alerts.map((alert, i) => (
            <AlertItem key={i} {...alert} />
          ))}
        </div>
        <div className="p-4 border-t border-mas-border bg-mas-dark/30 text-center">
          <button className="capitalize text-gray-300 hover:text-white transition-all underline">
            View all security logs
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityMonitoring;
