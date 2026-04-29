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
import VisitRequestService from "../../../services/VisitRequestService";
import {
  updateField,
  setStatus,
  setRequestId,
  setSubmitting,
  setError,
} from "../../../reducers/visitorSlice";
import { validateName, validateNIC, validatePhone, validateEmail } from "../../../utils/validation";

const Step1Main = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.visitor);
  const { isSubmitting, requestId, error: reduxError } = formData;
  const user = useSelector((state) => state.login.user);
  const userEmail = user?.ResultSet?.[0]?.VA_Email;

  const [formErrors, setFormErrors] = useState({});
  const [visitorRecord, setVisitorRecord] = useState(null);
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

    // Custom validations from utility
    if (!errors.fullName) {
      const err = validateName(formData.fullName);
      if (err) errors.fullName = err;
    }

    if (!errors.nic) {
      const err = validateNIC(formData.nic);
      if (err) errors.nic = err;
    }

    if (!errors.phoneNumber) {
      const err = validatePhone(formData.phoneNumber);
      if (err) errors.phoneNumber = err;
    }

    if (!errors.emailAddress) {
      const err = validateEmail(formData.emailAddress);
      if (err) errors.emailAddress = err;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (requestId) {
      navigate("/request-step-2");
      return;
    }

    setShowError(false);
    dispatch(setSubmitting(true));

    try {
      const payload = {
        VVR_Visitor_id: visitorRecord?.VV_Visitor_id,
        VVR_Contact_person_id: visitorRecord?.VV_Contact_person_id || "4",
        VVR_Visit_Date: formData.proposedVisitDate,
        VVR_Places_to_Visit: formData.visitingArea,
        VVR_Purpose: formData.purposeOfVisitation,
        VVR_Status: "PENDING",
      };

      console.log("AddVisitRequest Payload:", payload);
      const response = await dispatch(AddVisitRequest(payload));
      console.log("AddVisitRequest Raw Response:", response);

      // Extract ID logic...
      const findId = (obj) => {
        if (!obj || typeof obj !== "object") return null;
        const direct = obj.VVR_Request_id || obj["VVR Request id"] ||
                       obj.vvr_request_id || obj.requestId || obj.id || obj.VVR_ID;
        if (direct) return direct;
        if (obj.ResultSet) {
          const res = Array.isArray(obj.ResultSet) ? obj.ResultSet[0] : obj.ResultSet;
          const m = findId(res);
          if (m) return m;
        }
        for (const key of Object.keys(obj)) {
          if (key.toLowerCase().includes("id") && key.toLowerCase().includes("request") && !isNaN(obj[key]))
            return obj[key];
        }
        if (obj.data) return findId(obj.data);
        return null;
      };

      let resolvedId = findId(response);

      if (!resolvedId && visitorRecord?.VV_Visitor_id) {
        try {
          const listRes = await VisitRequestService.GetVisitRequestsByVisitor(
            visitorRecord.VV_Visitor_id
          );
          const allRequests = listRes?.data?.ResultSet || listRes?.data || [];
          if (Array.isArray(allRequests) && allRequests.length > 0) {
            const sorted = [...allRequests].sort(
              (a, b) => Number(b.VVR_Request_id) - Number(a.VVR_Request_id)
            );
            resolvedId = sorted[0]?.VVR_Request_id;
          }
        } catch (fallbackErr) {
          console.error("Fallback ID fetch failed:", fallbackErr);
        }
      }

      if (!resolvedId) {
        alert("Could not confirm your visit request. Please try again.");
        dispatch(setSubmitting(false));
        return;
      }

      dispatch(setRequestId(resolvedId));
      navigate("/request-step-2");

    } catch (err) {
      console.error("Submission error:", err);
      dispatch(setError(err.message || "Submission failed."));
      setShowError(true);
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  return (
    <div className="h-full min-h-0 flex flex-col max-w-5xl mx-auto px-4 sm:px-6 py-3 pb-10 text-white bg-black overflow-hidden relative">

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
