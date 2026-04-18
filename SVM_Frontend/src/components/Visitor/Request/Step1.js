import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import VisitorOverview from "./Step1/VisitorOverview";
import VehicleDetails from "./Step1/VehicleDetails";
import { createVisitorRequest } from "../../../services/visitorRequestService";
import { GetAdministratorById } from "../../../actions/AdministratorAction";
import {
  AddVisitRequest,
  GetVisitRequestsByVisitor,
  UpdateVisitRequest,
  ApproveVisitRequest
} from "../../../actions/VisitRequestAction";
import VisitorService from "../../../services/VisitorService";
import { AddVehicle, GetAllVehicles, UpdateVehicle } from "../../../actions/VehicleAction";
import {
  updateField,
  setStatus,
  setRequestRef,
} from "../../../reducers/visitorSlice";

const Step1Main = () => {
  const navigate = useNavigate();
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return "";

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue;

    const parsed = new Date(dateValue);
    if (!isNaN(parsed.getTime())) {
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, "0");
      const day = String(parsed.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    return "";
  };
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.visitor);
  const { status, requestRef } = formData;
  const user = useSelector((state) => state.login.user);
  const { administrators } = useSelector((state) => state.administrator);
  const { visitRequestsByVis, isLoading: isRequestsLoading } = useSelector(
    (state) => state.visitRequestsState,
  );
  const { vehicles } = useSelector((state) => state.vehicleState || {});

  // Authenticated credentials
  const authUser = user?.ResultSet?.[0];
  const userEmail = authUser?.VA_Email;
  const adminId = authUser?.VA_Admin_id;
  const [visitorRecord, setVisitorRecord] = React.useState(null);

  // Fetch Administrator, matched Visitor record, and Vehicles
  useEffect(() => {
    const loadVisitorRecord = async () => {
      try {
        const response = await VisitorService.GetAllVisitors();
        const visitors = response?.data?.ResultSet || [];

        console.log("All Visitors:", visitors);
        console.log("Logged user email:", userEmail);

        const match = visitors.find(
          (v) =>
            (v.VV_Email || "").trim().toLowerCase() ===
            (userEmail || "").trim().toLowerCase(),
        );

        console.log("Matched visitorRecord:", match);
        setVisitorRecord(match || null);

        if (match?.VV_Visitor_id) {
          dispatch(GetVisitRequestsByVisitor(match.VV_Visitor_id));
        }
      } catch (err) {
        console.error("Error loading visitor record:", err);
        setVisitorRecord(null);
      }
    };

    if (authUser?.VA_Role === "Visitor" && adminId) {
      dispatch(GetAdministratorById(adminId));
      dispatch(GetAllVehicles());
    }

    if (userEmail) {
      loadVisitorRecord();
    }
  }, [dispatch, authUser, adminId, userEmail]);

  // Pre-fill visitor profile data
  useEffect(() => {
    if (visitorRecord) {
      if (!formData.fullName)
        dispatch(
          updateField({
            name: "fullName",
            value: visitorRecord.VV_Name || "",
          }),
        );

      if (!formData.nic)
        dispatch(
          updateField({
            name: "nic",
            value: visitorRecord.VV_NIC_Passport_NO || "",
          }),
        );

      if (!formData.phoneNumber)
        dispatch(
          updateField({
            name: "phoneNumber",
            value: visitorRecord.VV_Phone || "",
          }),
        );

      if (!formData.emailAddress)
        dispatch(
          updateField({
            name: "emailAddress",
            value: visitorRecord.VV_Email || "",
          }),
        );

      if (!formData.representingCompany)
        dispatch(
          updateField({
            name: "representingCompany",
            value: visitorRecord.VV_Company || "",
          }),
        );

      if (!formData.visitorClassification)
        dispatch(
          updateField({
            name: "visitorClassification",
            value: visitorRecord.VV_Visitor_Type || "",
          }),
        );

      return;
    }

    if (administrators && administrators.length > 0) {
      const admin = administrators[0];
      if (!formData.fullName)
        dispatch(updateField({ name: "fullName", value: admin.VA_Name || "" }));
      if (!formData.emailAddress)
        dispatch(
          updateField({ name: "emailAddress", value: admin.VA_Email || "" }),
        );
    }
  }, [
    dispatch,
    visitorRecord,
    administrators,
    formData.fullName,
    formData.nic,
    formData.phoneNumber,
    formData.emailAddress,
    formData.representingCompany,
    formData.visitorClassification,
  ]);

  // Pre-fill request and vehicle data
  useEffect(() => {
    if (visitRequestsByVis && visitRequestsByVis.length > 0) {
      const latestRequest = visitRequestsByVis[0];
      console.log("Matched latestRequest:", latestRequest);

      // Block access if already accepted
      const normalizedStatus = (latestRequest.VVR_Status || "").toString().trim().toUpperCase();
      if (normalizedStatus === "ACCEPTED" || normalizedStatus === "A" || normalizedStatus === "APPROVED") {
        alert("This visit request has already been accepted and sent to the contact person.");
        navigate("/home", { replace: true });
        return;
      }

      if (!formData.proposedVisitDate)
        dispatch(
          updateField({
            name: "proposedVisitDate",
            value: formatDateForInput(latestRequest.VVR_Visit_Date),
          }),
        );

      if (!formData.visitingArea)
        dispatch(
          updateField({
            name: "visitingArea",
            value: latestRequest.VVR_Places_to_Visit || "",
          }),
        );

      if (!formData.purposeOfVisitation)
        dispatch(
          updateField({
            name: "purposeOfVisitation",
            value: latestRequest.VVR_Purpose || "",
          }),
        );

      if (vehicles && vehicles.length > 0) {
        const matchedVehicle = vehicles.find(
          (v) =>
            String(v.VVR_Request_id) === String(latestRequest.VVR_Request_id),
        );

        console.log("Matched vehicle:", matchedVehicle);

        if (matchedVehicle) {
          if (!formData.vehicleType)
            dispatch(
              updateField({
                name: "vehicleType",
                value: matchedVehicle.VV_Vehicle_Type || "",
              }),
            );

          if (!formData.plateNumber)
            dispatch(
              updateField({
                name: "plateNumber",
                value: matchedVehicle.VV_Vehicle_Number || "",
              }),
            );
        }
      }
    }
  }, [
    dispatch,
    visitRequestsByVis,
    vehicles,
    formData.proposedVisitDate,
    formData.visitingArea,
    formData.purposeOfVisitation,
    formData.vehicleType,
    formData.plateNumber,
  ]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    dispatch(
      updateField({
        name,
        value: type === "checkbox" ? checked : value,
      }),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setStatus("submitting"));

    try {
      const latestRequest = visitRequestsByVis?.[0];

      if (latestRequest?.VVR_Request_id) {
        const payload = {
          VVR_Request_id: latestRequest.VVR_Request_id,
          VVR_Visit_Date:
            formData.proposedVisitDate ||
            formatDateForInput(latestRequest.VVR_Visit_Date),
          VVR_Places_to_Visit:
            formData.visitingArea || latestRequest.VVR_Places_to_Visit || "",
          VVR_Purpose:
            formData.purposeOfVisitation || latestRequest.VVR_Purpose || "",
          VVR_Visitor_id:
            visitorRecord?.VV_Visitor_id || latestRequest.VVR_Visitor_id,
          VVR_Contact_person_id: latestRequest.VVR_Contact_person_id,
          VVR_Status: "ACCEPTED",
        };

        await dispatch(UpdateVisitRequest(payload));

        // Refresh local requests to ensure state is up to date
        if (visitorRecord?.VV_Visitor_id) {
          dispatch(GetVisitRequestsByVisitor(visitorRecord.VV_Visitor_id));
        }

        const matchedVehicle = (vehicles || []).find(
          (v) => String(v?.VVR_Request_id) === String(latestRequest.VVR_Request_id),
        );

        if (formData.plateNumber || formData.vehicleType) {
          if (matchedVehicle?.VV_Vehicle_id) {
            await dispatch(
              UpdateVehicle({
                VV_Vehicle_id: matchedVehicle.VV_Vehicle_id,
                VV_Vehicle_Number: formData.plateNumber || matchedVehicle.VV_Vehicle_Number || "N/A",
              }),
            );
          } else {
            await dispatch(
              AddVehicle({
                VV_Vehicle_Type: formData.vehicleType || "N/A",
                VV_Vehicle_Number: formData.plateNumber || "N/A",
                VVR_Request_id: latestRequest.VVR_Request_id,
              }),
            );
          }
        }

        dispatch(setRequestRef(String(latestRequest.VVR_Request_id)));
      } else {
        const createPayload = {
          VVR_Visitor_id: visitorRecord?.VV_Visitor_id,
          VVR_Contact_person_id: visitorRecord?.VV_Contact_person_id,
          VVR_Visit_Date: formData.proposedVisitDate,
          VVR_Places_to_Visit: formData.visitingArea,
          VVR_Purpose: formData.purposeOfVisitation,
          VVR_Status: "ACCEPTED",
        };

        const createResponse = await dispatch(AddVisitRequest(createPayload));
        const createdRequestId =
          createResponse?.ResultSet?.[0]?.VVR_Request_id ||
          createResponse?.VVR_Request_id ||
          null;

        if (createdRequestId && (formData.plateNumber || formData.vehicleType)) {
          await dispatch(
            AddVehicle({
              VV_Vehicle_Type: formData.vehicleType || "N/A",
              VV_Vehicle_Number: formData.plateNumber || "N/A",
              VVR_Request_id: createdRequestId,
            }),
          );
        }

        if (createdRequestId) {
          dispatch(setRequestRef(String(createdRequestId)));

          // Refresh local requests
          if (visitorRecord?.VV_Visitor_id) {
            dispatch(GetVisitRequestsByVisitor(visitorRecord.VV_Visitor_id));
          }
        } else {
          const fallbackRequest = createVisitorRequest(formData);
          if (fallbackRequest?.id) {
            dispatch(setRequestRef(fallbackRequest.id));
          }
        }
      }

      navigate("/visitor/my-requests");
    } catch (error) {
      console.error("Failed to submit Step 1 request:", error);
      alert("Failed to submit request. Please try again.");
      dispatch(setStatus(null));
    }
  };

  const latestRequest = visitRequestsByVis?.[0];
  const normalizedStatus = (latestRequest?.VVR_Status || "").toString().trim().toUpperCase();
  const isBlocked = ["ACCEPTED", "A", "APPROVED"].includes(normalizedStatus);

  if (isRequestsLoading && !visitRequestsByVis.length) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isBlocked && status !== "submitting") {
    return null;
  }

  if (status === "step1_pending") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/[0.02] border border-white/5 p-10 text-center rounded-none shadow-2xl relative">
          <div className="absolute top-0 left-0 w-[2px] h-full bg-primary" />
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-none mx-auto mb-8 flex items-center justify-center text-primary">
            <ShieldCheck size={32} />
          </div>

          <h2 className="text-xl font-bold text-white uppercase tracking-[0.2em] mb-3">
            Identity Verified
          </h2>
          <p className="text-gray-500 text-[12px] font-medium uppercase tracking-[0.3em] mb-10 leading-relaxed">
            Access record established for{" "}
            <span className="text-white font-semibold">{requestRef}</span>
          </p>

          <div className="flex flex-col gap-4">
            <button
              onClick={() => (window.location.href = "/status")}
              className="w-full py-4 bg-primary text-white font-bold uppercase text-[12px] tracking-[0.3em] hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
            >
              Track Status <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-2 pb-12 text-white bg-black">
      {/* Header Section */}
      <div className="mb-14 flex items-center justify-between border-b border-white/5 pb-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-primary font-black text-[11px] uppercase tracking-[0.4em] opacity-70">
              Phase 01 / 02
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2 leading-none">
            Visitor Registration
          </h1>
          <p className="text-gray-500 text-[12px] uppercase font-bold tracking-[0.4em] opacity-80">
            Facility Access Clearance Request
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-24">
        <VisitorOverview data={formData} onChange={handleInputChange} />

        <div className="border-t border-white/5 pt-16">
          <VehicleDetails data={formData} onChange={handleInputChange} />
        </div>

        {/* Action Footer */}
        <div className="pt-16 border-t border-white/5 flex flex-col sm:flex-row gap-6 items-center justify-center">
          <button
            type="button"
            onClick={() => (window.location.href = "/home")}
            className="w-full sm:w-auto px-16 h-16 bg-white/[0.03] border border-white/10 text-gray-400 font-black uppercase text-[12px] tracking-[0.3em] hover:bg-white/5 hover:text-white transition-all transition-all"
          >
            SUBMIT ACCESS REQUEST
          </button>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto px-20 h-16 bg-primary hover:bg-primary-hover text-white font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
          >
            {status === "submitting" ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                ACCEPT
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1Main;
