import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare } from 'lucide-react';

const QRSuccessModal = ({ isOpen, onClose, visitorData }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150]"
            onClick={onClose}
          />
          <div className="fixed inset-0 flex items-center justify-center p-6 z-[151]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-lg bg-[#161618]/95 backdrop-blur-3xl border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,1)] rounded-[48px] overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="p-8 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center rounded-xl shadow-lg">
                    <CheckSquare size={20} />
                  </div>
                  <div>
                    <p className="text-gray-300/90 text-[13px] font-medium uppercase tracking-widest mb-1">Security Protocol Concluded</p>
                    <h2 className="text-white text-lg font-bold uppercase tracking-widest">Clearance Granted</h2>
                  </div>
                </div>
              </div>

              <div className="p-4 md:p-10 flex flex-col items-center justify-center text-center relative z-10">
                <div className="relative group/qr">
                  <div className="absolute inset-0 bg-green-500/20 blur-[30px] rounded-full opacity-0 group-hover/qr:opacity-100 transition-opacity duration-1000"></div>
                  <div className="relative w-40 h-40 bg-white p-4 mb-8 shadow-[0_0_40px_rgba(0,177,79,0.1)] rounded-2xl group-hover/qr:scale-105 transition-transform duration-700">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${visitorData?.id || 'MAS-APPROVED'}`}
                      alt="Generated QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-300/80 text-[13px] font-medium uppercase tracking-widest">Authorized Identity</p>
                  <p className="text-white text-lg font-medium uppercase tracking-widest flex items-center justify-center gap-3">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22C55E]"></div>
                    {visitorData?.name}
                  </p>
                  <div className="h-[1px] w-16 bg-white/10 mx-auto my-4"></div>
                  <p className="text-gray-300/90 text-[13px] font-medium leading-relaxed uppercase tracking-widest max-w-sm">
                    Digital passport and encrypted auth credentials dispatched to unit controller:
                    <span className="text-gray-300/80 ml-1">({visitorData?.contactPerson})</span>
                  </p>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-white/[0.01] relative z-10">
                <button
                  onClick={onClose}
                  className="w-full py-3.5 bg-white text-black hover:bg-green-500 hover:text-white text-xs font-medium uppercase tracking-widest rounded-xl transition-all duration-500 shadow-xl active:scale-[0.98]"
                >
                  Confirm & Synchronize
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QRSuccessModal;
