import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  Calendar,
  Hash,
  MapPin,
  User,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Car,
  Users,
  Package,
  CheckCircle2,
  AlertCircle,
  Clock,
  FolderOpen,
  FileText,
  ImageIcon,
  Download,
  X,
  CreditCard,
  Shield,
} from "lucide-react";
import VisitorService from "../../../services/VisitorService";
import VisitGroupService from "../../../services/VisitGroupService";
import ItemCarriedService from "../../../services/ItemCarriedService";
import VehicleService from "../../../services/VehicleService";
import VisitorAttachmentService from "../../../services/VisitorAttachmentService";
import { UpdateVisitRequest } from "../../../actions/VisitRequestAction";

const RAW_FIELD_LABELS = {
  VVR_Contact_person_id: "Contact Person ID",
  VVR_Created_Date: "Created Date",
  VVR_Places_to_Visit: "Places to Visit",
  VVR_Purpose: "Purpose",
  VVR_Request_id: "Request ID",
  VVR_Status: "Status",
  VVR_Update_Date: "Last Updated Date",
  VVR_Visit_Date: "Visit Date",
  VVR_Visitor_id: "Visitor ID",
};

const toFriendlyFieldName = (key) => {
  if (RAW_FIELD_LABELS[key]) return RAW_FIELD_LABELS[key];
  return key
    .replace(/^VVR_/, "")
    .replace(/^VV_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatRawFieldValue = (key, value) => {
  if (value === null || value === undefined || value === "") return "N/A";

  if (/_Date$/i.test(key) || /DATE/i.test(key)) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-US");
    }
  }

  return String(value);
};

const normalizeStatus = (status) => {
  const s = (status || "").toString().trim().toUpperCase();
  if (s === "A" || s === "APPROVED") return "Approved";
  if (s === "R" || s === "REJECTED") return "Rejected";
  if (s === "ACCEPTED") return "Accepted";
  if (s === "SENT" || s === "SENT_TO_ADMIN") return "Sent";
  return "Pending";
};

const toDisplayDate = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US");
};

const SmallField = ({ label, value, icon: Icon }) => (
  <div className="space-y-1">
    <label className="text-[12px] font-medium text-text-secondary capitalize tracking-tight flex items-center gap-1.5">
      {Icon && <Icon size={11} className="text-primary/70" />}
      {label}
    </label>
    <div className="w-full bg-background-alt/50 border border-border-soft rounded-lg px-3 py-1 text-text-primary text-[12px] font-normal tracking-tight break-words min-h-[36px] flex items-center">
      {value || "N/A"}
    </div>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-background-paper border border-border-soft rounded-[12px] p-3 md:p-4 shadow-sm space-y-3">
    <div className="flex items-center gap-2">
      <div className="w-[3px] h-3.5 bg-primary rounded-full"></div>
      <Icon size={13} className="text-primary/70" />
      <h3 className="text-[13px] font-medium capitalize tracking-tight text-text-primary">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const RequestDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { requestId } = useParams();

  const { visitRequestsByVis } = useSelector(
    (state) => state.visitRequestsState,
  );
  const requestFromState = location.state?.request;

  const currentRequest = useMemo(() => {
    if (requestFromState) return requestFromState;
    return (visitRequestsByVis || []).find(
      (item) => String(item?.VVR_Request_id) === String(requestId),
    );
  }, [requestFromState, visitRequestsByVis, requestId]);

  const [visitorRecord, setVisitorRecord] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [items, setItems] = useState([]);
  const [vehicleRecords, setVehicleRecords] = useState([]);
  const [jointItems, setJointItems] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [viewAttachments, setViewAttachments] = useState({
    open: false,
    visitorId: null,
    visitorName: "",
    loading: false,
    list: [],
    error: null,
    filterCategory: null,
  });

  const openViewAttachments = async (visitorId, visitorName, filterCategory = null) => {
    setViewAttachments({
      open: true,
      visitorId,
      visitorName,
      loading: true,
      list: [],
      error: null,
      filterCategory,
    });
    try {
      const response =
        await VisitorAttachmentService.GetAttachmentsByVisitorId(visitorId);
      const rawList = response?.data?.ResultSet || response?.data || [];
      const list = Array.isArray(rawList) ? rawList : [];
      setViewAttachments((prev) => ({ ...prev, loading: false, list }));
    } catch (err) {
      setViewAttachments((prev) => ({
        ...prev,
        loading: false,
        error: err.message || "Failed to load attachments",
      }));
    }
  };

  const closeViewAttachments = () => {
    setViewAttachments({
      open: false,
      visitorId: null,
      visitorName: "",
      loading: false,
      list: [],
      error: null,
    });
  };

  useEffect(() => {
    const loadExtraDetails = async () => {
      try {
        if (currentRequest?.VVR_Visitor_id) {
          const visitorRes = await VisitorService.GetVisitorById(
            currentRequest.VVR_Visitor_id,
          );
          const visitorSet = visitorRes?.data?.ResultSet;
          const record = Array.isArray(visitorSet)
            ? visitorSet[0]
            : visitorSet || visitorRes?.data;
          setVisitorRecord(record || null);
        }

        if (currentRequest?.VVR_Request_id) {
          const groupRes = await VisitGroupService.GetAllVisitGroup();
          const allGroups = groupRes?.data?.ResultSet || groupRes?.data || [];
          const matchedGroup = (
            Array.isArray(allGroups) ? allGroups : []
          ).filter(
            (m) =>
              String(m.VVR_Request_id) ===
              String(currentRequest.VVR_Request_id),
          );
          setGroupMembers(matchedGroup);

          const itemsRes = await ItemCarriedService.GetAllItemsCarried();
          const allItems = itemsRes?.data?.ResultSet || itemsRes?.data || [];
          const matchedItems = (Array.isArray(allItems) ? allItems : []).filter(
            (i) =>
              String(i.VVR_Request_id) ===
              String(currentRequest.VVR_Request_id),
          );
          setItems(matchedItems);

          const vehicleRes = await VehicleService.GetAllVehicles();
          const allVehicles =
            vehicleRes?.data?.ResultSet || vehicleRes?.data || [];
          const matchedVehicles = (
            Array.isArray(allVehicles) ? allVehicles : []
          ).filter(
            (v) =>
              String(v.VVR_Request_id) ===
              String(currentRequest.VVR_Request_id),
          );
          setVehicleRecords(matchedVehicles);

          // Load joint items (items paired with sub-visitor names)
          try {
            const jointRes = await VisitorService.GetVisitorJoint(
              currentRequest.VVR_Request_id,
            );
            const jointData = jointRes?.data?.ResultSet || jointRes?.data || [];
            setJointItems(Array.isArray(jointData) ? jointData : []);
          } catch {
            setJointItems([]);
          }
        }
      } catch (error) {
        console.error("Failed to load full request details:", error);
      }
    };

    if (currentRequest) {
      loadExtraDetails();
    }
  }, [currentRequest]);

  const summary = useMemo(() => {
    const req = currentRequest || {};
    const visitor = visitorRecord || {};
    const firstVehicle = vehicleRecords[0] || {};

    return {
      id: req.VVR_Request_id || requestId || "N/A",
      status: normalizeStatus(req.VVR_Status),
      name: req.VV_Name || req.VVR_Visitor_Name || visitor.VV_Name || "N/A",
      nic: req.VV_NIC_Passport_NO || visitor.VV_NIC_Passport_NO || "N/A",
      email: req.VV_Email || visitor.VV_Email || "N/A",
      phone: req.VV_Phone || visitor.VV_Phone || "N/A",
      company: req.VV_Company || visitor.VV_Company || "N/A",
      visitorType: req.VV_Visitor_Type || visitor.VV_Visitor_Type || "N/A",
      visitDate: toDisplayDate(req.VVR_Visit_Date),
      areas: req.VVR_Places_to_Visit || visitor.VV_Visiting_places || "N/A",
      purpose: req.VVR_Purpose || "N/A",
    };
  }, [currentRequest, visitorRecord, vehicleRecords, requestId]);

  const rawFields = useMemo(() => {
    if (!currentRequest) return [];
    return Object.entries(currentRequest)
      .filter(([key]) => {
        return ["VVR_Created_Date", "VVR_Update_Date"].includes(key);
      })
      .sort(([a], [b]) => a.localeCompare(b));
  }, [currentRequest]);

  const handleAccept = async () => {
    if (!currentRequest?.VVR_Request_id) return;
    try {
      await dispatch(
        UpdateVisitRequest({ ...currentRequest, VVR_Status: "ACCEPTED" }),
      );
      setShowSuccess(true);
    } catch (error) {
      console.error("Error accepting request:", error);
      alert("Failed to accept request. Please try again.");
    }
  };

  if (!currentRequest) {
    return (
      <div className="contact-theme-root min-h-screen bg-background-default text-text-primary px-4 md:px-8 pt-24 md:pt-28 pb-8">
        <div className="max-w-none mx-auto">
          <button
            onClick={() => navigate("/visitor/my-requests")}
            className="mb-6 flex items-center gap-2 text-[11px] font-semibold capitalize tracking-[0.16em] text-primary"
          >
            <ArrowLeft size={14} /> Back to My Requests
          </button>
          <div className="bg-background-paper rounded-3xl p-6 border border-border-soft text-text-primary text-[12px] font-semibold">
            Request details are not available. Please open it from My Requests.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-theme-root min-h-screen bg-background-default text-text-primary px-4 md:px-8 pt-24 md:pt-28 pb-8 relative">
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"></div>
          <div className="relative bg-background-paper p-6 rounded-[20px] shadow-2xl border border-border-soft flex flex-col max-w-sm w-full animate-scale-in">
            <h3 className="text-lg font-bold text-text-primary mb-2">
              Success
            </h3>
            <p className="text-[13px] text-text-secondary mb-6 leading-relaxed">
              Request accepted successfully. The contact person will be
              notified.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/visitor/my-requests");
                }}
                className="px-6 py-2.5 bg-primary text-white text-[11px] font-bold capitalize tracking-wider rounded-xl transition-all hover:bg-primary/90 active:scale-95"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate("/visitor/my-requests")}
            className="flex items-center gap-2 text-[11px] font-semibold capitalize tracking-[0.16em] text-primary"
          >
            <ArrowLeft size={14} /> Back to My Requests
          </button>

          {summary.status === "Pending" && (
            <button
              onClick={handleAccept}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-[11px] font-bold capitalize tracking-[0.16em] transition-all shadow-md active:scale-95"
            >
              Accepted
            </button>
          )}
        </div>

        <SectionCard title="Request summary" icon={Hash}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <SmallField
              label="Reference ID"
              value={`#${summary.id}`}
              icon={Hash}
            />
            <SmallField
              label="Visit date"
              value={summary.visitDate}
              icon={Calendar}
            />
            <SmallField
              label="Visiting areas"
              value={summary.areas}
              icon={MapPin}
            />
            <SmallField
              label="Submitted purpose"
              value={summary.purpose}
              icon={Briefcase}
            />
          </div>
        </SectionCard>

        <SectionCard title="Visitor information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <SmallField label="Full name" value={summary.name} icon={User} />
            <div className="space-y-1">
              <label className="text-[12px] font-medium text-text-secondary capitalize tracking-tight flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5">
                  <Hash size={11} className="text-primary/70" />
                  NIC
                </span>
                <button
                  type="button"
                  title="View uploaded attachments"
                  onClick={() =>
                    openViewAttachments(
                      visitorRecord?.VV_Visitor_id,
                      summary.name,
                      ["nic", "passport", "driving licence"]
                    )
                  }
                  className="p-1.5 rounded-lg border border-primary/40 bg-primary/15 text-primary hover:bg-primary/25 hover:border-primary/60 transition-all shrink-0 cursor-pointer active:scale-95"
                >
                  <FolderOpen size={13} />
                </button>
              </label>
              <div className="w-full bg-background-alt/50 border border-border-soft rounded-lg px-3 py-1 text-text-primary text-[12px] font-normal tracking-tight break-words min-h-[36px] flex items-center">
                {summary.nic || "N/A"}
              </div>
            </div>
            <SmallField label="Email" value={summary.email} icon={Mail} />
            <SmallField label="Phone" value={summary.phone} icon={Phone} />
            <SmallField
              label="Company"
              value={summary.company}
              icon={Building2}
            />
            <SmallField
              label="Visitor type"
              value={summary.visitorType}
              icon={Briefcase}
            />
          </div>

          {/* Items carried by the main visitor */}
          <div className="mt-3 pt-3 border-t border-border-soft">
            <div className="flex items-center gap-2 mb-2">
              <Package size={13} className="text-primary/70" />
              <p className="text-[12px] font-medium capitalize tracking-tight text-text-primary">
                Items carried
              </p>
            </div>
            {items.length > 0 ? (
              <div className="border border-border-soft rounded-lg overflow-auto max-h-[200px]">
                <div className="flex justify-between items-center px-3 py-1.5 bg-background-alt border-b border-border-soft min-w-max">
                  <span className="text-[12px] font-medium text-text-secondary capitalize tracking-tight flex-[2] min-w-[120px]">
                    Item name
                  </span>
                  <span className="text-[12px] font-medium text-text-secondary capitalize tracking-tight w-16 text-center">
                    Qty
                  </span>
                  <span className="text-[12px] font-medium text-text-secondary capitalize tracking-tight flex-[3] text-center min-w-[120px]">
                    Description
                  </span>
                  <span className="text-[12px] font-medium text-text-secondary capitalize tracking-tight w-28 text-right min-w-[100px]">
                    Status
                  </span>
                </div>
                <div className="divide-y divide-border-soft/50">
                  {items.map((item, idx) => {
                    const s = (item.VIC_Status || "")
                      .toString()
                      .trim()
                      .toUpperCase();
                    const isTaken = s === "A";
                    const isNotTaken = s === "I";
                    return (
                      <div
                        key={item.VIC_Item_id}
                        className={`flex flex-row items-center justify-between gap-1.5 px-3 py-1.5 min-w-max ${idx % 2 === 0 ? "bg-background-paper" : "bg-background-alt/30"}`}
                      >
                        <span className="text-[12px] font-normal text-text-primary flex-[2] truncate min-w-[120px]">
                          {item.VIC_Item_Name}
                        </span>
                        <div className="w-16 flex justify-center">
                          <span className="text-[12px] font-medium text-primary bg-primary/5 px-2 py-0.5 rounded tracking-wide">
                            x{item.VIC_Quantity || 1}
                          </span>
                        </div>
                        <span className="text-[12px] font-normal text-text-dim flex-[3] text-center truncate min-w-[120px]">
                          {item.VIC_Designation || item.VIC_Description || "-"}
                        </span>
                        {/* Status badge */}
                        <div className="w-28 flex justify-end min-w-[100px]">
                          {isTaken ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-[0.12em] uppercase bg-green-500/10 border border-green-500/25 text-green-600 dark:text-green-400">
                              <CheckCircle2 size={10} />
                              Taken
                            </span>
                          ) : isNotTaken ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-[0.12em] uppercase bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400">
                              <AlertCircle size={10} />
                              Not Taken
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-[0.12em] uppercase bg-gray-200/60 border border-gray-200 text-gray-400 dark:bg-white/5 dark:border-white/10">
                              <Clock size={10} />
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-text-secondary font-medium capitalize tracking-[0.12em]">
                No items declared by the main visitor.
              </p>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Vehicle Registry" icon={Car}>
          {vehicleRecords.length > 0 ? (
            <div className="border border-border-soft rounded-lg overflow-auto max-h-[250px]">
              <div className="flex justify-between items-center px-3 py-1.5 bg-background-alt border-b border-border-soft min-w-max">
                <span className="text-[10px] font-bold text-text-secondary capitalize tracking-wider flex-1 min-w-[100px]">
                  Vehicle type
                </span>
                <span className="text-[10px] font-bold text-text-secondary capitalize tracking-wider flex-1 text-center min-w-[100px]">
                  Vehicle number
                </span>
                <span className="text-[10px] font-bold text-text-secondary capitalize tracking-wider flex-[2] text-right min-w-[200px]">
                  Attachments
                </span>
              </div>
              <div className="divide-y divide-border-soft">
                {vehicleRecords.map((vehicle, idx) => (
                  <div
                    key={vehicle.VV_Vehicle_id || idx}
                    className={`flex flex-row items-center justify-between gap-2 px-3 py-1.5 min-w-max ${idx % 2 === 0 ? "bg-background-paper" : "bg-background-alt/50"}`}
                  >
                    <span className="text-[11px] font-medium text-text-secondary capitalize flex-1 min-w-[100px]">
                      {vehicle.VV_Vehicle_Type}
                    </span>
                    <span className="text-[11px] font-medium text-text-primary flex-1 text-center min-w-[100px]">
                      {vehicle.VV_Vehicle_Number}
                    </span>
                    <div className="flex-[2] flex justify-end gap-2 min-w-[200px]">
                      <button
                        type="button"
                        title="Vehicle Insurance"
                        onClick={() =>
                          openViewAttachments(
                            visitorRecord?.VV_Visitor_id,
                            summary.name,
                            "Vehicle Insurance"
                          )
                        }
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all text-[10px] font-semibold tracking-wide bg-primary/10 border-primary/30 text-primary hover:bg-primary/20 active:scale-95"
                      >
                        <Shield size={12} />
                        Insurance
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-text-dim font-medium capitalize tracking-[0.12em]">
              No vehicles registered.
            </p>
          )}
        </SectionCard>

        <SectionCard title="Visiting Group" icon={Users}>
          {groupMembers.length > 0 ? (
            <div className="border border-border-soft rounded-lg overflow-auto max-h-[250px]">
              <div className="flex justify-between items-center px-3 py-1.5 bg-background-alt border-b border-border-soft min-w-max">
                <span className="text-[10px] font-bold text-text-secondary capitalize tracking-wider flex-1 min-w-[120px]">
                  Name
                </span>
                <span className="text-[10px] font-bold text-text-secondary capitalize tracking-wider flex-1 text-center min-w-[130px]">
                  NIC
                </span>
                <span className="text-[10px] font-bold text-text-secondary capitalize tracking-wider flex-1 text-right min-w-[120px]">
                  Phone number
                </span>
              </div>
              <div className="divide-y divide-border-soft">
                {groupMembers.map((member, idx) => (
                  <div
                    key={member.VVG_id}
                    className={`flex flex-row items-center justify-between gap-2 px-3 py-1.5 min-w-max ${idx % 2 === 0 ? "bg-background-paper" : "bg-background-alt/50"}`}
                  >
                    <span className="text-[11px] font-medium text-text-primary flex-1 min-w-[120px]">
                      {member.VVG_Visitor_Name}
                    </span>
                    <span className="text-[11px] font-medium text-text-secondary capitalize flex-1 text-center min-w-[130px]">
                      {member.VVG_NIC_Passport_Number}
                    </span>
                    <span className="text-[11px] font-medium text-text-secondary flex-1 text-right min-w-[120px]">
                      {member.VVG_Designation || "-"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-text-dim font-medium capitalize tracking-[0.12em]">
              No additional visitors submitted.
            </p>
          )}
        </SectionCard>

        {/* Items carried in — grouped by sub-visitor (Group_Members from API) */}
        {/* 
        <SectionCard title="Items carried in" icon={Package}>
          <p className="text-[10px] text-text-dim font-medium capitalize tracking-[0.12em] mb-4">
            Items brought in by each member of the visiting group
          </p>
          {jointItems.length > 0 ? (
            <div className="border border-border-soft rounded-lg overflow-hidden">
              <div className="flex justify-between items-center px-3 py-1.5 bg-background-alt border-b border-border-soft">
                <span className="text-[10px] font-bold text-text-secondary capitalize tracking-wider flex-1">Sub visitor</span>
                <span className="text-[10px] font-bold text-text-secondary capitalize tracking-wider flex-1">Item name</span>
                <span className="text-[10px] font-bold text-text-secondary capitalize tracking-wider w-16 text-center">Qty</span>
                <span className="text-[10px] font-bold text-text-secondary capitalize tracking-wider flex-[2] sm:text-right">Description</span>
              </div>
              <div className="divide-y divide-border-soft overflow-y-auto max-h-[200px] custom-scrollbar">
                {jointItems.map((item, idx) => {
                  const memberName = item.Group_Members || "Unknown Member";
                  return (
                    <div key={idx} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-1.5 ${idx % 2 === 0 ? 'bg-background-paper' : 'bg-background-alt/50'}`}>
                      <span className="text-[11px] font-medium text-text-primary flex-1 truncate">{memberName}</span>
                      <span className="text-[11px] font-medium text-text-secondary flex-1 truncate">{item.VIC_Item_Name}</span>
                      <div className="w-16 flex justify-center">
                        <span className="text-[11px] font-medium text-primary bg-primary/5 px-2 py-0.5 rounded tracking-wide">x{item.VIC_Quantity || 1}</span>
                      </div>
                      <span className="text-[11px] font-medium text-text-dim flex-[2] sm:text-right truncate">{item.VIC_Designation || "-"}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-text-dim font-medium capitalize tracking-[0.12em]">No items carried in by the visiting group.</p>
          )}
        </SectionCard>
        */}

        <SectionCard title="All submitted raw fields" icon={Hash}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rawFields.map(([key, value]) => (
              <div
                key={key}
                className="rounded-2xl border border-border-soft bg-background-alt/50 px-4 py-1.5"
              >
                <p className="text-[9px] font-semibold text-text-secondary capitalize tracking-[0.14em] mb-1">
                  {toFriendlyFieldName(key)}
                </p>
                <p className="text-[11px] font-semibold text-text-primary break-words">
                  {formatRawFieldValue(key, value)}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Attachments Modal */}
      {viewAttachments.open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-[var(--color-bg-paper)] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-black/20 relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-5 bg-primary rounded-full" />
                <div>
                  <h2 className="text-[12px] font-normal text-white tracking-[0.16em]">
                    {viewAttachments.filterCategory
                      ? Array.isArray(viewAttachments.filterCategory)
                        ? "Uploaded Documents"
                        : viewAttachments.filterCategory
                      : "Uploaded Documents"}
                  </h2>
                  {viewAttachments.visitorName && (
                    <p className="text-[10px] text-white/40 tracking-widest mt-0.5">
                      {viewAttachments.visitorName} · #
                      {viewAttachments.visitorId}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={closeViewAttachments}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-1.5 rounded-lg"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 relative z-10 min-h-[120px]">
              {viewAttachments.loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                  <div className="w-8 h-8 border-2 border-border-soft border-t-primary rounded-full animate-spin" />
                  <p className="text-[11px] text-white/30 tracking-widest uppercase">
                    Loading...
                  </p>
                </div>
              ) : viewAttachments.error ? (
                <div className="flex items-center gap-2 px-3 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-[11px]">
                  <AlertCircle size={13} className="shrink-0" />
                  {viewAttachments.error}
                </div>
              ) : viewAttachments.list.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 opacity-40">
                  <FolderOpen size={32} />
                  <p className="text-[11px] tracking-widest uppercase">
                    No attachments found
                  </p>
                </div>
              ) : (
                <ul className="space-y-2 max-h-[312px] overflow-y-auto pr-1 custom-scrollbar">
                  {(viewAttachments.filterCategory
                    ? viewAttachments.list.filter(
                        (att) => {
                          const cat = (att.VAT_File_Category || att.FileCategory || "").toLowerCase();
                          if (Array.isArray(viewAttachments.filterCategory)) {
                             return viewAttachments.filterCategory.map(c => c.toLowerCase()).includes(cat);
                          }
                          return cat === viewAttachments.filterCategory.toLowerCase();
                        }
                      )
                    : viewAttachments.list
                  ).length === 0 && !viewAttachments.loading ? (
                    <li className="flex flex-col items-center justify-center py-10 gap-3 opacity-40">
                      <FolderOpen size={28} />
                      <p className="text-[11px] tracking-widest uppercase">
                        No {Array.isArray(viewAttachments.filterCategory) ? "" : viewAttachments.filterCategory || ""} attachments found
                      </p>
                    </li>
                  ) : (
                    (viewAttachments.filterCategory
                      ? viewAttachments.list.filter(
                          (att) => {
                            const cat = (att.VAT_File_Category || att.FileCategory || "").toLowerCase();
                            if (Array.isArray(viewAttachments.filterCategory)) {
                               return viewAttachments.filterCategory.map(c => c.toLowerCase()).includes(cat);
                            }
                            return cat === viewAttachments.filterCategory.toLowerCase();
                          }
                        )
                      : viewAttachments.list
                    ).map((att, idx) => {
                    const category =
                      att.VAT_File_Category || att.FileCategory || "document";
                    const fileName =
                      att.VAT_File_Name ||
                      att.FileName ||
                      att.FilePath ||
                      `file-${idx + 1}`;
                    const vatId =
                      att.VAT_Id || att.VAT_Attachment_id || att.Id || null;
                    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(
                      fileName,
                    );
                    return (
                      <li
                        key={idx}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-all group"
                      >
                        {isImage ? (
                          <ImageIcon
                            size={15}
                            className="text-primary/60 shrink-0"
                          />
                        ) : (
                          <FileText
                            size={15}
                            className="text-primary/60 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-white truncate">
                            {fileName}
                          </p>
                          <p className="text-[9px] text-white/40 capitalize">
                            {category}
                          </p>
                        </div>
                        <button
                          type="button"
                          title="Download file"
                          onClick={() =>
                            vatId &&
                            VisitorAttachmentService.DownloadAttachment(
                              vatId,
                              fileName,
                            )
                          }
                          className={`flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary hover:bg-primary/25 transition-all shrink-0 ${!vatId ? "opacity-30 cursor-not-allowed" : ""}`}
                        >
                          <Download size={18} />
                        </button>
                      </li>
                    );
                  }))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestDetails;
