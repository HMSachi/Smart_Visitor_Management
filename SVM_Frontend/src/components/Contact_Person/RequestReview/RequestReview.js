import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import PersonnelAuthProtocol from "../../../components/common/PersonnelAuthProtocol";
import RejectionModal from "./RejectionModal";
import ApprovalModal from "./ApprovalModal";
import {
  ApproveVisitRequest,
  GetVisitRequestById,
  GetVisitRequestsByCP,
  UpdateVisitRequest,
} from "../../../actions/VisitRequestAction";
import VisitorService from "../../../services/VisitorService";
import VehicleService from "../../../services/VehicleService";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import VisitGroupService from "../../../services/VisitGroupService";
import ItemCarriedService from "../../../services/ItemCarriedService";

const normalizeStatus = (status) => {
  const s = (status || "").toString().trim().toUpperCase();
  if (s === "A" || s === "APPROVED") return "Admin Approved";
  if (s === "R" || s === "REJECTED") return "Rejected";
  if (s === "C" || s === "CHECKED OUT" || s === "CHECKED_OUT")
    return "Checked Out";
  if (s === "ACCEPTED") return "Accepted by Visitor";
  if (s === "SENT" || s === "SENT_TO_ADMIN")
    return "Accepted by Contact Person";
  return "Sent to Visitor";
};

const toReviewModel = (request, visitorRecord) => {
  if (!request) return null;
  const visitor = visitorRecord || request;

  return {
    id: request.VVR_Request_id,
    status: normalizeStatus(request.VVR_Status),
    fullName:
      visitor?.VV_Name ||
      request.VVR_Visitor_Name ||
      `Visitor ${request.VVR_Visitor_id || ""}`,
    nic: visitor?.VV_NIC_Passport_NO || "N/A",
    phoneNumber: visitor?.VV_Phone || "N/A",
    emailAddress: visitor?.VV_Email || "N/A",
    representingCompany: visitor?.VV_Company || "N/A",
    visitorClassification: visitor?.VV_Visitor_Type || "N/A",
    proposedVisitDate: request.VVR_Visit_Date
      ? request.VVR_Visit_Date.split("T")[0]
      : "",
    purposeOfVisitation: request.VVR_Purpose || "N/A",
    selectedAreas: request.VVR_Places_to_Visit
      ? request.VVR_Places_to_Visit.split("|")
      : [],
  };
};

const RequestReviewMain = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const selectedId = location.state?.requestId;
  const selectedRequestData = location.state?.requestData;

  const { visitRequestsByCP, visitRequests } = useSelector(
    (state) => state.visitRequestsState,
  );
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";

  const [requestData, setRequestData] = useState(null);
  const [visitorRecord, setVisitorRecord] = useState(null);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [visitorGroupMembers, setVisitorGroupMembers] = useState([]);
  const [itemsCarried, setItemsCarried] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionComment, setRejectionComment] = useState("");
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvalComment, setApprovalComment] = useState("");

  useEffect(() => {
    if (!selectedId) return;
    dispatch(GetVisitRequestById(selectedId));
  }, [dispatch, selectedId]);

  const apiRequest = useMemo(() => {
    if (selectedRequestData) return selectedRequestData;
    if (!selectedId) return null;

    const fromCpList = (visitRequestsByCP || []).find(
      (item) => String(item?.VVR_Request_id) === String(selectedId),
    );
    if (fromCpList) return fromCpList;

    const fromById = Array.isArray(visitRequests)
      ? visitRequests.find(
          (item) => String(item?.VVR_Request_id) === String(selectedId),
        )
      : null;

    return fromById || null;
  }, [selectedId, selectedRequestData, visitRequestsByCP, visitRequests]);

  // Load all related records for the selected request
  useEffect(() => {
    let cancelled = false;

    const loadRelatedRecords = async () => {
      if (!apiRequest) {
        setVisitorRecord(null);
        setVehiclesList([]);
        setVisitorGroupMembers([]);
        setItemsCarried([]);
        return;
      }

      setDetailsLoading(true);
      try {
        // Load visitor profile
        if (apiRequest?.VVR_Visitor_id) {
          const visitorResponse = await VisitorService.GetVisitorById(
            apiRequest.VVR_Visitor_id,
          );
          const visitorPayload =
            visitorResponse?.data?.ResultSet || visitorResponse?.data || null;
          const visitor = Array.isArray(visitorPayload)
            ? visitorPayload[0]
            : visitorPayload;
          if (!cancelled) setVisitorRecord(visitor || null);
        } else if (!cancelled) {
          setVisitorRecord(null);
        }

        // Load vehicles for this request (full list)
        const vehicleResponse = await VehicleService.GetAllVehicles();
        const allVehicles =
          vehicleResponse?.data?.ResultSet || vehicleResponse?.data || [];
        const matchedVehicles = (Array.isArray(allVehicles) ? allVehicles : [])
          .filter(
            (v) =>
              String(v?.VVR_Request_id) ===
              String(apiRequest?.VVR_Request_id),
          )
          .map((v) => ({
            id: v.VV_Vehicle_id,
            vehicleType: v.VV_Vehicle_Type,
            plateNumber: v.VV_Vehicle_Number,
          }));
        if (!cancelled) setVehiclesList(matchedVehicles);

        // Load visiting people (group members)
        const groupResponse = await VisitGroupService.GetAllVisitGroup();
        const allGroupMembers =
          groupResponse?.data?.ResultSet || groupResponse?.data || [];
        const matchedMembers = (
          Array.isArray(allGroupMembers) ? allGroupMembers : []
        )
          .filter(
            (item) =>
              String(item?.VVR_Request_id) ===
              String(apiRequest?.VVR_Request_id),
          )
          .map((m) => ({
            id: m.VVG_id,
            fullName: m.VVG_Visitor_Name,
            nic: m.VVG_NIC_Passport_Number,
            contact: m.VVG_Designation,
          }));
        if (!cancelled) setVisitorGroupMembers(matchedMembers);

        // Load items carried
        const itemsResponse = await ItemCarriedService.GetAllItemsCarried();
        const allItems =
          itemsResponse?.data?.ResultSet || itemsResponse?.data || [];
        const matchedItems = (Array.isArray(allItems) ? allItems : [])
          .filter(
            (item) =>
              String(item?.VVR_Request_id) ===
              String(apiRequest?.VVR_Request_id),
          )
          .map((i) => ({
            id: i.VIC_Item_id,
            itemName: i.VIC_Item_Name,
            quantity: i.VIC_Quantity,
          }));
        if (!cancelled) setItemsCarried(matchedItems);
      } catch (error) {
        if (!cancelled) {
          setVisitorRecord(null);
          setVehiclesList([]);
        }
        console.error("Error loading related request review data:", error);
      } finally {
        if (!cancelled) setDetailsLoading(false);
      }
    };

    loadRelatedRecords();

    return () => {
      cancelled = true;
    };
  }, [apiRequest]);

  useEffect(() => {
    setRequestData(toReviewModel(apiRequest, visitorRecord));
  }, [apiRequest, visitorRecord]);

  const confirmApprove = async () => {
    if (!apiRequest?.VVR_Request_id) {
      alert("No request found for approval.");
      return;
    }

    await dispatch(
      UpdateVisitRequest({
        VVR_Request_id: apiRequest.VVR_Request_id,
        VVR_Visit_Date: apiRequest.VVR_Visit_Date,
        VVR_Places_to_Visit: apiRequest.VVR_Places_to_Visit,
        VVR_Purpose: apiRequest.VVR_Purpose,
        VVR_Status: "SENT",
        VVR_Contact_person_id: apiRequest.VVR_Contact_person_id,
        approvalComment,
      }),
    );

    if (apiRequest?.VVR_Contact_person_id) {
      dispatch(GetVisitRequestsByCP(apiRequest.VVR_Contact_person_id));
    }

    alert("Request updated successfully.");
    setShowApproveModal(false);
    navigate("/contact_person/requests-inbox");
  };

  const confirmReject = async () => {
    if (!rejectionComment.trim()) {
      alert("Detailed observations are required for rejection.");
      return;
    }

    if (!apiRequest?.VVR_Request_id) {
      alert("No request found for rejection.");
      return;
    }

    await dispatch(ApproveVisitRequest(apiRequest.VVR_Request_id, "R"));
    if (apiRequest?.VVR_Contact_person_id) {
      dispatch(GetVisitRequestsByCP(apiRequest.VVR_Contact_person_id));
    }

    alert(`Request Declined: ${rejectionReason}`);
    setShowRejectModal(false);
    navigate("/contact_person/requests-inbox");
  };

  return (
    <div
      className={`flex-1 p-4 md:p-6 space-y-4 animate-fade-in-slow overflow-y-auto relative transition-colors duration-500 ${isLight ? "bg-[#F8F9FA]" : "bg-[var(--color-bg-default)]"}`}
    >
      <div className="max-w-[1700px] mx-auto relative z-10 w-full">
        <div className="flex flex-col md:flex-row items-center justify-between pb-6 animate-fade-in transition-all gap-4">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
            <div className="w-1.5 h-8 bg-primary rounded-full"></div>
            <div>
              <p
                className={`text-[10px] uppercase font-semibold tracking-[0.28em] mb-0.5 opacity-80 ${isLight ? "text-gray-400" : "text-white/40"}`}
              >
                Request Details
              </p>
              <h2
                className={`text-lg font-semibold uppercase tracking-tight ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
              >
                Request ID{" "}
                <span className="text-primary font-mono ml-2">
                  #{requestData?.id || selectedId || "ALPHA-000"}
                </span>
              </h2>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-4">
            <div
              className={`border px-5 py-3 rounded-2xl shadow-sm text-right ${isLight ? "bg-white border-gray-200" : "bg-black/35 border-white/10"}`}
            >
              <p
                className={`text-[10px] uppercase font-semibold tracking-[0.22em] mb-0.5 ${isLight ? "text-gray-400" : "text-white/40"}`}
              >
                Request Status
              </p>
              <span className="text-primary text-[12px] font-semibold uppercase tracking-[0.2em]">
                {requestData?.status || "PENDING"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 max-h-[calc(100vh-240px)] overflow-y-auto pr-2 custom-scrollbar">
          {detailsLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <PersonnelAuthProtocol
              visitor={requestData}
              onBack={() => navigate("/contact_person/requests-inbox")}
              onAction={(visitor, type) => {
                if (type === "Approve") setShowApproveModal(true);
                if (type === "Reject") setShowRejectModal(true);
              }}
              groupMembers={visitorGroupMembers}
              itemsCarried={itemsCarried}
              vehiclesList={vehiclesList}
            />
          )}
        </div>
      </div>

      <ApprovalModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={confirmApprove}
        comment={approvalComment}
        setComment={setApprovalComment}
      />

      <RejectionModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={confirmReject}
        reason={rejectionReason}
        setReason={setRejectionReason}
        comment={rejectionComment}
        setComment={setRejectionComment}
      />
    </div>
  );
};

export default RequestReviewMain;
