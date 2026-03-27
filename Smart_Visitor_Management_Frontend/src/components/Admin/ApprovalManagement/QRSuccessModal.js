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
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[151]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0F0F10] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare size={20} className="text-[#00B14F]" />
                  <h2 className="text-white uppercase tracking-wider text-sm font-medium">Approval Concluded</h2>
                </div>
              </div>
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-32 h-32 bg-white flex items-center justify-center p-2 mb-6 shadow-[0_0_20px_rgba(0,177,79,0.15)] rounded">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${visitorData?.id || 'MAS-APPROVED'}`} 
                    alt="Generated QR" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-[#00B14F] uppercase tracking-widest text-lg font-medium">Clearance Granted</h3>
                  <p className="text-white uppercase text-sm font-medium">{visitorData?.name}</p>
                  <p className="text-mas-text-dim text-xs leading-relaxed mt-2 uppercase">
                    The QR Code and encrypted approval message have been successfully dispatched to the Contact Person ({visitorData?.contactPerson}).
                  </p>
                </div>
              </div>
              <div className="p-6 border-t border-white/5 bg-[#121212]">
                <button 
                  onClick={onClose}
                  className="w-full py-3 bg-white text-black hover:bg-[#00B14F] hover:text-white uppercase tracking-wider text-sm transition-all duration-300 font-medium"
                >
                  Acknowledge & Close
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
