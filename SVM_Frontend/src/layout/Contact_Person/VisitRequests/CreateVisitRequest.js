import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Contact_Person/Layout/Sidebar";
import Header from "../../../components/Contact_Person/Layout/Header";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import { GetVisitorsByCP } from "../../../actions/VisitorAction";
import ContactPersonService from "../../../services/ContactPersonService";
import { 
  updateVisitationDetails, 
  setSelectedVisitor,
  setSavedRequestId,
  resetForm,
  setSubmitting
} from "../../../reducers/visitRequestFormSlice";
import { AddVisitRequest, GetVisitRequestsByCP } from "../../../actions/VisitRequestAction";
import { GetAllBlacklist } from "../../../actions/BlacklistAction";
import { GetAllPlaces } from "../../../actions/PlacesAction";

import { 
  User, 
  Calendar, 
  MapPin, 
  FileText, 
  ArrowLeft,
  HelpCircle
} from "lucide-react";
import { SectionHeader, InputField } from "../../../components/Contact_Person/VisitRequests/FormComponents";

const CreateVisitRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { themeMode } = useThemeMode();
  
  const { visitorsByCP } = useSelector((state) => state.visitorManagement);
  const user = useSelector((state) => state.login.user);
  const userEmail = user?.ResultSet?.[0]?.VA_Email;
  const { blacklists } = useSelector((state) => state.blacklistState || { blacklists: [] });
  const { places: placesList, loading: placesLoading } = useSelector((state) => state.placesState || { places: [], loading: false });


  const { visitationDetails: formData, selectedVisitorDetails, isSubmitting } = useSelector((state) => state.visitRequestForm);
  const [cpId, setCpId] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadContactPersonId = async () => {
      try {
        const response = await ContactPersonService.GetAllContactPersons();
        const contactPersons = response?.data?.ResultSet || [];
        const match = contactPersons.find(
          (cp) => cp?.VCP_Email?.trim().toLowerCase() === userEmail?.trim().toLowerCase()
        );
        if (match) setCpId(match.VCP_Contact_person_id);
      } catch (err) {
        console.error("Error loading contact person:", err);
      }
    };
    if (userEmail) loadContactPersonId();
  }, [userEmail]);

  useEffect(() => {
    if (cpId) dispatch(GetVisitorsByCP(cpId));
    dispatch(GetAllBlacklist());
    dispatch(GetAllPlaces());
  }, [dispatch, cpId]);


  const activeVisitors = useMemo(() => {
    return (visitorsByCP || []).filter((v) => {
      const s = (v.VV_Status || "").toString().trim().toUpperCase();
      return s === "ACTIVE" || s === "A";
    });
  }, [visitorsByCP]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateVisitationDetails({ [name]: value }));
    if (errors[name]) setErrors({ ...errors, [name]: "" });

    if (name === "VVR_Visitor_id") {
      const visitor = activeVisitors.find(v => String(v.VV_Visitor_id) === String(value));
      dispatch(setSelectedVisitor(visitor || null));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.VVR_Visitor_id) newErrors.VVR_Visitor_id = "Visitor required";
    if (!formData.VVR_Visit_Date) newErrors.VVR_Visit_Date = "Date required";
    if (!formData.VVR_Places_to_Visit?.trim()) newErrors.VVR_Places_to_Visit = "Location required";
    if (!formData.VVR_Purpose?.trim()) newErrors.VVR_Purpose = "Purpose required";

    // Check blacklist
    if (selectedVisitorDetails) {
        const isBlacklisted = blacklists.some(
            (b) => 
                (b.VB_Email && b.VB_Email.toLowerCase() === selectedVisitorDetails.VV_Email?.toLowerCase() && b.VB_Status === "A") ||
                (b.VB_Name && b.VB_Name.toLowerCase() === selectedVisitorDetails.VV_Name?.toLowerCase() && b.VB_Status === "A")
        );
        if (isBlacklisted) {
            newErrors.VVR_Visitor_id = "Access Restricted: This visitor is blocked.";
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleNext = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = { ...formData, VVR_Contact_person_id: cpId };
    dispatch(updateVisitationDetails({ VVR_Contact_person_id: cpId }));
    dispatch(setSubmitting(true));

    try {
      const response = await dispatch(AddVisitRequest(payload));
      console.log("[AddVisitRequest] raw response:", JSON.stringify(response));

      // API returns ResultSet:null — no ID in the response.
      // Fetch the CP's request list and pick the one with the highest ID (just created).
      let requestId =
        response?.VVR_Request_id ||
        response?.ResultSet?.[0]?.VVR_Request_id ||
        response?.ResultSet?.VVR_Request_id ||
        response?.Data?.VVR_Request_id;

      if (!requestId && cpId) {
        const requests = await dispatch(GetVisitRequestsByCP(cpId));
        if (Array.isArray(requests) && requests.length > 0) {
          const latest = requests.reduce((max, r) =>
            Number(r.VVR_Request_id) > Number(max.VVR_Request_id) ? r : max,
            requests[0]
          );
          requestId = latest.VVR_Request_id;
          console.log("[AddVisitRequest] resolved requestId from list:", requestId);
        }
      }

      if (requestId) {
        dispatch(setSavedRequestId(requestId));
        navigate("/contact_person/create-visit-request-details");
      } else {
        alert("Could not retrieve the new visit request ID. Please try again.");
      }
    } catch (err) {
      console.error("Failed to save visit request:", err);
      alert("Failed to save visit details. Please try again.");
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  return (
    <div className="contact-theme-root flex bg-[#F8F9FA] overflow-hidden text-[#1A1A1A] h-screen w-full">
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] overflow-hidden">
        <Header title="Visitor Registration" />
        
        <main className="flex-1 overflow-y-auto p-6 pt-12 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-4 animate-fade-in-slow pb-4">
            
            {/* Step Indicator */}
            <div className="flex items-center gap-4 px-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary text-white text-[12px] font-normal flex items-center justify-center">1</div>
                <span className="text-[12px] font-normal capitalize tracking-widest text-primary">Core info</span>
              </div>
              <div className="h-[1px] w-12 bg-gray-200"></div>
              <div className="flex items-center gap-2 opacity-40">
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 text-[12px] font-normal flex items-center justify-center">2</div>
                <span className="text-[12px] font-normal capitalize tracking-widest text-gray-500">Details</span>
              </div>
            </div>

            <form onSubmit={handleNext} className="space-y-6 mt-20">
              <div className="bg-white p-3 rounded-[12px] shadow-[0_5px_15px_rgba(0,0,0,0.015)] border border-gray-100">
                <SectionHeader title="Visitor Details" icon={FileText} />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[12px] font-medium text-gray-400 capitalize tracking-[0.15em] flex items-center gap-1.5 px-0.5">
                      <User size={11} className="text-primary" /> Who is the visitor?
                    </label>
                    <select
                      name="VVR_Visitor_id"
                      value={formData.VVR_Visitor_id}
                      onChange={handleInputChange}
                      className={`w-full bg-white border rounded-lg px-3 py-1.5 text-[12px] font-normal transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/5 ${
                        errors.VVR_Visitor_id ? "border-red-500" : "border-gray-200 focus:border-primary/50"
                      }`}
                    >
                      <option value="">Select from registry</option>
                      {activeVisitors.map((v) => (
                        <option key={v.VV_Visitor_id} value={v.VV_Visitor_id}>{v.VV_Name}</option>
                      ))}
                    </select>
                    {errors.VVR_Visitor_id && <p className="text-[12px] text-red-500 font-normal px-0.5 capitalize">{errors.VVR_Visitor_id}</p>}
                  </div>

                  {selectedVisitorDetails && (
                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                      <div className="space-y-0.5 text-center md:text-left">
                        <span className="text-[12px] font-medium text-gray-400 capitalize tracking-widest">Email</span>
                        <p className="text-[12px] font-medium text-[#0A1D37] truncate">{selectedVisitorDetails.VV_Email || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5 text-center md:text-left">
                        <span className="text-[12px] font-medium text-gray-400 capitalize tracking-widest">Phone</span>
                        <p className="text-[12px] font-medium text-[#0A1D37]">{selectedVisitorDetails.VV_Phone || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5 text-center md:text-left">
                        <span className="text-[12px] font-medium text-gray-400 capitalize tracking-widest">Company</span>
                        <p className="text-[12px] font-medium text-[#0A1D37] truncate">{selectedVisitorDetails.VV_Company || "N/A"}</p>
                      </div>
                      <div className="space-y-0.5 text-center md:text-left">
                        <span className="text-[12px] font-medium text-gray-400 capitalize tracking-widest">Type</span>
                        <p className="text-[12px] font-medium text-primary">{selectedVisitorDetails.VV_Visitor_Type || "N/A"}</p>
                      </div>
                    </div>
                  )}

                  <InputField label="Visit Date" name="VVR_Visit_Date" type="date" value={formData.VVR_Visit_Date} onChange={handleInputChange} error={errors.VVR_Visit_Date} icon={Calendar} />
                  {/* Places to Visit — dynamic dropdown from Admin Places API */}
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-gray-400 capitalize tracking-[0.15em] flex items-center gap-1.5 px-0.5">
                      <MapPin size={11} className="text-primary" /> Places to Visit
                    </label>
                    <select
                      name="VVR_Places_to_Visit"
                      value={formData.VVR_Places_to_Visit}
                      onChange={handleInputChange}
                      disabled={placesLoading}
                      className={`w-full bg-white border rounded-lg px-3 py-1.5 text-[12px] font-normal transition-all appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/5 ${
                        errors.VVR_Places_to_Visit ? "border-red-500" : "border-gray-200 focus:border-primary/50"
                      } ${placesLoading ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                      <option value="">{placesLoading ? "Loading places..." : "Select a place to visit"}</option>
                      {placesList && placesList.length > 0 && placesList
                        .filter((place) => {
                          const status = (place.VAIL_Status || place.Status || place.status || 'A').toString().trim().toUpperCase();
                          return status === 'A';
                        })
                        .map((place, idx) => {
                          const id = place.VAIL_Item_List_ID || place.Item_List_ID || place.Id || idx;
                          const name = place.VAIL_Item_Name || place.Item_Name || place.Name || "Unknown";
                          return (
                            <option key={id} value={name}>{name}</option>
                          );
                        })}
                    </select>
                    {errors.VVR_Places_to_Visit && <p className="text-[12px] text-red-500 font-normal px-0.5 capitalize">{errors.VVR_Places_to_Visit}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <InputField label="What Is The Reason?" name="VVR_Purpose" placeholder="e.g. Maintenance, Meeting" value={formData.VVR_Purpose} onChange={handleInputChange} error={errors.VVR_Purpose} icon={HelpCircle} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-10">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    dispatch(resetForm());
                    navigate("/contact_person/visit-requests");
                  }}
                  className="w-full md:w-auto px-10 h-10 rounded-xl text-[12px] font-normal tracking-[0.14em] text-gray-400 hover:text-gray-600 transition-all disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-12 h-10 bg-primary hover:bg-[var(--color-primary-hover)] text-white text-[12px] font-normal tracking-[0.14em] rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95 disabled:opacity-60 group flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Saving details..."
                  ) : (
                    <>
                      Next step: additional details{" "}
                      <ArrowLeft
                        className="rotate-180 transition-transform group-hover:translate-x-1"
                        size={14}
                      />
                    </>
                  )}
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
