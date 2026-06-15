import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../../components/Contact_Person/Layout/Sidebar";
import Header from "../../../components/Contact_Person/Layout/Header";
import { AddVehicle } from "../../../actions/VehicleAction";
import { AddVisitGroup } from "../../../actions/VisitGroupAction";
import { AddItem } from "../../../actions/ItemCarriedAction";
import { GetAllBlacklist } from "../../../actions/BlacklistAction";
import { GetAllVisitors } from "../../../actions/VisitorAction";
import VisitorAttachmentService from "../../../services/VisitorAttachmentService";
import VisitGroupService from "../../../services/VisitGroupService";

import {
  addVehicle, toggleVehicleConfirmed, removeVehicle, updateVehicle, markVehicleSaved,
  addPerson, togglePersonConfirmed, removePerson, updatePerson, markPersonSaved,
  addItem, toggleItemConfirmed, removeItem, updateItem, markItemSaved,
  addSubVisitorItem, toggleSubVisitorItemConfirmed, removeSubVisitorItem, updateSubVisitorItem, markSubVisitorItemSaved,
  resetForm, setSubmitting, setError
} from "../../../reducers/visitRequestFormSlice";
import { SectionHeader, InputField } from "../../../components/Contact_Person/VisitRequests/FormComponents";
import {
  Car, Users, Package, Plus, Trash2, ArrowLeft, CheckCircle2, Save, Edit2, Loader2, Paperclip, AlertCircle, X, FileText, Upload, CheckCircle
} from "lucide-react";
import { validateName, validateNIC, validatePhone, validatePlateNumber } from "../../../utils/validation";

const CreateVisitRequestDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showSaveModal, setShowSaveModal] = useState(location.state?.fromStep1 || false);
  const {
    visitationDetails: formData,
    savedRequestId,
    vehicles,
    people,
    items,
    subVisitorItems,
    isSubmitting
  } = useSelector((state) => state.visitRequestForm);
  const { blacklists } = useSelector((state) => state.blacklistState || { blacklists: [] });
  const { visitors: allVisitors } = useSelector((state) => state.visitorManagement || { visitors: [] });


  const lastCreatedRequestId = useSelector((state) => state.visitRequestsState?.lastCreatedRequestId);
  const effectiveRequestId = savedRequestId || lastCreatedRequestId;

  const [vehicleSavingIndex, setVehicleSavingIndex] = useState(null);
  const [personSavingIndex, setPersonSavingIndex] = useState(null);
  const [itemSavingIndex, setItemSavingIndex] = useState(null);
  const [subVisitorItemSavingIndex, setSubVisitorItemSavingIndex] = useState(null);

  // Visitor ID comes from Step 1 — the contact person selected the visitor from the dropdown.
  // formData.VVR_Visitor_id holds it directly; no extra API call needed.
  const user = useSelector((state) => state.login.user);

  const [licenseUploading, setLicenseUploading] = useState({});
  const licenseInputRefs = useRef({});

  // Sub-visitor attachment upload state
  const [personUploading, setPersonUploading] = useState({});
  
  // Sub-visitor attachment modal state
  const [attachmentModal, setAttachmentModal] = useState({
    open: false,
    personIndex: null,
    personName: "",
  });
  const [attachFile, setAttachFile] = useState(null);
  const [attachCategory, setAttachCategory] = useState("nic");
  const [attachUploading, setAttachUploading] = useState(false);
  const [attachResult, setAttachResult] = useState(null);
  const [attachDragOver, setAttachDragOver] = useState(false);
  const attachFileInputRef = useRef(null);

  const openAttachmentModal = (index, name) => {
    setAttachmentModal({ open: true, personIndex: index, personName: name });
    setAttachFile(null);
    setAttachCategory("nic");
    setAttachResult(null);
  };

  const closeAttachmentModal = () => {
    setAttachmentModal({ open: false, personIndex: null, personName: "" });
    setAttachFile(null);
    setAttachResult(null);
  };

  const handleAttachFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setAttachFile(f);
      setAttachResult(null);
    }
  };

  const handleAttachDrop = (e) => {
    e.preventDefault();
    setAttachDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setAttachFile(f);
      setAttachResult(null);
    }
  };

  const handleAttachUpload = async () => {
    const { personIndex } = attachmentModal;
    if (personIndex === null || !attachFile) return;

    const person = people[personIndex];
    if (!person.isSavedToServer) {
      setAttachResult({ success: false, message: "Please save the sub-visitor first before uploading an attachment." });
      return;
    }
    const pUid = user?.ResultSet?.[0]?.VA_Name || "ContactPerson";

    // Primary: use VVG_id stored in Redux from AddVisitGroup ResultSet
    let subVisitorId = person.vvgId;

    // Fallback lookup
    if (!subVisitorId && effectiveRequestId) {
      try {
        const res = await VisitGroupService.GetAllVisitGroup();
        const groups = res?.data?.ResultSet || res?.data || [];
        const match = Array.isArray(groups)
          ? groups.find(
              (g) =>
                String(g.VVR_Request_id) === String(effectiveRequestId) &&
                g.VVG_Visitor_Name?.trim().toLowerCase() === person.name?.trim().toLowerCase()
            )
          : null;
        if (match?.VVG_id) {
          subVisitorId = match.VVG_id;
          dispatch(updatePerson({ index: personIndex, field: "vvgId", value: subVisitorId }));
        }
      } catch (e) {
        console.error("Fallback VVG_id lookup failed:", e);
      }
    }

    if (!subVisitorId) {
      setAttachResult({ success: false, message: "Sub-visitor ID not found. Please save the visitor again and retry." });
      return;
    }

    setAttachUploading(true);
    setAttachResult(null);
    setPersonUploading((prev) => ({ ...prev, [personIndex]: "uploading" }));
    
    const catFormatted = attachCategory === "nic" ? "NIC" : attachCategory === "passport" ? "Passport" : "Driving Licence";
    try {
      await VisitorAttachmentService.UploadSubVisitorAttachment(
        subVisitorId,
        formData.VVR_Visitor_id,
        catFormatted,
        pUid,
        attachFile
      );
      setAttachResult({ success: true, message: "Attachment uploaded successfully." });
      setPersonUploading((prev) => ({ ...prev, [personIndex]: "done" }));
      setTimeout(() => setPersonUploading((prev) => { const n = { ...prev }; delete n[personIndex]; return n; }), 3000);
      setTimeout(() => closeAttachmentModal(), 1000);
    } catch (err) {
      console.error("Sub-visitor attachment upload failed:", err);
      setAttachResult({ success: false, message: err?.message || "Upload failed." });
      setPersonUploading((prev) => ({ ...prev, [personIndex]: "error" }));
      setTimeout(() => setPersonUploading((prev) => { const n = { ...prev }; delete n[personIndex]; return n; }), 3000);
    } finally {
      setAttachUploading(false);
    }
  };

  const handleLicenseUpload = (index) => {
    if (licenseInputRefs.current[index]) {
      licenseInputRefs.current[index].click();
    }
  };

  const handleLicenseFileChange = async (index, file) => {
    if (!file) return;
    const visitorId = formData.VVR_Visitor_id;
    if (!visitorId) {
      alert("Visitor not selected. Please go back to Step 1 and select a visitor.");
      return;
    }
    const pUid = user?.ResultSet?.[0]?.VA_Name || "ContactPerson";
    setLicenseUploading((prev) => ({ ...prev, [index]: "uploading" }));
    try {
      await VisitorAttachmentService.UploadAttachment(
        visitorId,
        "Vehicle Insurance",
        pUid,
        file
      );
      setLicenseUploading((prev) => ({ ...prev, [index]: "done" }));
      setTimeout(() => setLicenseUploading((prev) => { const n = { ...prev }; delete n[index]; return n; }), 3000);
    } catch (err) {
      console.error("License upload failed:", err);
      setLicenseUploading((prev) => ({ ...prev, [index]: "error" }));
      setTimeout(() => setLicenseUploading((prev) => { const n = { ...prev }; delete n[index]; return n; }), 3000);
    }
  };


  const handleVehicleSave = async (index) => {
    const vehicle = vehicles[index];
    if (vehicle.isConfirmed) {
      dispatch(toggleVehicleConfirmed(index));
      return;
    }
    if (!vehicle.number?.trim()) {
      alert("Please enter a plate number before saving.");
      return;
    }
    const plateErr = validatePlateNumber(vehicle.number);
    if (plateErr) {
      alert(plateErr);
      return;
    }
    if (!effectiveRequestId) {
      alert("Visit request not found. Please go back to Step 1.");
      return;
    }
    setVehicleSavingIndex(index);
    try {
      await dispatch(AddVehicle({
        VV_Vehicle_Type: vehicle.type,
        VV_Vehicle_Number: vehicle.number,
        VVR_Request_id: effectiveRequestId
      }));
      dispatch(markVehicleSaved(index));
      dispatch(toggleVehicleConfirmed(index));
    } catch (err) {
      console.error("Failed to save vehicle:", err);
      alert("Failed to save vehicle. Please try again.");
    } finally {
      setVehicleSavingIndex(null);
    }
  };

  const handleAddVehicle = async () => {
    const unsaved = vehicles.find(v => !v.isConfirmed && v.number?.trim());
    if (unsaved) {
      const idx = vehicles.indexOf(unsaved);
      await handleVehicleSave(idx);
    } else {
      dispatch(addVehicle());
    }
  };

  const handlePersonSave = async (index) => {
    const person = people[index];
    if (person.isConfirmed) {
      dispatch(togglePersonConfirmed(index));
      return;
    }

    // Validations
    const nameErr = validateName(person.name);
    if (nameErr) { alert(nameErr); return; }
    const nicErr = validateNIC(person.nic);
    if (nicErr) { alert(nicErr); return; }
    const phoneErr = validatePhone(person.phone);
    if (phoneErr) { alert(phoneErr); return; }

    // Check blacklist
    const isBlacklisted = blacklists.some(
      (b) =>
        (b.VB_Name && b.VB_Name.toLowerCase() === person.name?.toLowerCase() && b.VB_Status === "A")
    );

    if (isBlacklisted) {
      alert(`Access Restricted for ${person.name}. Please connect with the system administrator.`);
      return;
    }

    if (!effectiveRequestId) {
      alert("Visit request not found. Please go back to Step 1.");
      return;
    }
    setPersonSavingIndex(index);
    try {
      const response = await dispatch(AddVisitGroup({
        VVG_Visitor_Name: person.name,
        VVG_NIC_Passport_Number: person.nic,
        VVG_Designation: person.phone,
        VVR_Request_id: effectiveRequestId,
        VVG_Status: "A"
      }));

      // Log the raw response so we can verify the exact shape in DevTools
      console.log("[AddVisitGroup response]", response);

      // Extract the sub-visitor's VVG_id from the API response ResultSet
      const vvgId = response?.ResultSet?.[0]?.VVG_id;
      if (vvgId) {
        dispatch(updatePerson({ index, field: "vvgId", value: vvgId }));
      } else {
        console.warn("[AddVisitGroup] VVG_id not found in ResultSet. Full response:", JSON.stringify(response));
      }

      dispatch(markPersonSaved(index));
      dispatch(togglePersonConfirmed(index));
    } catch (err) {
      console.error("Failed to save person:", err);
      alert("Failed to save visitor. Please try again.");
    } finally {
      setPersonSavingIndex(null);
    }
  };

  const handlePersonNameChange = (index, value) => {
    const sanitizedValue = value.replace(/[^A-Za-z\s]/g, "");
    dispatch(updatePerson({ index, field: "name", value: sanitizedValue }));

    // Find if the entered name matches a known visitor for autocomplete
    const matchedVisitor = allVisitors.find(v =>
      v.VV_Name?.trim().toLowerCase() === sanitizedValue?.trim().toLowerCase()
    );
    if (matchedVisitor) {
      // Auto-fill NIC and Phone if matched
      if (matchedVisitor.VV_NIC_Passport_NO) {
        dispatch(updatePerson({ index, field: "nic", value: matchedVisitor.VV_NIC_Passport_NO }));
      }
      if (matchedVisitor.VV_Phone) {
        dispatch(updatePerson({ index, field: "phone", value: matchedVisitor.VV_Phone }));
      } else if (matchedVisitor.VV_Designation && matchedVisitor.VV_Designation !== 'N/A') {
        dispatch(updatePerson({ index, field: "phone", value: matchedVisitor.VV_Designation }));
      }
    }
  };

  const handleAddPerson = async () => {
    const unsaved = people.find(p => !p.isConfirmed && p.name?.trim());
    if (unsaved) {
      await handlePersonSave(people.indexOf(unsaved));
    } else {
      dispatch(addPerson());
    }
  };

  const handleItemSave = async (index) => {
    const item = items[index];
    if (item.isConfirmed) {
      dispatch(toggleItemConfirmed(index));
      return;
    }
    if (!item.name?.trim()) {
      alert("Please enter an item name before saving.");
      return;
    }
    if (!effectiveRequestId) {
      alert("Visit request not found. Please go back to Step 1.");
      return;
    }
    setItemSavingIndex(index);
    try {
      await dispatch(AddItem({
        VIC_Item_Name: item.name,
        VIC_Quantity: item.quantity,
        VIC_Designation: item.description || "N/A",
        VVR_Request_id: effectiveRequestId
      }));
      dispatch(markItemSaved(index));
      dispatch(toggleItemConfirmed(index));
    } catch (err) {
      console.error("Failed to save item:", err);
      alert("Failed to save item. Please try again.");
    } finally {
      setItemSavingIndex(null);
    }
  };

  const handleAddItem = async () => {
    const unsaved = items.find(i => !i.isConfirmed && i.name?.trim());
    if (unsaved) {
      await handleItemSave(items.indexOf(unsaved));
    } else {
      dispatch(addItem());
    }
  };

  const handleSubVisitorItemSave = async (index) => {
    const item = subVisitorItems[index];
    if (item.isConfirmed) {
      dispatch(toggleSubVisitorItemConfirmed(index));
      return;
    }
    if (!item.subVisitorName?.trim() || !item.name?.trim()) {
      alert("Please select a sub-visitor and enter an item name before saving.");
      return;
    }
    if (!effectiveRequestId) {
      alert("Visit request not found. Please go back to Step 1.");
      return;
    }
    // API will be added later; simulate save for now
    setSubVisitorItemSavingIndex(index);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      dispatch(markSubVisitorItemSaved(index));
      dispatch(toggleSubVisitorItemConfirmed(index));
    } catch (err) {
      console.error("Failed to save sub-visitor item:", err);
      alert("Failed to save sub-visitor item. Please try again.");
    } finally {
      setSubVisitorItemSavingIndex(null);
    }
  };

  const handleAddSubVisitorItem = async () => {
    const unsaved = subVisitorItems.find(i => !i.isConfirmed && i.name?.trim());
    if (unsaved) {
      await handleSubVisitorItemSave(subVisitorItems.indexOf(unsaved));
    } else {
      dispatch(addSubVisitorItem());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setSubmitting(true));
    try {
      const requestId = effectiveRequestId;
      if (!requestId) {
        alert("Visit request ID not found. Please go back to Step 1 and try again.");
        dispatch(setSubmitting(false));
        return;
      }

      // Final batch save if any unsaved items exist
      const vehiclePromises = vehicles
        .filter(v => v.number && !v.isSavedToServer)
        .map(v => dispatch(AddVehicle({
          VV_Vehicle_Type: v.type,
          VV_Vehicle_Number: v.number,
          VVR_Request_id: requestId
        })));

      const peoplePromises = people
        .filter(p => p.name && !p.isSavedToServer)
        .map(p => {
          // Pre-submission check
          if (validateName(p.name) || validateNIC(p.nic) || validatePhone(p.phone)) return Promise.resolve();
          return dispatch(AddVisitGroup({
            VVG_Visitor_Name: p.name,
            VVG_NIC_Passport_Number: p.nic,
            VVG_Designation: p.phone,
            VVR_Request_id: requestId,
            VVG_Status: "A"
          }));
        });

      const itemPromises = items
        .filter(i => i.name && !i.isSavedToServer)
        .map(i => dispatch(AddItem({
          VIC_Item_Name: i.name,
          VIC_Quantity: i.quantity,
          VIC_Designation: i.description || "N/A",
          VVR_Request_id: requestId
        })));

      await Promise.all([...vehiclePromises, ...peoplePromises, ...itemPromises]);
      navigate(`/contact_person/visit-request-success/${requestId}`);
    } catch (err) {
      console.error("Submission failed:", err);
      dispatch(setError(err.message));
      alert("Something went wrong. Please try again.");
    } finally {
      dispatch(setSubmitting(false));
    }
  };

  return (
    <div className="contact-theme-root flex bg-[#F8F9FA] overflow-hidden text-[#1A1A1A] h-screen w-full">
      <div className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] overflow-hidden">
        <Header title="Additional Details" />

        <main className="flex-1 overflow-y-auto p-6 pt-12 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-4 animate-fade-in-slow pb-4">

            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white text-[12px] font-normal flex items-center justify-center"><CheckCircle2 size={12} /></div>
              <span className="text-[12px] font-normal capitalize tracking-widest text-gray-500">Core info</span>
            </div>
            <div className="h-[1px] w-12 bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-primary text-white text-[12px] font-normal flex items-center justify-center">2</div>
              <span className="text-[12px] font-normal capitalize tracking-widest text-primary">Details</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-20">

              <div className="bg-white p-3 rounded-[12px] shadow-[0_5px_15px_rgba(0,0,0,0.015)] border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-2">
                  <SectionHeader title="Vehicle Details" icon={Car} />
                  <button type="button" onClick={handleAddVehicle} className="flex items-center gap-2 px-3 h-10 rounded-lg bg-primary/5 border border-primary/20 text-primary text-[12px] font-normal capitalize tracking-widest hover:bg-primary/10 transition-all shadow-sm">
                    <Plus size={12} /> Add vehicle
                  </button>
                </div>

                <div className="space-y-1">
                  {vehicles.map((v, index) => (
                    <div key={index} className={`grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-2 rounded-xl border transition-all ${v.isConfirmed ? "bg-green-50/30 border-green-200" : "bg-gray-50/50 border-gray-100"} relative group`}>
                      <div className="md:col-span-3">
                        <label className="text-[12px] font-medium text-gray-400 capitalize tracking-[0.15em] mb-1 flex px-0.5">Type</label>
                        <select
                          disabled={v.isConfirmed}
                          value={v.type}
                          onChange={(e) => dispatch(updateVehicle({ index, field: "type", value: e.target.value }))}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] font-normal appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/5 disabled:opacity-60"
                        >
                          <option value="Car">Car</option>
                          <option value="Van">Van</option>
                          <option value="Truck">Truck</option>
                          <option value="Motorbike">Motorbike</option>
                        </select>
                      </div>
                      <div className="md:col-span-7">
                        <InputField
                          disabled={v.isConfirmed}
                          label="Plate Number"
                          value={v.number}
                          onChange={(e) => dispatch(updateVehicle({ index, field: "number", value: e.target.value }))}
                          placeholder="WP CAS 1234"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-2 pb-1">
                        {/* Hidden file input for license */}
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf,.xlsx"
                          className="hidden"
                          ref={(el) => { licenseInputRefs.current[index] = el; }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleLicenseFileChange(index, file);
                            e.target.value = "";
                          }}
                        />
                        {/* License attachment button — icon only, "License" shown as tooltip */}
                        <button
                          type="button"
                          onClick={() => handleLicenseUpload(index)}
                          disabled={licenseUploading[index] === "uploading"}
                          title="Vehicle Insurance"
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 border ${licenseUploading[index] === "done"
                            ? "border-green-300 text-green-600 bg-green-50"
                            : licenseUploading[index] === "error"
                              ? "border-red-300 text-red-500 bg-red-50"
                              : "border-primary/20 text-primary/70 bg-primary/5 hover:bg-primary/10 hover:text-primary"
                            }`}
                        >
                          {licenseUploading[index] === "uploading" ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : licenseUploading[index] === "done" ? (
                            <CheckCircle2 size={15} />
                          ) : licenseUploading[index] === "error" ? (
                            <AlertCircle size={15} />
                          ) : (
                            <Paperclip size={15} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleVehicleSave(index)}
                          disabled={vehicleSavingIndex === index}
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 ${v.isConfirmed ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "text-gray-300 hover:text-primary hover:bg-primary/5"}`}
                          title={v.isConfirmed ? "Edit Entry" : "Save to Server"}
                        >
                          {vehicleSavingIndex === index
                            ? <Loader2 size={16} className="animate-spin" />
                            : v.isConfirmed ? <Edit2 size={16} /> : <Save size={16} />}
                        </button>
                        <button type="button" onClick={() => dispatch(removeVehicle(index))} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  {vehicles.length === 0 && <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl"><p className="text-[12px] font-normal text-gray-300 uppercase tracking-widest">No vehicles added</p></div>}
                </div>
              </div>

              <div className="bg-white p-3 rounded-[12px] shadow-[0_5px_15px_rgba(0,0,0,0.015)] border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <SectionHeader title="Additional Visitors" icon={Users} />
                  <button type="button" onClick={handleAddPerson} className="flex items-center gap-2 px-3 h-10 rounded-lg bg-primary/5 border border-primary/20 text-primary text-[12px] font-normal capitalize tracking-widest hover:bg-primary/10 transition-all shadow-sm">
                    <Plus size={12} /> Add person
                  </button>
                </div>

                <div className="space-y-2">
                  <datalist id="visitor-names">
                    {allVisitors.map((v, idx) => (
                      <option key={`${v.VV_Visitor_id}-${idx}`} value={v.VV_Name}>
                        {v.VV_NIC_Passport_NO ? `ID: ${v.VV_NIC_Passport_NO}` : ''}
                      </option>
                    ))}
                  </datalist>
                  {people.map((p, index) => (
                    <div key={index} className={`grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3 rounded-xl border transition-all ${p.isConfirmed ? "bg-green-50/30 border-green-200" : "bg-gray-50/50 border-gray-100"}`}>
                      <div className="md:col-span-3">
                        <InputField
                          disabled={p.isConfirmed}
                          label="Name"
                          value={p.name}
                          list="visitor-names"
                          onChange={(e) => {
                            const val = e.target.value;
                            handlePersonNameChange(index, val);
                          }}
                          placeholder="Full Name"
                        />
                      </div>
                      <div className="md:col-span-4">
                        <InputField
                          disabled={p.isConfirmed}
                          label="NIC"
                          value={p.nic}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 12);
                            dispatch(updatePerson({ index, field: "nic", value: val }));
                          }}
                          placeholder="ID Number"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <InputField
                          disabled={p.isConfirmed}
                          label="Contact"
                          value={p.phone}
                          onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                            dispatch(updatePerson({ index, field: "phone", value: val }));
                          }}
                          placeholder="07XXXXXXXX"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-2 pb-1">
                        <button
                          type="button"
                          onClick={() => openAttachmentModal(index, p.name)}
                          disabled={personUploading[index] === "uploading"}
                          title="Attach ID Document"
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 border ${personUploading[index] === "done"
                            ? "border-green-300 text-green-600 bg-green-50"
                            : personUploading[index] === "error"
                              ? "border-red-300 text-red-500 bg-red-50"
                              : "border-primary/20 text-primary/70 bg-primary/5 hover:bg-primary/10 hover:text-primary"
                            }`}
                        >
                          {personUploading[index] === "uploading" ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : personUploading[index] === "done" ? (
                            <CheckCircle2 size={15} />
                          ) : personUploading[index] === "error" ? (
                            <AlertCircle size={15} />
                          ) : (
                            <Paperclip size={15} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePersonSave(index)}
                          disabled={personSavingIndex === index}
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 ${p.isConfirmed ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "text-gray-300 hover:text-primary hover:bg-primary/5"}`}
                        >
                          {personSavingIndex === index ? <Loader2 size={16} className="animate-spin" /> : p.isConfirmed ? <Edit2 size={16} /> : <Save size={16} />}
                        </button>
                        <button type="button" onClick={() => dispatch(removePerson(index))} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  {people.length === 0 && <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl"><p className="text-[12px] font-normal text-gray-300 uppercase tracking-widest">No additional visitors</p></div>}
                </div>
              </div>

              <div className="bg-white p-3 rounded-[12px] shadow-[0_5px_15px_rgba(0,0,0,0.015)] border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                  <SectionHeader title="Items to Bring" icon={Package} />
                  <button type="button" onClick={handleAddItem} className="flex items-center gap-2 px-3 h-10 rounded-lg bg-primary/5 border border-primary/20 text-primary text-[12px] font-normal capitalize tracking-widest hover:bg-primary/10 transition-all shadow-sm">
                    <Plus size={12} /> Add item
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((i, index) => (
                    <div key={index} className={`grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-3 rounded-xl border transition-all ${i.isConfirmed ? "bg-green-50/30 border-green-200" : "bg-gray-50/50 border-gray-100"}`}>
                      <div className="md:col-span-3">
                        <InputField disabled={i.isConfirmed} label="Item" value={i.name} onChange={(e) => dispatch(updateItem({ index, field: "name", value: e.target.value }))} placeholder="e.g. Laptop" />
                      </div>
                      <div className="md:col-span-2">
                        <InputField disabled={i.isConfirmed} label="Qty" value={i.quantity} onChange={(e) => dispatch(updateItem({ index, field: "quantity", value: e.target.value }))} placeholder="e.g. 1" />
                      </div>
                      <div className="md:col-span-5">
                        <InputField disabled={i.isConfirmed} label="Description" value={i.description} onChange={(e) => dispatch(updateItem({ index, field: "description", value: e.target.value }))} placeholder="Details or Serial No" />
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-2 pb-1">
                        <button
                          type="button"
                          onClick={() => handleItemSave(index)}
                          disabled={itemSavingIndex === index}
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 ${i.isConfirmed ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "text-gray-300 hover:text-primary hover:bg-primary/5"}`}
                        >
                          {itemSavingIndex === index ? <Loader2 size={16} className="animate-spin" /> : i.isConfirmed ? <Edit2 size={16} /> : <Save size={16} />}
                        </button>
                        <button type="button" onClick={() => dispatch(removeItem(index))} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl"><p className="text-[12px] font-bold text-gray-300 uppercase tracking-widest">No items declared</p></div>}
                </div>
              </div>

              {/* 
              <div className="bg-white p-4 md:p-5 rounded-[12px] shadow-[0_5px_15px_rgba(0,0,0,0.015)] border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <SectionHeader title="Sub-Visitor Items Carried" icon={Package} />
                  <button type="button" onClick={handleAddSubVisitorItem} className="flex items-center gap-2 px-3 h-10 rounded-lg bg-primary/5 border border-primary/20 text-primary text-[12px] font-normal capitalize tracking-widest hover:bg-primary/10 transition-all shadow-sm">
                    <Plus size={12} /> Add sub-visitor item
                  </button>
                </div>

                <div className="space-y-3">
                  {subVisitorItems.map((i, index) => (
                    <div key={index} className={`grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 rounded-xl border transition-all ${i.isConfirmed ? "bg-green-50/30 border-green-200" : "bg-gray-50/50 border-gray-100"}`}>
                      <div className="md:col-span-3">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1.5 flex px-0.5">Sub-Visitor</label>
                        <select
                          disabled={i.isConfirmed}
                          value={i.subVisitorName}
                          onChange={(e) => {
                            const val = e.target.value;
                            dispatch(updateSubVisitorItem({ index, field: "subVisitorName", value: val }));
                            const matchedPerson = people.find(p => p.name === val);
                            if (matchedPerson) {
                              dispatch(updateSubVisitorItem({ index, field: "subVisitorNic", value: matchedPerson.nic }));
                              dispatch(updateSubVisitorItem({ index, field: "subVisitorPhone", value: matchedPerson.phone }));
                            }
                          }}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[12px] font-normal appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/5 disabled:opacity-60"
                        >
                          <option value="">Select Sub-Visitor...</option>
                          {people.map((p, pIdx) => (
                            <option key={pIdx} value={p.name}>{p.name || `Visitor ${pIdx + 1}`}</option>
                          ))}
                        </select>
                      </div>
                      <div className="md:col-span-3">
                        <InputField disabled={i.isConfirmed} label="Item" value={i.name} onChange={(e) => dispatch(updateSubVisitorItem({ index, field: "name", value: e.target.value }))} placeholder="e.g. Laptop" />
                      </div>
                      <div className="md:col-span-2">
                        <InputField disabled={i.isConfirmed} label="Qty" value={i.quantity} onChange={(e) => dispatch(updateSubVisitorItem({ index, field: "quantity", value: e.target.value }))} placeholder="e.g. 1" />
                      </div>
                      <div className="md:col-span-2">
                        <InputField disabled={i.isConfirmed} label="Description" value={i.description} onChange={(e) => dispatch(updateSubVisitorItem({ index, field: "description", value: e.target.value }))} placeholder="Details" />
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-2 pb-1">
                        <button
                          type="button"
                          onClick={() => handleSubVisitorItemSave(index)}
                          disabled={subVisitorItemSavingIndex === index}
                          className={`p-2 rounded-lg transition-all disabled:opacity-50 ${i.isConfirmed ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "text-gray-300 hover:text-primary hover:bg-primary/5"}`}
                          title={i.isConfirmed ? "Edit Entry" : "Save Item (API pending)"}
                        >
                          {subVisitorItemSavingIndex === index ? <Loader2 size={16} className="animate-spin" /> : i.isConfirmed ? <Edit2 size={16} /> : <Save size={16} />}
                        </button>
                        <button type="button" onClick={() => dispatch(removeSubVisitorItem(index))} className="p-2 text-gray-300 hover:text-red-500 transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  ))}
                  {subVisitorItems.length === 0 && <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl"><p className="text-[12px] font-normal text-gray-300 uppercase tracking-widest">No sub-visitor items declared</p></div>}
                </div>
              </div>
              */}

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12 pb-10">
                <button
                  type="button"
                  onClick={() => navigate("/contact_person/create-visit-request")}
                  className="w-full sm:w-auto px-12 h-11 rounded-xl text-[12px] font-medium tracking-[0.1em] text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all uppercase"
                >
                  Back to core info
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-12 h-11 bg-primary hover:bg-[var(--color-primary-hover)] text-white text-[12px] font-bold tracking-[0.1em] rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-95 disabled:opacity-50 uppercase"
                >
                  {isSubmitting ? "Submitting..." : "Complete & submit"}
                </button>
              </div>

            </form>
          </div>
        </main>
      </div>

      {/* ── Attachment Upload Modal ── */}
      {attachmentModal.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/20 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-5 bg-primary rounded-full" />
                <div>
                  <h2 className="text-[12px] font-normal text-white tracking-[0.16em]">Upload ID Document</h2>
                  {attachmentModal.personName && (
                    <p className="text-[10px] text-white/40 tracking-widest mt-0.5">
                      {attachmentModal.personName}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeAttachmentModal}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 relative z-10">
              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-[11px] text-gray-400 tracking-[0.14em] font-normal">
                  Document type
                </label>
                <div className="flex gap-2">
                  {["nic", "passport", "driving_licence"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setAttachCategory(cat)}
                      className={`flex-1 py-2 rounded-lg text-[11px] font-normal tracking-widest uppercase transition-all border ${
                        attachCategory === cat
                          ? "bg-primary/20 border-primary/50 text-primary"
                          : "bg-black/30 border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      {cat === "nic" ? "NIC" : cat === "passport" ? "Passport" : "Driving Licence"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drop zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setAttachDragOver(true);
                }}
                onDragLeave={() => setAttachDragOver(false)}
                onDrop={handleAttachDrop}
                onClick={() => attachFileInputRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed transition-all p-6 flex flex-col items-center justify-center gap-3 ${
                  attachDragOver
                    ? "border-primary/70 bg-primary/10"
                    : attachFile
                      ? "border-green-500/40 bg-green-500/5"
                      : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30"
                }`}
              >
                <input
                  ref={attachFileInputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf,.xlsx"
                  className="hidden"
                  onChange={handleAttachFileChange}
                />
                {attachFile ? (
                  <>
                    <FileText size={28} className="text-green-400" />
                    <p className="text-[11px] text-green-300 tracking-wide text-center">{attachFile.name}</p>
                    <p className="text-[10px] text-white/30">
                      {(attachFile.size / 1024).toFixed(1)} KB · Click to change
                    </p>
                  </>
                ) : (
                  <>
                    <Upload size={28} className="text-white/20" />
                    <p className="text-[11px] text-white/40 tracking-wide text-center">Drag & drop or click to select</p>
                    <p className="text-[10px] text-white/20">JPG, PNG, PDF accepted</p>
                  </>
                )}
              </div>

              {/* Result message */}
              {attachResult && (
                <div
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-[11px] font-normal tracking-wide ${
                    attachResult.success
                      ? "bg-green-500/10 border border-green-500/20 text-green-300"
                      : "bg-red-500/10 border border-red-500/20 text-red-300"
                  }`}
                >
                  {attachResult.success ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  {attachResult.message}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={closeAttachmentModal}
                  className="flex-1 py-2 rounded-lg text-[11px] font-normal tracking-[0.14em] text-gray-400 hover:bg-white/5 transition-all border border-white/5"
                >
                  {attachResult?.success ? "Done" : "Cancel"}
                </button>

                <button
                  type="button"
                  onClick={handleAttachUpload}
                  disabled={!attachFile || attachUploading || attachResult?.success}
                  className="flex-1 py-2 rounded-lg text-[11px] font-normal tracking-[0.14em] bg-primary hover:bg-[var(--color-primary-hover)] text-white shadow-lg shadow-primary/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {attachUploading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...
                    </>
                  ) : attachResult?.success ? (
                    <>
                      <CheckCircle size={13} /> Uploaded
                    </>
                  ) : (
                    <>
                      <Upload size={13} /> Upload
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-gray-100 p-6 text-center relative animate-fade-in">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(34,197,94,0.15)]">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-[15px] font-bold text-gray-800 tracking-tight mb-2">
              Basic Details Saved!
            </h3>
            <p className="text-[12px] text-gray-500 leading-relaxed tracking-wide mb-6">
              Basic details have been saved successfully. Click Continue and then Submit to send the email and SMS invitation to the visitor. Otherwise, the email and SMS will not be sent.
             
            </p>
            <button
              onClick={() => setShowSaveModal(false)}
              className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-[12px] font-bold tracking-wider rounded-xl shadow-lg shadow-green-600/20 hover:shadow-green-600/35 transition-all active:scale-95 uppercase"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateVisitRequestDetails;
