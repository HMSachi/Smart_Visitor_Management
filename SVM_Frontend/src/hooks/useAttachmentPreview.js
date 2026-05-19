import { useState, useCallback } from "react";
import VisitorAttachmentService from "../services/VisitorAttachmentService";

export const useAttachmentPreview = () => {
  const [previewData, setPreviewData] = useState({
    open: false,
    fileUrl: null,
    fileType: null,
    fileName: null,
    vatId: null,
    loading: false,
  });

  const openPreview = useCallback(async (vatId, fallbackName) => {
    setPreviewData({
      open: true,
      fileUrl: null,
      fileType: null,
      fileName: fallbackName,
      vatId,
      loading: true,
    });
    try {
      const data = await VisitorAttachmentService.GetAttachmentPreviewData(vatId);
      setPreviewData({
        open: true,
        fileUrl: data.blobUrl,
        fileType: data.fileType,
        fileName: data.fileName || fallbackName,
        vatId,
        loading: false,
      });
    } catch (err) {
      console.error("Failed to load preview:", err);
      setPreviewData((prev) => ({
        ...prev,
        loading: false,
        error: "Failed to load preview",
      }));
    }
  }, []);

  const closePreview = useCallback(() => {
    setPreviewData((prev) => {
      if (prev.fileUrl) {
        window.URL.revokeObjectURL(prev.fileUrl);
      }
      return {
        open: false,
        fileUrl: null,
        fileType: null,
        fileName: null,
        vatId: null,
        loading: false,
      };
    });
  }, []);

  return { previewData, openPreview, closePreview };
};
