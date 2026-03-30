import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle } from 'lucide-react';

const ApprovalModal = ({ isOpen, onClose, visitor, type, onConfirm }) => {
  const [comment, setComment] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'Reject' && !comment.trim()) {
      setError(true);
      return;
    }
    onConfirm(visitor.id, type, comment);
    setComment('');
    setError(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-lg mas-glass border-mas-red/20 shadow-[0_0_50px_rgba(200,16,46,0.15)] pointer-events-auto"
            >
              {/* Header */}
              <div className="p-8 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.02]">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-[2px] bg-mas-red"></div>
                    <span className="text-mas-red uppercase">Protocol Authorization</span>
                  </div>
                  <h2 className="text-white uppercase">
                    {type === 'Approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                  </h2>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 text-mas-text-dim hover:text-white hover:bg-white/5 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div className="p-6 bg-white/[0.02] border border-white/[0.05]">
                  <p className="text-mas-text-dim uppercase mb-1">Target Subject</p>
                  <p className="text-white uppercase">{visitor?.name}</p>
                  <p className="text-mas-text-dim mt-1 opacity-60">ID: {visitor?.id}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-mas-text-dim uppercase">
                      Administrative Comments {type === 'Reject' && <span className="text-mas-red">*</span>}
                    </label>
                    {error && (
                      <span className="text-mas-red uppercase animate-pulse flex items-center gap-2">
                        <AlertCircle size={10} /> REQUIRED FOR REJECTION
                      </span>
                    )}
                  </div>
                  <textarea
                    rows="4"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      if (e.target.value.trim()) setError(false);
                    }}
                    placeholder={type === 'Approve' ? "ENTER OPTIONAL APPROVAL NOTES..." : "PROVIDE REASON FOR REJECTION (MANDATORY)..."}
                    className={`mas-input w-full resize-none p-4 ${error ? 'border-mas-red/50' : ''}`}
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-8 py-4 border border-mas-border uppercase text-mas-text-dim hover:text-white hover:border-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-8 py-4 ${type === 'Approve' ? 'bg-green-600 hover:bg-green-500' : 'bg-mas-red hover:bg-red-500'} text-white uppercase flex items-center justify-center gap-3 transition-all animate-shine overflow-hidden group`}
                  >
                    {type === 'Approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                    <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ApprovalModal;
