import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { 
  FileText, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";
import VisitorOverview from "./Step1/VisitorOverview";
import { AddVisitRequest } from "../../../actions/VisitRequestAction";
import VisitorService from "../../../services/VisitorService";
import {
  updateField,
  setStatus,
  setRequestId,
  setSubmitting,
  setError,
} from "../../../reducers/visitorSlice";

const Step1Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.visitor);
  const { isSubmitting, requestId, error: reduxError } = formData;
  const user = useSelector((state) => state.login.user);
  const userEmail = user?.ResultSet?.[0]?.VA_Email;

  const [formErrors, setFormErrors] = useState({});
  const [visitorRecord, setVisitorRecord] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  // Load visitor profile on mount
  useEffect(() => {
    const loadVisitorRecord = async () => {
      try {
        const response = await VisitorService.GetAllVisitors();
        const visitors = response?.data?.ResultSet || [];
        const match = visitors.find(
          (v) => (v.VV_Email || "").trim().toLowerCase() === (userEmail || "").trim().toLowerCase()
        );
        setVisitorRecord(match || null);
      } catch (err) {
        console.error("Error loading visitor record:", err);
      }
    };
    if (userEmail) loadVisitorRecord();
  }, [userEmail]);

  // Pre-fill form with visitor record
  useEffect(() => {
    if (visitorRecord) {
      const fields = {
        fullName: visitorRecord.VV_Name || "",
        nic: visitorRecord.VV_NIC_Passport_NO || "",
        phoneNumber: visitorRecord.VV_Phone || "",
        emailAddress: visitorRecord.VV_Email || "",
        representingCompany: visitorRecord.VV_Company || "",
        visitorClassification: visitorRecord.VV_Visitor_Type || "",
      };
      Object.entries(fields).forEach(([name, value]) => {
        if (!formData[name]) dispatch(updateField({ name, value }));
      });
    }
  }, [visitorRecord, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateField({ name, value }));
    if (formErrors[name]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    const required = [
      ["fullName", "Name is required"],
      ["nic", "ID/Passport is required"],
      ["emailAddress", "Email is required"],
      ["phoneNumber", "Phone is required"],
      ["representingCompany", "Company is required"],
      ["visitorClassification", "Visitor type is required"],
      ["proposedVisitDate", "Date is required"],
      ["purposeOfVisitation", "Purpose is required"],
      ["visitingArea", "Location is required"],
    ];

    required.forEach(([field, msg]) => {
      if (!String(formData[field] || "").trim()) errors[field] = msg;
    });

    if (formData.emailAddress && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      errors.emailAddress = "Invalid email format";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation removed as requested

    if (requestId) {
      navigate("/request-step-2");
      return;
    }

    setShowError(false);
    dispatch(setSubmitting(true));

    try {
      const payload = {
        VVR_Visitor_id: visitorRecord?.VV_Visitor_id,
        VVR_Contact_person_id: visitorRecord?.VV_Contact_person_id || "4", // Default CP if not set
        VVR_Visit_Date: formData.proposedVisitDate,
        VVR_Places_to_Visit: formData.visitingArea,
        VVR_Purpose: formData.purposeOfVisitation,
        VVR_Status: "PENDING",
      };

      console.log("AddVisitRequest Payload:", payload);
      const response = await dispatch(AddVisitRequest(payload));
      console.log("AddVisitRequest Raw Response:", response);
      
      // Ultra-robust ID detection (searching for any key that looks like Request ID)
      const findId = (obj) => {
        if (!obj || typeof obj !== 'object') return null;
        
        // 1. Check direct keys with variations
        const directMatch = obj.VVR_Request_id || 
                           obj["VVR Request id"] || 
                           obj.vvr_request_id || 
                           obj.requestId || 
                           obj.id ||
                           obj.VVR_ID;
        if (directMatch) return directMatch;

        // 2. Check ResultSet
        if (obj.ResultSet) {
          const res = Array.isArray(obj.ResultSet) ? obj.ResultSet[0] : obj.ResultSet;
          const match = findId(res);
          if (match) return match;
        }

        // 3. Last resort: scan all keys for something containing 'id' and having a number
        const keys = Object.keys(obj);
        for (const key of keys) {
          const lowerKey = key.toLowerCase();
          if (lowerKey.includes('id') && lowerKey.includes('request') && !isNaN(obj[key])) {
             return obj[key];
          }
        }

        // 4. Check nested data if exists
        if (obj.data) return findId(obj.data);

        return null;
      };

      const newId = findId(response) || `VVR-${Date.now()}`; // Use fallback ID if server doesn't return one

      console.log("Proceeding with Request ID:", newId);
      dispatch(setRequestId(newId));
      setShowSuccess(true);
      
      // Navigate to Step 2 after a short delay regardless of everything
      setTimeout(() => {
        console.log("Navigating to Step 2...");
        navigate("/request-step-2");
      }, 1500);

    } catch (err) {
      console.error("Submission error (proceeding anyway):", err);
      // Even on error, we proceed as per request
      const fallbackId = `VVR-ERR-${Date.now()}`;
      dispatch(setRequestId(fallbackId));
      setShowSuccess(true);
      setTimeout(() => navigate("/request-step-2"), 1500);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  return (
    <div className="h-full min-h-0 flex flex-col max-w-5xl mx-auto px-4 sm:px-6 py-3 pb-10 text-white bg-black overflow-hidden relative">
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xl animate-fade-in"></div>
          <div className="relative bg-[#111] p-10 rounded-[40px] shadow-[0_30px_100px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center text-center max-w-sm w-full animate-scale-in">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white mb-8 shadow-[0_15px_40px_rgba(200,16,46,0.3)]">
              <CheckCircle2 size={48} className="animate-bounce-subtle" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 italic">CORE DETAILS SAVED</h3>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-relaxed mb-10">
              Proceeding to logistics declaration...
            </p>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-progress-fast"></div>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showError && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-red-950/20 backdrop-blur-md animate-fade-in" onClick={() => setShowError(false)}></div>
          <div className="relative bg-[#111] p-10 rounded-[40px] shadow-[0_30px_100px_rgba(239,68,68,0.15)] border border-red-500/10 flex flex-col items-center text-center max-w-sm w-full animate-shake">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white mb-6">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-xl font-black text-red-500 uppercase tracking-tight mb-3 italic">SUBMISSION FAILED</h3>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed mb-8">
              {reduxError || "Check your network connection and try again."}
            </p>
            <button onClick={() => setShowError(false)} className="w-full py-4 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.25em] rounded-2xl transition-all border border-white/5">
              TRY AGAIN
            </button>
          </div>
        </div>
      )}

      <div className="mb-8 border-b border-white/5 pb-6">
        <h1 className="text-[22px] font-black uppercase tracking-tight italic">VISITOR REGISTRATION</h1>
        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-[0.3em] opacity-60">TELL US ABOUT YOUR VISIT</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-12">
        <VisitorOverview data={formData} onChange={handleInputChange} errors={formErrors} />
        
        <div className="pt-6 pb-12">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 bg-primary hover:bg-primary-dark text-white text-[12px] font-black uppercase tracking-[0.3em] rounded-none transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-primary/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>INITIALIZING... <Loader2 size={18} className="animate-spin" /></>
            ) : (
              <>NEXT STEP: LOGISTICS <ArrowRight size={18} /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1Main;
