import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../../components/Contact_Person/Layout/Sidebar";
import Header from "../../../components/Contact_Person/Layout/Header";
import { 
  CheckCircle2, Printer, ArrowLeft, User, Calendar, MapPin, 
  HelpCircle, Car, Users, Package, Mail, Phone, Building, Hash
} from "lucide-react";
import { resetForm } from "../../../reducers/visitRequestFormSlice";

const SummaryItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-primary">
      <Icon size={14} />
    </div>
    <div className="flex flex-col gap-0.5 mt-0.5">
      <span className="text-[12px] font-normal text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-[12px] font-normal text-[#0A1D37] tracking-wide">{value || "N/A"}</span>
    </div>
  </div>
);

const VisitRequestSuccess = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { visitationDetails, selectedVisitorDetails, vehicles, people, items } = useSelector((state) => state.visitRequestForm);

  // If page is refreshed and state is lost, we could fetch from API, but for now we rely on the flow
  useEffect(() => {
    // If we don't have visitationDetails, something is wrong or refreshed
    if (!visitationDetails.VVR_Visitor_id) {
       // navigate("/contact_person/visit-requests");
    }
  }, [visitationDetails, navigate]);

  const handleDone = () => {
    dispatch(resetForm());
    navigate("/contact_person/visit-requests");
  };

  return (
    <div className="contact-theme-root flex bg-[#F8F9FA] overflow-hidden text-[#1A1A1A] h-screen w-full">
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] overflow-hidden">
        <Header title="Registration Success" />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="max-w-4xl mx-auto animate-fade-in-slow pb-10">
            
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="text-xl font-normal text-[#0A1D37] uppercase tracking-wide mb-2">Visit Registered Successfully</h1>
              <p className="text-[12px] font-normal text-gray-500 tracking-wide uppercase">Request ID: <span className="text-primary">#{requestId}</span></p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 space-y-8 max-w-5xl mx-auto">
              
              {/* Visitor Profile Section */}
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-gray-100">
                <div className="relative shrink-0">
                  <div className="w-24 h-24 rounded-full border-4 border-gray-50 overflow-hidden shadow-md bg-gray-100 flex items-center justify-center">
                    {selectedVisitorDetails?.VV_Image ? (
                      <img src={selectedVisitorDetails.VV_Image} alt="Visitor" className="w-full h-full object-cover" />
                    ) : (
                      <User size={36} className="text-gray-300" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-[3px] border-white rounded-full flex items-center justify-center text-white shadow-md">
                    <CheckCircle2 size={14} />
                  </div>
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-[16px] font-medium text-[#0A1D37] uppercase tracking-wide mb-1">{selectedVisitorDetails?.VV_Name || "Visitor"}</h2>
                  <p className="text-[12px] font-normal text-primary uppercase tracking-wide mb-4">{selectedVisitorDetails?.VV_Visitor_Type || "Guest"}</p>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 sm:gap-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-[12px] font-normal tracking-wide">{selectedVisitorDetails?.VV_Email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={14} className="text-gray-400" />
                      <span className="text-[12px] font-normal tracking-wide">{selectedVisitorDetails?.VV_Phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Building size={14} className="text-gray-400" />
                      <span className="text-[12px] font-normal tracking-wide">{selectedVisitorDetails?.VV_Company || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visitation Overview Section */}
              <div className="pb-8 border-b border-gray-100">
                <h3 className="text-[12px] font-medium text-[#0A1D37] uppercase tracking-wide mb-4 flex items-center gap-2">
                  <Calendar size={14} className="text-primary" /> Visitation Overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SummaryItem icon={Calendar} label="Visit Date" value={visitationDetails.VVR_Visit_Date} />
                  <SummaryItem icon={MapPin} label="Location" value={visitationDetails.VVR_Places_to_Visit} />
                  <SummaryItem icon={HelpCircle} label="Purpose" value={visitationDetails.VVR_Purpose} />
                </div>
              </div>

              {/* Vehicles Section */}
              <div className="pb-8 border-b border-gray-100">
                <h4 className="text-[12px] font-medium text-[#0A1D37] uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Car size={14} className="text-primary" /> Vehicles ({vehicles.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicles.filter(v => v.number).map((v, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-[12px] font-normal text-gray-500 uppercase tracking-wide">{v.type}</span>
                      <span className="text-[12px] font-normal text-[#0A1D37] tracking-wide">{v.number}</span>
                    </div>
                  ))}
                  {vehicles.length === 0 && <p className="text-[12px] font-normal text-gray-400 italic">None registered</p>}
                </div>
              </div>

              {/* Group Section */}
              <div className="pb-8 border-b border-gray-100">
                <h4 className="text-[12px] font-medium text-[#0A1D37] uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Users size={14} className="text-primary" /> Group ({people.length})
                </h4>
                <div className="space-y-3">
                  {people.filter(p => p.name).map((p, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-[12px] font-normal text-[#0A1D37] tracking-wide flex-1">{p.name}</span>
                      <span className="text-[12px] font-normal text-gray-500 uppercase tracking-wide flex-1 sm:text-center">{p.nic}</span>
                      <span className="text-[12px] font-normal text-gray-500 tracking-wide flex-1 sm:text-right">{p.phone || "-"}</span>
                    </div>
                  ))}
                  {people.length === 0 && <p className="text-[12px] font-normal text-gray-400 italic">No additional people</p>}
                </div>
              </div>

              {/* Declared Items Section */}
              <div>
                <h4 className="text-[12px] font-medium text-[#0A1D37] uppercase tracking-wide mb-3 flex items-center gap-2">
                  <Package size={14} className="text-primary" /> Declared Items ({items.length})
                </h4>
                <div className="space-y-3">
                  {items.filter(i => i.name).map((i, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[12px] font-normal text-[#0A1D37] tracking-wide">{i.name}</span>
                          <span className="text-[12px] font-normal text-primary bg-primary/5 px-2 py-0.5 rounded tracking-wide">x{i.quantity}</span>
                        </div>
                        <p className="text-[12px] font-normal text-gray-500 tracking-wide">{i.description || "No description"}</p>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <p className="text-[12px] font-normal text-gray-400 italic">No items declared</p>}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10">
              <button onClick={handleDone} className="w-full md:w-auto px-8 py-3 bg-[#C8102E] hover:bg-[#A60D26] text-white text-[12px] font-medium uppercase tracking-wide rounded-[8px] shadow-[0_10px_20px_rgba(200,16,46,0.15)] transition-all active:scale-95 flex items-center justify-center gap-2">
                Conclude Process <ArrowLeft className="rotate-180" size={14} />
              </button>
              <button onClick={() => window.print()} className="w-full md:w-auto px-8 py-3 bg-white border border-gray-200 text-[#0A1D37] text-[12px] font-medium uppercase tracking-wide rounded-[8px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Printer size={14} /> Print Receipt
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitRequestSuccess;
