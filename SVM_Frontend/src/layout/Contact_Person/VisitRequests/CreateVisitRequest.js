import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Contact_Person/Layout/Sidebar";
import Header from "../../../components/Contact_Person/Layout/Header";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import { GetVisitorsByCP } from "../../../actions/VisitorAction";
import { AddVisitRequest } from "../../../actions/VisitRequestAction";
import { AddVehicle } from "../../../actions/VehicleAction";
import { AddVisitGroup } from "../../../actions/VisitGroupAction";
import { AddItem } from "../../../actions/ItemCarriedAction";
import ContactPersonService from "../../../services/ContactPersonService";
import { 
  User, 
  Calendar, 
  MapPin, 
  FileText, 
  ArrowLeft,
  Mail,
  Phone,
  Building,
  Briefcase,
  HelpCircle,
  Car,
  Users,
  Package,
  Plus,
  Trash2,
  CheckCircle2
} from "lucide-react";

const CreateVisitRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  const { visitorsByCP, isLoading: isVisitorsLoading } = useSelector((state) => state.visitorManagement);
  const user = useSelector((state) => state.login.user);
  const userEmail = user?.ResultSet?.[0]?.VA_Email;

  const [cpId, setCpId] = useState(null);
  const [formData, setFormData] = useState({
    VVR_Visitor_id: "",
    VVR_Visit_Date: "",
    VVR_Places_to_Visit: "",
    VVR_Purpose: "",
    VVR_Status: "PENDING",
    VV_Vehicle_Type: "Car",
    VV_Vehicle_Number: "",
  });

  const [selectedVisitorDetails, setSelectedVisitorDetails] = useState(null);
  const [people, setPeople] = useState([]);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadContactPersonId = async () => {
      try {
        const response = await ContactPersonService.GetAllContactPersons();
        const contactPersons = response?.data?.ResultSet || [];
        const match = contactPersons.find(
          (cp) => cp?.VCP_Email?.trim().toLowerCase() === userEmail?.trim().toLowerCase()
        );
        if (match) {
          setCpId(match.VCP_Contact_person_id);
        }
      } catch (err) {
        console.error("Error loading contact person:", err);
      }
    };

    if (userEmail) {
      loadContactPersonId();
    }
  }, [userEmail]);

  useEffect(() => {
    if (cpId) {
      dispatch(GetVisitorsByCP(cpId));
    }
  }, [dispatch, cpId]);

  const activeVisitors = useMemo(() => {
    return (visitorsByCP || []).filter((v) => {
      const s = (v.VV_Status || "").toString().trim().toUpperCase();
      return s === "ACTIVE" || s === "A";
    });
  }, [visitorsByCP]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });

    if (name === "VVR_Visitor_id") {
      const visitor = activeVisitors.find(v => String(v.VV_Visitor_id) === String(value));
      setSelectedVisitorDetails(visitor || null);
    }
  };

  const addPerson = () => setPeople([...people, { name: "", nic: "", phone: "" }]);
  const removePerson = (index) => setPeople(people.filter((_, i) => i !== index));
  const handlePersonChange = (index, field, value) => {
    const updated = [...people];
    updated[index][field] = value;
    setPeople(updated);
  };

  const addItem = () => setItems([...items, { name: "", quantity: "" }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.VVR_Visitor_id) newErrors.VVR_Visitor_id = "Visitor required";
    if (!formData.VVR_Visit_Date) newErrors.VVR_Visit_Date = "Date required";
    if (!formData.VVR_Places_to_Visit.trim()) newErrors.VVR_Places_to_Visit = "Location required";
    if (!formData.VVR_Purpose.trim()) newErrors.VVR_Purpose = "Purpose required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        VVR_Contact_person_id: cpId,
      };
      const response = await dispatch(AddVisitRequest(payload));
      
      const requestId = response?.VVR_Request_id || response?.ResultSet?.[0]?.VVR_Request_id;
      
      if (requestId) {
        if (formData.VV_Vehicle_Number) {
          await dispatch(AddVehicle({
            VV_Vehicle_Type: formData.VV_Vehicle_Type,
            VV_Vehicle_Number: formData.VV_Vehicle_Number,
            VVR_Request_id: requestId
          }));
        }

        for (const person of people) {
          if (person.name) {
            await dispatch(AddVisitGroup({
              VVG_Visitor_Name: person.name,
              VVG_NIC_Passport_Number: person.nic,
              VVG_Designation: person.phone,
              VVR_Request_id: requestId,
              VVG_Status: "A"
            }));
          }
        }

        for (const item of items) {
          if (item.name) {
            await dispatch(AddItem({
              VIC_Item_Name: item.name,
              VIC_Quantity: item.quantity,
              VIC_Designation: "N/A",
              VVR_Request_id: requestId
            }));
          }
        }
      }

      alert("Visit request submitted successfully!");
      navigate("/contact_person/visit-requests");
    } catch (err) {
      console.error("Failed to create visit request:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="flex items-start gap-3 mb-6">
      <div className="w-1 h-10 bg-[#C8102E] rounded-full shrink-0 mt-0.5"></div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <Icon size={14} className="text-[#C8102E]" />
          <h3 className="text-[11px] font-black uppercase tracking-[0.15em] text-[#0A1D37]">
            {title}
          </h3>
        </div>
        {subtitle && (
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );

  const InputField = ({ label, name, type = "text", placeholder, value, onChange, error, icon: Icon }) => (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-1.5 px-0.5">
        {Icon && <Icon size={11} />} {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-white border rounded-lg px-4 py-2.5 text-[12px] font-medium transition-all placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/5 ${
          error ? "border-red-500" : "border-gray-200 focus:border-primary/50"
        }`}
      />
      {error && <p className="text-[8px] text-red-500 font-bold px-0.5 uppercase">{error}</p>}
    </div>
  );

  return (
    <div className="contact-theme-root flex bg-[#F8F9FA] overflow-hidden text-[#1A1A1A] h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] overflow-hidden">
        <Header title="Visitor Registration" />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-slow pb-10">
            
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100">
                <SectionHeader title="Visitation Details" subtitle="Core Information" icon={FileText} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-1.5 px-0.5">
                      <User size={11} className="text-primary" /> Who is the visitor?
                    </label>
                    <select
                      name="VVR_Visitor_id"
                      value={formData.VVR_Visitor_id}
                      onChange={handleInputChange}
                      className={`w-full bg-white border rounded-lg px-4 py-2.5 text-[12px] font-medium transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/5 ${
                        errors.VVR_Visitor_id ? "border-red-500" : "border-gray-200 focus:border-primary/50"
                      }`}
                    >
                      <option value="">Select from registry</option>
                      {activeVisitors.map((v) => (
                        <option key={v.VV_Visitor_id} value={v.VV_Visitor_id}>{v.VV_Name} — {v.VV_NIC_Passport_NO}</option>
                      ))}
                    </select>
                    {errors.VVR_Visitor_id && <p className="text-[8px] text-red-500 font-bold px-0.5 uppercase">{errors.VVR_Visitor_id}</p>}
                  </div>

                  {selectedVisitorDetails && (
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Email</span>
                        <p className="text-[11px] font-bold text-[#0A1D37] truncate">{selectedVisitorDetails.VV_Email || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Phone</span>
                        <p className="text-[11px] font-bold text-[#0A1D37]">{selectedVisitorDetails.VV_Phone || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Company</span>
                        <p className="text-[11px] font-bold text-[#0A1D37] truncate">{selectedVisitorDetails.VV_Company || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Type</span>
                        <p className="text-[11px] font-bold text-primary">{selectedVisitorDetails.VV_Visitor_Type || "N/A"}</p>
                      </div>
                    </div>
                  )}

                  <InputField label="Visit Date" name="VVR_Visit_Date" type="date" value={formData.VVR_Visit_Date} onChange={handleInputChange} error={errors.VVR_Visit_Date} icon={Calendar} />
                  <InputField label="Why are you visiting?" name="VVR_Purpose" placeholder="e.g. System maintenance" value={formData.VVR_Purpose} onChange={handleInputChange} error={errors.VVR_Purpose} icon={HelpCircle} />
                  <div className="md:col-span-2">
                    <InputField label="Where will you visit?" name="VVR_Places_to_Visit" placeholder="e.g. Garden and main entrance" value={formData.VVR_Places_to_Visit} onChange={handleInputChange} error={errors.VVR_Places_to_Visit} icon={MapPin} />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100">
                <SectionHeader title="Vehicle Details" icon={Car} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] flex items-center gap-1.5 px-0.5">Vehicle Type</label>
                    <select
                      name="VV_Vehicle_Type"
                      value={formData.VV_Vehicle_Type}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-[12px] font-medium focus:outline-none focus:border-primary/50"
                    >
                      <option value="Car">Car</option>
                      <option value="Van">Van</option>
                      <option value="Motorbike">Motorbike</option>
                      <option value="Truck">Truck</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <InputField label="Plate Number" name="VV_Vehicle_Number" placeholder="E.G. WP-CAD-1234" value={formData.VV_Vehicle_Number} onChange={handleInputChange} />
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <SectionHeader title="People Visiting" icon={Users} />
                  <button type="button" onClick={addPerson} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all shadow-sm">
                    <Plus size={12} /> Add Person
                  </button>
                </div>

                <div className="space-y-4">
                  {people.map((person, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 rounded-xl bg-gray-50/50 border border-gray-100 relative group">
                      <div className="md:col-span-4">
                        <InputField label="Full Name" placeholder="e.g. John Doe" value={person.name} onChange={(e) => handlePersonChange(index, "name", e.target.value)} />
                      </div>
                      <div className="md:col-span-4">
                        <InputField label="ID or Passport" placeholder="ID number" value={person.nic} onChange={(e) => handlePersonChange(index, "nic", e.target.value)} />
                      </div>
                      <div className="md:col-span-3">
                        <InputField label="Phone" placeholder="Phone number" value={person.phone} onChange={(e) => handlePersonChange(index, "phone", e.target.value)} />
                      </div>
                      <div className="md:col-span-1 flex justify-center pb-1">
                        <button type="button" onClick={() => removePerson(index)} className="p-2 text-gray-300 hover:text-red-500 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {people.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                      <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">No additional people</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-[0_10px_30px_rgba(0,0,0,0.02)] border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <SectionHeader title="Items to Bring" icon={Package} />
                  <button type="button" onClick={addItem} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-all shadow-sm">
                    <Plus size={12} /> Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 rounded-xl bg-gray-50/50 border border-gray-100 relative group">
                      <div className="md:col-span-7">
                        <InputField label="Item Name" placeholder="e.g. Laptop" value={item.name} onChange={(e) => handleItemChange(index, "name", e.target.value)} />
                      </div>
                      <div className="md:col-span-4">
                        <InputField label="Quantity" placeholder="e.g. 1" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />
                      </div>
                      <div className="md:col-span-1 flex justify-center pb-1">
                        <button type="button" onClick={() => removeItem(index)} className="p-2 text-gray-300 hover:text-red-500 transition-all">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                      <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">No items declared</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 pt-6">
                <button type="button" onClick={() => navigate("/contact_person/visit-requests")} className="w-full md:w-auto px-10 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600 transition-all">
                  Discard
                </button>
                <button type="submit" disabled={isSubmitting} className="w-full md:w-auto flex-1 px-10 py-3.5 bg-[#C8102E] hover:bg-[#A60D26] text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-[0_10px_25px_rgba(200,16,46,0.15)] transition-all active:scale-95 disabled:opacity-50">
                  {isSubmitting ? "Processing..." : "Submit Registration"}
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateVisitRequest;
;

