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
    <div className="flex flex-col gap-0.5">
      <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      <span className="text-[11px] font-bold text-[#0A1D37]">{value || "N/A"}</span>
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
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] overflow-hidden">
        <Header title="Registration Success" />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="max-w-4xl mx-auto animate-fade-in-slow pb-10">
            
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <CheckCircle2 size={32} />
              </div>
              <h1 className="text-2xl font-black text-[#0A1D37] uppercase tracking-tight mb-2">Visit Registered Successfully</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Request ID: <span className="text-primary">#{requestId}</span></p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Left Column: Visitor Profile */}
              <div className="md:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full border-4 border-gray-50 overflow-hidden shadow-xl bg-gray-100 flex items-center justify-center">
                      {selectedVisitorDetails?.VV_Image ? (
                        <img src={selectedVisitorDetails.VV_Image} alt="Visitor" className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} className="text-gray-300" />
                      )}
                    </div>
                    <div className="absolute -bottom-2 right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  
                  <h2 className="text-lg font-black text-[#0A1D37] uppercase mb-1">{selectedVisitorDetails?.VV_Name || "Visitor"}</h2>
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-4">{selectedVisitorDetails?.VV_Visitor_Type || "Guest"}</p>
                  
                  <div className="w-full space-y-2 text-left">
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Mail size={12} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-600 truncate">{selectedVisitorDetails?.VV_Email || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Phone size={12} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-600">{selectedVisitorDetails?.VV_Phone || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Building size={12} className="text-gray-400" />
                      <span className="text-[10px] font-bold text-gray-600 truncate">{selectedVisitorDetails?.VV_Company || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Visit Details & Lists */}
              <div className="md:col-span-8 space-y-6">
                
                {/* Visit Summary */}
                <div className="bg-white p-6 rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
                  <h3 className="text-[11px] font-black text-[#0A1D37] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Calendar size={14} className="text-primary" /> Visitation Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <SummaryItem icon={Calendar} label="Visit Date" value={visitationDetails.VVR_Visit_Date} />
                    <SummaryItem icon={MapPin} label="Location" value={visitationDetails.VVR_Places_to_Visit} />
                    <div className="col-span-2">
                      <SummaryItem icon={HelpCircle} label="Purpose" value={visitationDetails.VVR_Purpose} />
                    </div>
                  </div>
                </div>

                {/* Additional Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vehicles & People */}
                  <div className="space-y-6">
                    <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm">
                      <h4 className="text-[9px] font-black text-[#0A1D37] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Car size={12} className="text-primary" /> Vehicles ({vehicles.length})
                      </h4>
                      <div className="space-y-2">
                        {vehicles.filter(v => v.number).map((v, i) => (
                          <div key={i} className="flex justify-between items-center p-2 rounded-lg bg-gray-50 border border-gray-100">
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{v.type}</span>
                            <span className="text-[11px] font-black text-[#0A1D37]">{v.number}</span>
                          </div>
                        ))}
                        {vehicles.length === 0 && <p className="text-[9px] font-bold text-gray-300 italic">None registered</p>}
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm">
                      <h4 className="text-[9px] font-black text-[#0A1D37] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Users size={12} className="text-primary" /> Group ({people.length})
                      </h4>
                      <div className="space-y-2">
                        {people.filter(p => p.name).map((p, i) => (
                          <div key={i} className="flex flex-col p-2 rounded-lg bg-gray-50 border border-gray-100">
                            <span className="text-[11px] font-black text-[#0A1D37]">{p.name}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{p.nic}</span>
                          </div>
                        ))}
                        {people.length === 0 && <p className="text-[9px] font-bold text-gray-300 italic">No additional people</p>}
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-white p-5 rounded-[20px] border border-gray-100 shadow-sm h-full">
                    <h4 className="text-[9px] font-black text-[#0A1D37] uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Package size={12} className="text-primary" /> Declared Items ({items.length})
                    </h4>
                    <div className="space-y-3">
                      {items.filter(i => i.name).map((i, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[11px] font-black text-[#0A1D37]">{i.name}</span>
                            <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded">x{i.quantity}</span>
                          </div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase leading-tight">{i.description || "No description"}</p>
                        </div>
                      ))}
                      {items.length === 0 && <p className="text-[9px] font-bold text-gray-300 italic">No items declared</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-10">
              <button onClick={handleDone} className="w-full md:w-auto px-12 py-4 bg-[#C8102E] hover:bg-[#A60D26] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_15px_30px_rgba(200,16,46,0.2)] transition-all active:scale-95 flex items-center gap-3">
                Conclude Process <ArrowLeft className="rotate-180" size={16} />
              </button>
              <button onClick={() => window.print()} className="w-full md:w-auto px-8 py-4 bg-white border border-gray-200 text-[#0A1D37] text-[11px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-gray-50 transition-all flex items-center gap-3">
                <Printer size={16} /> Print Receipt
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default VisitRequestSuccess;
