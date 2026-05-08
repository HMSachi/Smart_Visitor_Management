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
  <div className="flex flex-col gap-0.5">
    <div className="flex items-center gap-1.5 px-0.5">
      <Icon size={11} className="text-primary/70" />
      <span className="text-[12px] font-medium text-gray-500 capitalize tracking-tight">{label}</span>
    </div>
    <div className="w-full bg-gray-50/50 border border-gray-100 rounded-lg px-3 py-1 text-[#1A1A1A] text-[12px] font-normal tracking-tight min-h-[36px] flex items-center">
      {value || "N/A"}
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
        <Header title="Registration success" />
        
        <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="w-full max-w-none mx-auto animate-fade-in-slow pb-6">
            
            {/* Success Header */}
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <CheckCircle2 size={24} />
              </div>
              <h1 className="text-lg font-normal text-[#0A1D37] capitalize tracking-wide mb-1">Visit registered successfully</h1>
              <p className="text-[12px] font-normal text-gray-500 tracking-wide capitalize">Request ID: <span className="text-primary">#{requestId}</span></p>
            </div>

            <div className="bg-white p-4 md:p-5 rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 space-y-4 max-w-none w-full">
              
              {/* Visitor Profile Section */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-gray-100">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full border-[3px] border-gray-50 overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center">
                    {selectedVisitorDetails?.VV_Image ? (
                      <img src={selectedVisitorDetails.VV_Image} alt="Visitor" className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} className="text-gray-300" />
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-white shadow-sm">
                    <CheckCircle2 size={12} />
                  </div>
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-[14px] font-medium text-[#0A1D37] capitalize tracking-wide mb-0.5">{selectedVisitorDetails?.VV_Name || "Visitor"}</h2>
                  <p className="text-[12px] font-normal text-primary capitalize tracking-wide mb-2">{selectedVisitorDetails?.VV_Visitor_Type || "Guest"}</p>
                  
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
              <div className="pb-4 border-b border-gray-100">
                <h3 className="text-[13px] font-medium text-[#0A1D37] capitalize tracking-tight mb-3 flex items-center gap-2">
                  <div className="w-[3px] h-3.5 bg-primary rounded-full"></div>
                  <Calendar size={13} className="text-primary/70" /> Visitation overview
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <SummaryItem icon={Calendar} label="Visit date" value={visitationDetails.VVR_Visit_Date} />
                  <SummaryItem icon={MapPin} label="Location" value={visitationDetails.VVR_Places_to_Visit} />
                  <SummaryItem icon={HelpCircle} label="Purpose" value={visitationDetails.VVR_Purpose} />
                </div>
              </div>

              {/* Vehicles Section */}
              <div className="pb-4 border-b border-gray-100">
                <h3 className="text-[13px] font-medium text-[#0A1D37] capitalize tracking-tight mb-3 flex items-center gap-2">
                  <div className="w-[3px] h-3.5 bg-primary rounded-full"></div>
                  <Car size={13} className="text-primary/70" /> Vehicles ({vehicles.length})
                </h3>
                {vehicles.length > 0 ? (
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center px-3 py-1.5 bg-gray-50 border-b border-gray-100">
                      <span className="text-[12px] font-medium text-gray-400 capitalize tracking-tight flex-1">Type</span>
                      <span className="text-[12px] font-medium text-gray-400 capitalize tracking-tight flex-1 sm:text-right">Vehicle number</span>
                    </div>
                    <div className="divide-y divide-gray-50/50 overflow-y-auto max-h-[200px] custom-scrollbar">
                      {vehicles.filter(v => v.number).map((v, i) => (
                        <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-1.5 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <span className="text-[12px] font-normal text-gray-600 capitalize flex-1">{v.type}</span>
                          <span className="text-[12px] font-normal text-[#1A1A1A] flex-1 sm:text-right">{v.number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[12px] font-medium text-gray-400 italic">None registered</p>
                )}
              </div>

              {/* Group Section */}
              <div className="pb-4 border-b border-gray-100">
                <h3 className="text-[13px] font-medium text-[#0A1D37] capitalize tracking-tight mb-3 flex items-center gap-2">
                  <div className="w-[3px] h-3.5 bg-primary rounded-full"></div>
                  <Users size={13} className="text-primary/70" /> Group ({people.length})
                </h3>
                {people.length > 0 ? (
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center px-3 py-1.5 bg-gray-50 border-b border-gray-100">
                      <span className="text-[12px] font-medium text-gray-400 capitalize tracking-tight flex-1">Name</span>
                      <span className="text-[12px] font-medium text-gray-400 capitalize tracking-tight flex-1 sm:text-center">NIC</span>
                      <span className="text-[12px] font-medium text-gray-400 capitalize tracking-tight flex-1 sm:text-right">Phone number</span>
                    </div>
                    <div className="divide-y divide-gray-50/50 overflow-y-auto max-h-[200px] custom-scrollbar">
                      {people.filter(p => p.name).map((p, i) => (
                        <div key={i} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-1.5 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <span className="text-[12px] font-normal text-[#1A1A1A] flex-1">{p.name}</span>
                          <span className="text-[12px] font-normal text-gray-600 capitalize flex-1 sm:text-center">{p.nic}</span>
                          <span className="text-[12px] font-normal text-gray-600 flex-1 sm:text-right">{p.phone || "-"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[12px] font-medium text-gray-400 italic">No additional people</p>
                )}
              </div>

              {/* Declared Items Section */}
              <div>
                <h3 className="text-[13px] font-medium text-[#0A1D37] capitalize tracking-tight mb-3 flex items-center gap-2">
                  <div className="w-[3px] h-3.5 bg-primary rounded-full"></div>
                  <Package size={13} className="text-primary/70" /> Declared items ({items.length})
                </h3>
                {items.length > 0 ? (
                  <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center px-3 py-1.5 bg-gray-50 border-b border-gray-100">
                      <span className="text-[12px] font-medium text-gray-400 capitalize tracking-tight flex-[2]">Item name</span>
                      <span className="text-[12px] font-medium text-gray-400 capitalize tracking-tight w-16 text-center">Qty</span>
                      <span className="text-[12px] font-medium text-gray-400 capitalize tracking-tight flex-[3] sm:text-right">Description</span>
                    </div>
                    <div className="divide-y divide-gray-50/50 overflow-y-auto max-h-[200px] custom-scrollbar">
                      {items.filter(i => i.name).map((i, idx) => (
                        <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-1.5 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                          <span className="text-[12px] font-normal text-[#1A1A1A] flex-[2] truncate">{i.name}</span>
                          <div className="w-16 flex justify-center">
                            <span className="text-[12px] font-medium text-primary bg-primary/5 px-2 py-0.5 rounded tracking-wide">x{i.quantity}</span>
                          </div>
                          <span className="text-[12px] font-normal text-gray-500 flex-[3] sm:text-right truncate">{i.description || "-"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[12px] font-medium text-gray-400 italic">No items declared</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-6">
              <button onClick={handleDone} className="w-full md:w-auto px-6 py-2 bg-[#C8102E] hover:bg-[#A60D26] text-white text-[12px] font-medium capitalize tracking-wide rounded-[8px] shadow-[0_5px_15px_rgba(200,16,46,0.15)] transition-all active:scale-95 flex items-center justify-center gap-2">
                Conclude process <ArrowLeft className="rotate-180" size={14} />
              </button>
              <button onClick={() => window.print()} className="w-full md:w-auto px-6 py-2 bg-white border border-gray-200 text-[#0A1D37] text-[12px] font-medium capitalize tracking-wide rounded-[8px] hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                <Printer size={14} /> Print receipt
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitRequestSuccess;
