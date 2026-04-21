import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';

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
          <div className="fixed inset-0 flex items-center justify-center p-6 z-[101] pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-xl bg-[#161618]/95 backdrop-blur-3xl border border-white/20 shadow-[0_30px_100px_rgba(0,0,0,1)] rounded-[40px] pointer-events-auto overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

              {/* Header */}
              <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.01] relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${type === 'Approve' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-primary/10 border-primary/20 text-primary'}`}>
                    {type === 'Approve' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  </div>
                  <div>
                    <p className="text-gray-300/90 text-[13px] font-medium capitalize tracking-widest mb-1">Management Final Review</p>
                    <h2 className="text-white text-lg font-bold capitalize tracking-widest">
                      {type === 'Approve' ? 'Approve Entry' : 'Reject Entry Request'}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-300/90 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-8 space-y-4 md:space-y-8 relative z-10">
                <div className="p-6 bg-[var(--color-bg-paper)] border border-white/5 rounded-2xl shadow-inner flex justify-between items-center group/target hover:border-primary/20 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-primary/40 group-hover:bg-primary rounded-full transition-all"></div>
                    <div>
                      <p className="text-gray-300/80 text-[12px] font-medium capitalize tracking-widest mb-1">Visitor Name</p>
                      <p className="text-white text-sm font-medium capitalize tracking-widest group-hover:text-primary transition-colors">{visitor?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-300/80 text-[12px] font-medium capitalize tracking-widest mb-1">Reg Batch ID</p>
                    <p className="text-gray-300/90 text-[14px] font-mono tracking-wider">{visitor?.id || visitor?.batchId}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-gray-300/90 capitalize text-[13px] font-medium tracking-widest flex items-center gap-2">
                      <Send size={12} className="text-primary/40" />
                      Management Feedback {type === 'Reject' && <span className="text-primary animate-pulse">*</span>}
                    </label>
                    {error && (
                      <span className="text-primary text-[13px] font-medium capitalize animate-pulse flex items-center gap-1.5 tracking-widest">
                        <AlertCircle size={12} /> Required For Denial
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
                    placeholder={type === 'Approve' ? "Add notes (optional)..." : "Why is this request being rejected? (Mandatory field)..."}
                    className={`w-full bg-[var(--color-bg-default)] border border-white/5 text-white text-sm font-normal tracking-wide p-5 rounded-xl focus:ring-0 focus:border-primary/40 focus:bg-[#161618] transition-all duration-500 resize-none shadow-inner placeholder:text-gray-300/80 ${error ? 'border-primary/50 bg-primary/5' : ''}`}
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3.5 border border-white/5 text-gray-300/90 text-xs font-medium capitalize tracking-widest hover:text-white hover:border-primary/40 hover:bg-white/[0.02] transition-all rounded-xl shadow-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-[1.5] py-3.5 ${type === 'Approve' ? 'bg-[#00B14F] shadow-[0_5px_20px_rgba(0,177,79,0.2)]' : 'bg-primary shadow-[0_5px_20px_rgba(200,16,46,0.2)]'} text-white text-xs font-medium capitalize tracking-widest flex items-center justify-center gap-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] group`}
                  >
                    {type === 'Approve' ? 'Confirm Approval' : 'Confirm Rejection'}
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
