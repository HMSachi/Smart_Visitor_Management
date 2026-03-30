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
              className="w-full max-w-lg bg-[#0A0A0B]/95 backdrop-blur-3xl border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] rounded-[48px] overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-green-500/40 to-transparent"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="p-10 border-b border-white/5 flex items-center justify-between relative z-10 bg-white/[0.01]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 text-green-500 flex items-center justify-center rounded-2xl shadow-lg">
                    <CheckSquare size={24} />
                  </div>
                  <div>
                    <p className="text-mas-text-dim/40 text-[9px] font-black uppercase tracking-[0.4em] mb-1 italic">Security_Protocol_Concluded</p>
                    <h2 className="text-white text-xl font-black uppercase tracking-widest italic">Clearance Granted</h2>
                  </div>
                </div>
              </div>

              <div className="p-12 flex flex-col items-center justify-center text-center relative z-10">
                <div className="relative group/qr">
                  <div className="absolute inset-0 bg-green-500/20 blur-[30px] rounded-full opacity-0 group-hover/qr:opacity-100 transition-opacity duration-1000"></div>
                  <div className="relative w-48 h-48 bg-white p-4 mb-10 shadow-[0_0_40px_rgba(0,177,79,0.1)] rounded-[32px] group-hover/qr:scale-105 transition-transform duration-700">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${visitorData?.id || 'MAS-APPROVED'}`}
                      alt="Generated QR"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-mas-text-dim/20 text-[10px] font-black uppercase tracking-[0.4em]">Authorized_Identity</p>
                  <p className="text-white text-xl font-black uppercase tracking-widest italic flex items-center justify-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22C55E]"></div>
                    {visitorData?.name}
                  </p>
                  <div className="h-[1px] w-24 bg-white/5 mx-auto my-6"></div>
                  <p className="text-mas-text-dim/40 text-[10px] font-black leading-loose uppercase tracking-widest max-w-sm">
                    DIGITAL_PASSPORT_AND_ENCRYPTED_AUTH_CREDENTIALS_DISPATCHED_TO_UNIT_CONTROLLER:
                    <span className="text-mas-text-dim/80 ml-2 italic">({visitorData?.contactPerson})</span>
                  </p>
                </div>
              </div>

              <div className="p-10 border-t border-white/5 bg-white/[0.01] relative z-10">
                <button
                  onClick={onClose}
                  className="w-full h-18 bg-white text-black hover:bg-green-500 hover:text-white text-[11px] font-black uppercase tracking-[0.4em] rounded-[24px] transition-all duration-500 shadow-2xl active:scale-[0.98]"
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
