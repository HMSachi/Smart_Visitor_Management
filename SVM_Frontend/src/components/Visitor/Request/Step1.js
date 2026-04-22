import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import VisitorOverview from "./Step1/VisitorOverview";
import VehicleDetails from "./Step1/VehicleDetails";
import { createVisitorRequest } from "../../../services/visitorRequestService";
import { GetAdministratorById } from "../../../actions/AdministratorAction";
import {
  AddVisitRequest,
  GetVisitRequestsByVisitor,
  UpdateVisitRequest,
  ApproveVisitRequest,
} from "../../../actions/VisitRequestAction";
import VisitorService from "../../../services/VisitorService";
import {
  AddVehicle,
  GetAllVehicles,
  UpdateVehicle,
} from "../../../actions/VehicleAction";
import { AddVisitGroup } from "../../../actions/VisitGroupAction";
import { AddItem } from "../../../actions/ItemCarriedAction";
import {
  updateField,
  setStatus,
  setRequestRef,
  addVisitor,
  removeVisitor,
  updateVisitorDetail,
  addEquipment,
  removeEquipment,
  updateEquipmentDetail,
} from "../../../reducers/visitorSlice";
import VisitorGroup from "./Step1/VisitorGroup";
import ItemsCarried from "./Step1/ItemsCarried";

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
  const { status, requestRef, visitors, equipment } = formData;
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

    if (authUser && adminId) {
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
      const normalizedStatus = (latestRequest.VVR_Status || "")
        .toString()
        .trim()
        .toUpperCase();
      if (
        normalizedStatus === "ACCEPTED" ||
        normalizedStatus === "A" ||
        normalizedStatus === "APPROVED"
      ) {
        alert(
          "This visit request has already been accepted and sent to the contact person.",
        );
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

      const visitorRequestIds = (visitRequestsByVis || []).map((r) =>
        String(r.VVR_Request_id),
      );

      // Priority 1: Vehicle linked to THIS request (if it has a valid plate)
      // Priority 2: Most recent vehicle from ANY of this visitor's requests (that isn't "N/A")
      // Priority 3: Fallback to current request's record even if "N/A"
      const matchedVehicle =
        vehicles.find(
          (v) =>
            String(v.VVR_Request_id) === String(latestRequest.VVR_Request_id) &&
            v.VV_Vehicle_Number &&
            v.VV_Vehicle_Number !== "N/A",
        ) ||
        vehicles.find(
          (v) =>
            visitorRequestIds.includes(String(v.VVR_Request_id)) &&
            v.VV_Vehicle_Number &&
            v.VV_Vehicle_Number !== "N/A",
        ) ||
        vehicles.find(
          (v) =>
            String(v.VVR_Request_id) === String(latestRequest.VVR_Request_id),
        );

      console.log("Improved matched vehicle lookup:", matchedVehicle);

      if (matchedVehicle) {
        if (!formData.vehicleType || formData.vehicleType === "Car")
          dispatch(
            updateField({
              name: "vehicleType",
              value:
                matchedVehicle.VV_Vehicle_Type &&
                matchedVehicle.VV_Vehicle_Type !== "N/A"
                  ? matchedVehicle.VV_Vehicle_Type
                  : formData.vehicleType || "Car",
            }),
          );

        if (!formData.plateNumber || formData.plateNumber === "N/A")
          dispatch(
            updateField({
              name: "plateNumber",
              value:
                matchedVehicle.VV_Vehicle_Number &&
                matchedVehicle.VV_Vehicle_Number !== "N/A"
                  ? matchedVehicle.VV_Vehicle_Number
                  : "",
            }),
          );
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

  const handleAddVisitor = () => {
    dispatch(addVisitor());
  };

  const handleRemoveVisitor = (id) => {
    dispatch(removeVisitor(id));
  };

  const handleUpdateVisitor = (id, field, value) => {
    dispatch(updateVisitorDetail({ id, field, value }));
  };

  const handleAddEquipment = () => {
    dispatch(addEquipment());
  };

  const handleRemoveEquipment = (id) => {
    dispatch(removeEquipment(id));
  };

  const handleUpdateEquipment = (id, field, value) => {
    dispatch(updateEquipmentDetail({ id, field, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit started. Equipment:", equipment);
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
          (v) =>
            String(v?.VVR_Request_id) === String(latestRequest.VVR_Request_id),
        );

        if (formData.plateNumber || formData.vehicleType) {
          if (matchedVehicle?.VV_Vehicle_id) {
            await dispatch(
              UpdateVehicle({
                VV_Vehicle_id: matchedVehicle.VV_Vehicle_id,
                VV_Vehicle_Number:
                  formData.plateNumber ||
                  matchedVehicle.VV_Vehicle_Number ||
                  "N/A",
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

        // Save Visitor Group members
        if (formData.visitors && formData.visitors.length > 0) {
          for (const visitor of formData.visitors) {
            // Only add if name or NIC is provided to avoid empty records
            if (visitor.fullName || visitor.nic) {
              await dispatch(
                AddVisitGroup({
                  VVG_Visitor_Name: visitor.fullName || "N/A",
                  VVG_NIC_Passport_Number: visitor.nic || "N/A",
                  VVG_Designation: visitor.contact || "N/A", // Using Designation field for contact as discussed
                  VVG_Status: "A",
                  VVR_Request_id: latestRequest.VVR_Request_id,
                }),
              );
            }
          }
        }

        // Save Equipment (Items Carried)
        if (formData.equipment && formData.equipment.length > 0) {
          for (const item of formData.equipment) {
            if (item.itemName) {
              await dispatch(
                AddItem({
                  VVR_Request_id: latestRequest.VVR_Request_id,
                  VIC_Item_Name: item.itemName,
                  VIC_Quantity: item.quantity || "1",
                  VIC_Designation: "GENERAL",
                }),
              );
            }
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

        if (
          createdRequestId &&
          (formData.plateNumber || formData.vehicleType)
        ) {
          await dispatch(
            AddVehicle({
              VV_Vehicle_Type: formData.vehicleType || "N/A",
              VV_Vehicle_Number: formData.plateNumber || "N/A",
              VVR_Request_id: createdRequestId,
            }),
          );
        }

        // Save Visitor Group members for new request
        if (
          createdRequestId &&
          formData.visitors &&
          formData.visitors.length > 0
        ) {
          for (const visitor of formData.visitors) {
            if (visitor.fullName || visitor.nic) {
              await dispatch(
                AddVisitGroup({
                  VVG_Visitor_Name: visitor.fullName || "N/A",
                  VVG_NIC_Passport_Number: visitor.nic || "N/A",
                  VVG_Designation: visitor.contact || "N/A",
                  VVG_Status: "A",
                  VVR_Request_id: createdRequestId,
                }),
              );
            }
          }
        }

        // Save Equipment for new request
        if (
          createdRequestId &&
          formData.equipment &&
          formData.equipment.length > 0
        ) {
          for (const item of formData.equipment) {
            if (item.itemName) {
              await dispatch(
                AddItem({
                  VVR_Request_id: createdRequestId,
                  VIC_Item_Name: item.itemName,
                  VIC_Quantity: item.quantity || "1",
                  VIC_Designation: "GENERAL",
                }),
              );
            }
          }
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
  const normalizedStatus = (latestRequest?.VVR_Status || "")
    .toString()
    .trim()
    .toUpperCase();
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
        <div className="max-w-sm w-full bg-white/[0.02] border border-white/5 p-8 text-center rounded-none shadow-2xl relative">
          <div className="absolute top-0 left-0 w-[2px] h-full bg-primary" />
          <div className="w-14 h-14 bg-primary/10 border border-primary/20 rounded-none mx-auto mb-6 flex items-center justify-center text-primary">
            <ShieldCheck size={28} />
          </div>

          <h2 className="text-lg font-bold text-white uppercase tracking-[0.18em] mb-3">
            Request Saved
          </h2>
          <p className="text-gray-500 text-[12px] font-medium uppercase tracking-[0.18em] mb-8 leading-relaxed">
            We found your visit record for{" "}
            <span className="text-white font-semibold">{requestRef}</span>
          </p>

          <div className="flex flex-col gap-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-2 pb-10 text-white bg-black">
      {/* Header Section */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-[18px] md:text-[20px] font-black uppercase tracking-tight mb-2 leading-none">
            Visitor Registration
          </h1>
          <p className="text-gray-500 text-[11px] uppercase font-bold tracking-[0.25em] opacity-80">
            Tell us about your visit
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <VisitorOverview data={formData} onChange={handleInputChange} />

        <div className="border-t border-white/5 pt-10">
          <VehicleDetails data={formData} onChange={handleInputChange} />
        </div>

        <div className="border-t border-white/5 pt-6">
          <VisitorGroup
            visitors={visitors || []}
            onAdd={handleAddVisitor}
            onRemove={handleRemoveVisitor}
            onChange={handleUpdateVisitor}
          />
        </div>

        <div className="border-t border-white/5 pt-6">
          <ItemsCarried
            items={equipment || []}
            onAdd={handleAddEquipment}
            onRemove={handleRemoveEquipment}
            onChange={handleUpdateEquipment}
          />
        </div>

        {/* Action Footer */}
        <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto px-12 h-14 bg-primary hover:bg-primary-hover text-white font-black uppercase text-[11px] tracking-[0.22em] shadow-2xl shadow-primary/20 transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
          >
            {status === "submitting" ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ShieldCheck
                  size={16}
                  className="group-hover:scale-110 transition-transform"
                />
                Submit Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Step1Main;
