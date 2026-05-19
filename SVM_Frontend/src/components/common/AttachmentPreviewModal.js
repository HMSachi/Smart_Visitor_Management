import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Download } from "lucide-react";
import VisitorAttachmentService from "../../services/VisitorAttachmentService";

const AttachmentPreviewModal = ({ previewData, onClose }) => {
  const { open, fileUrl, fileType, fileName, vatId, loading, error } = previewData || {};

  if (!open) return null;

  const isImage = fileType?.startsWith("image/");
  const isPdf = fileType === "application/pdf";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[var(--color-bg-paper)] border border-white/10 rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/20 flex-shrink-0 z-10">
            <div className="flex items-center gap-3 truncate">
              <div className="w-1.5 h-5 bg-primary rounded-full shrink-0" />
              <div className="min-w-0">
                <h2 className="text-[13px] font-semibold text-white tracking-wide truncate">
                  {fileName || "Document Preview"}
                </h2>
                <p className="text-[10px] text-white/40 tracking-widest mt-0.5 uppercase">
                  {isImage ? "Image Viewer" : isPdf ? "PDF Viewer" : "Document Viewer"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {vatId && (
                <button
                  onClick={() => VisitorAttachmentService.DownloadAttachment(vatId, fileName)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/25 transition-all text-[11px] font-medium"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Download</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"
                title="Close preview"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 bg-black/40 relative overflow-hidden flex items-center justify-center p-4">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-border-soft border-t-primary rounded-full animate-spin" />
                <p className="text-[11px] text-white/30 tracking-widest uppercase">Loading Preview...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center gap-3 text-red-400">
                <p className="text-[12px]">{error}</p>
              </div>
            ) : isImage ? (
              <img
                src={fileUrl}
                alt={fileName}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg border border-white/5"
              />
            ) : isPdf ? (
              <iframe
                src={`${fileUrl}#toolbar=0`}
                title={fileName}
                className="w-full h-full rounded-lg border border-white/5 bg-white"
              />
            ) : (
              <div className="flex flex-col items-center gap-4 text-white/50">
                <FileText size={48} className="text-white/20" />
                <p className="text-[12px] tracking-wide">
                  Preview not available for this file type.
                </p>
                <button
                  onClick={() => vatId && VisitorAttachmentService.DownloadAttachment(vatId, fileName)}
                  className="px-4 py-2 mt-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-all text-[12px] font-medium border border-primary/20"
                >
                  Download File Instead
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AttachmentPreviewModal;
