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
              className="w-full max-w-xl bg-[#0A0A0B]/95 backdrop-blur-3xl border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] rounded-[40px] pointer-events-auto overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-mas-red/5 rounded-full blur-[100px] pointer-events-none"></div>

              {/* Header */}
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.01] relative z-10">
                <div className="flex items-center gap-5">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${type === 'Approve' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-mas-red/10 border-mas-red/20 text-mas-red'}`}>
                    {type === 'Approve' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                  </div>
                  <div>
                    <p className="text-mas-text-dim/40 text-[9px] font-black uppercase tracking-[0.4em] mb-1 italic">Administrative_Final_Review</p>
                    <h2 className="text-white text-xl font-black uppercase tracking-widest italic">
                      {type === 'Approve' ? 'Confirm Authorization' : 'Deny Access Protocol'}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-mas-text-dim/40 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-10 space-y-10 relative z-10">
                <div className="p-8 bg-[#121214] border border-white/5 rounded-[24px] shadow-inner flex justify-between items-center group/target hover:border-mas-red/20 transition-all duration-500">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-6 bg-mas-red/40 group-hover:bg-mas-red rounded-full transition-all"></div>
                    <div>
                      <p className="text-mas-text-dim/20 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Target_Subject_Identity</p>
                      <p className="text-white text-sm font-black uppercase tracking-widest group-hover:text-mas-red transition-colors">{visitor?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-mas-text-dim/20 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Reg_Batch_ID</p>
                    <p className="text-mas-text-dim text-[10px] font-mono italic">{visitor?.id || visitor?.batchId}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-mas-text-dim/40 uppercase text-[9px] font-black tracking-[0.3em] flex items-center gap-3">
                      <Send size={12} className="text-mas-red/40" />
                      Protocol Feedback {type === 'Reject' && <span className="text-mas-red animate-pulse">*</span>}
                    </label>
                    {error && (
                      <span className="text-mas-red text-[9px] font-black uppercase animate-pulse flex items-center gap-2 tracking-widest">
                        <AlertCircle size={10} /> REQUIRED_FOR_DENIAL
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
                    placeholder={type === 'Approve' ? "APPEND AUTHORIZATION REMARKS (OPTIONAL)..." : "SPECIFY REFUSAL RATIONALE (MANDATORY_FIELD)..."}
                    className={`w-full bg-[#0A0A0B] border border-white/5 text-white text-[11px] font-black tracking-widest p-6 rounded-[24px] focus:ring-0 focus:border-mas-red/40 focus:bg-[#161618] transition-all duration-500 resize-none shadow-inner placeholder:text-mas-text-dim/20 ${error ? 'border-mas-red/50 bg-mas-red/5' : ''}`}
                  />
                </div>

                {/* Footer Actions */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-16 border border-white/5 text-mas-text-dim/40 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white hover:border-mas-red/40 hover:bg-white/[0.02] transition-all rounded-[20px] shadow-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-[1.5] h-16 ${type === 'Approve' ? 'bg-[#00B14F] shadow-[0_10px_30px_rgba(0,177,79,0.2)]' : 'bg-mas-red shadow-[0_10px_30px_rgba(200,16,46,0.2)]'} text-white text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 rounded-[20px] transition-all hover:scale-[1.02] active:scale-[0.98] group`}
                  >
                    {type === 'Approve' ? 'Commit Authorization' : 'Commit Denial Protocol'}
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
