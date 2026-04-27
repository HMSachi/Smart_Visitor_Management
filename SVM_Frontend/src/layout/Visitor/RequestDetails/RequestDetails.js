import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Calendar, Hash, MapPin, User, Mail, Phone, Building2, Briefcase, Car, Users, Package } from "lucide-react";
import VisitorService from "../../../services/VisitorService";
import VisitGroupService from "../../../services/VisitGroupService";
import ItemCarriedService from "../../../services/ItemCarriedService";

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
  <div className="space-y-1.5">
    <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-[0.14em] flex items-center gap-2">
      {Icon && <Icon size={11} className="text-primary/70" />}
      {label}
    </label>
    <div className="w-full bg-[#F8F9FA] border border-gray-200 rounded-2xl px-5 py-3 text-[#1A1A1A] text-[11px] font-semibold tracking-[0.06em] break-words min-h-[44px] flex items-center">
      {value || "N/A"}
    </div>
  </div>
);

const SectionCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white border border-gray-200 rounded-3xl p-5 md:p-6 shadow-sm space-y-4">
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-primary" />
      <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">{title}</h3>
    </div>
    {children}
  </div>
);

const RequestDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestId } = useParams();

  const { visitRequestsByVis } = useSelector((state) => state.visitRequestsState);
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

  useEffect(() => {
    const loadExtraDetails = async () => {
      try {
        if (currentRequest?.VVR_Visitor_id) {
          const visitorRes = await VisitorService.GetVisitorById(currentRequest.VVR_Visitor_id);
          const visitorSet = visitorRes?.data?.ResultSet;
          const record = Array.isArray(visitorSet) ? visitorSet[0] : visitorSet || visitorRes?.data;
          setVisitorRecord(record || null);
        }

        if (currentRequest?.VVR_Request_id) {
          const groupRes = await VisitGroupService.GetAllVisitGroup();
          const allGroups = groupRes?.data?.ResultSet || groupRes?.data || [];
          const matchedGroup = (Array.isArray(allGroups) ? allGroups : []).filter(
            (m) => String(m.VVR_Request_id) === String(currentRequest.VVR_Request_id),
          );
          setGroupMembers(matchedGroup);

          const itemsRes = await ItemCarriedService.GetAllItemsCarried();
          const allItems = itemsRes?.data?.ResultSet || itemsRes?.data || [];
          const matchedItems = (Array.isArray(allItems) ? allItems : []).filter(
            (i) => String(i.VVR_Request_id) === String(currentRequest.VVR_Request_id),
          );
          setItems(matchedItems);
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
      vehicleNo: req.VV_Vehicle_Number || visitor.VV_Vehicle_Number || "N/A",
      vehicleType: req.VV_Vehicle_Type || visitor.VV_Vehicle_Type || "N/A",
    };
  }, [currentRequest, visitorRecord, requestId]);

  const rawFields = useMemo(() => {
    if (!currentRequest) return [];
    return Object.entries(currentRequest)
      .filter(([key, value]) => value !== null && value !== undefined && value !== "")
      .sort(([a], [b]) => a.localeCompare(b));
  }, [currentRequest]);

  if (!currentRequest) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-default)] text-white px-4 md:px-8 pt-24 md:pt-28 pb-8">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => navigate("/visitor/my-requests")}
            className="mb-6 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
          >
            <ArrowLeft size={14} /> Back to My Requests
          </button>
          <div className="bg-white rounded-3xl p-6 border border-gray-200 text-[#1A1A1A] text-[12px] font-semibold">
            Request details are not available. Please open it from My Requests.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-default)] text-white px-4 md:px-8 pt-24 md:pt-28 pb-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <button
          onClick={() => navigate("/visitor/my-requests")}
          className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
        >
          <ArrowLeft size={14} /> Back to My Requests
        </button>

        <SectionCard title="Request Summary" icon={Hash}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SmallField label="Protocol ID" value={`#${summary.id}`} icon={Hash} />
            <SmallField label="Current Status" value={summary.status} icon={Briefcase} />
            <SmallField label="Visit Date" value={summary.visitDate} icon={Calendar} />
            <SmallField label="Visiting Areas" value={summary.areas} icon={MapPin} />
            <div className="md:col-span-2">
              <SmallField label="Submitted Purpose" value={summary.purpose} icon={Briefcase} />
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Visitor Information" icon={User}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SmallField label="Full Name" value={summary.name} icon={User} />
            <SmallField label="ID or Passport Number" value={summary.nic} icon={Hash} />
            <SmallField label="Email" value={summary.email} icon={Mail} />
            <SmallField label="Phone" value={summary.phone} icon={Phone} />
            <SmallField label="Company" value={summary.company} icon={Building2} />
            <SmallField label="Visitor Type" value={summary.visitorType} icon={Briefcase} />
          </div>
        </SectionCard>

        <SectionCard title="Vehicle Registry" icon={Car}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SmallField label="Vehicle Number" value={summary.vehicleNo} icon={Car} />
            <SmallField label="Vehicle Type" value={summary.vehicleType} icon={Car} />
          </div>
        </SectionCard>

        <SectionCard title="People Visiting" icon={Users}>
          {groupMembers.length > 0 ? (
            <div className="space-y-3">
              {groupMembers.map((member) => (
                <div key={member.VVG_id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-2xl border border-gray-200 bg-[#F8F9FA]">
                  <SmallField label="Full Name" value={member.VVG_Visitor_Name} icon={User} />
                  <SmallField label="ID or Passport Number" value={member.VVG_NIC_Passport_Number} icon={Hash} />
                  <SmallField label="Phone Number" value={member.VVG_Designation} icon={Phone} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-[0.12em]">No additional visitors submitted.</p>
          )}
        </SectionCard>

        <SectionCard title="Items to Bring" icon={Package}>
          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.VIC_Item_id} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-2xl border border-gray-200 bg-[#F8F9FA]">
                  <SmallField label="Item Name" value={item.VIC_Item_Name} icon={Package} />
                  <SmallField label="Quantity" value={String(item.VIC_Quantity || "N/A")} icon={Hash} />
                  <SmallField label="Description" value={item.VIC_Designation || "N/A"} icon={Briefcase} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-[0.12em]">No items submitted.</p>
          )}
        </SectionCard>

        <SectionCard title="All Submitted Raw Fields" icon={Hash}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rawFields.map(([key, value]) => (
              <div key={key} className="rounded-2xl border border-gray-200 bg-[#F8F9FA] px-4 py-3">
                <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-[0.14em] mb-1">{toFriendlyFieldName(key)}</p>
                <p className="text-[11px] font-semibold text-[#1A1A1A] break-words">{formatRawFieldValue(key, value)}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default RequestDetails;
