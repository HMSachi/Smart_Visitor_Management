import React from 'react';
import { QrCode, Share2, Scan, Database, Shield } from 'lucide-react';

const QRCodeManagement = () => {
  return (
    <div className="mas-glass h-full p-8 flex flex-col border-white/5">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="capitalize text-white">QR Clearance Node</h2>
          <p className="text-gray-300 capitalize mt-2">Secure Token Generation & Verification</p>
        </div>
        <div className="w-12 h-12 bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Shield size={24} strokeWidth={2.5} />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center border-y border-white/5 py-12 mb-8 bg-white/[0.01]">
        <div className="w-56 h-56 bg-white flex items-center justify-center p-4 relative group cursor-pointer shadow-[0_0_50px_rgba(255,255,255,0.05)]">
          <QrCode size={180} className="text-secondary" strokeWidth={1.5} />
          <div className="absolute inset-0 border-2 border-primary opacity-0 group-hover:opacity-100 transition-all duration-500 scale-105"></div>
          
          {/* Corner accents */}
          <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-primary"></div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-primary"></div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-primary"></div>
        </div>
        
        <p className="mt-8 text-white capitalize">Node: MAS-HQ-SEC-01</p>
        <p className="mt-2 text-gray-300 capitalize">Valid for next 12 hours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="mas-button-primary flex items-center justify-center gap-3">
          <Scan size={16} strokeWidth={3} /> Re-Gen
        </button>
        <button className="mas-button-outline flex items-center justify-center gap-3">
          <Share2 size={16} strokeWidth={3} /> Print
        </button>
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between text-gray-300">
        <div className="flex items-center gap-3">
          <Database size={14} />
          <span className="capitalize">Logs Syncing...</span>
        </div>
        <span className="capitalize text-green-500">Secure</span>
      </div>
    </div>
  );
};

export default QRCodeManagement;
