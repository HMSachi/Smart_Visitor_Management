import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Eye, Search } from "lucide-react";
import RequestsTable from "./RequestsTable";
import { useThemeMode } from "../../../theme/ThemeModeContext";
import {
  setSearchTerm,
  setStatusFilter,
  setSelectedRequest,
} from "../../../reducers/contactPersonSlice";
import { GetVisitRequestsByCP } from "../../../actions/VisitRequestAction";
import ContactPersonService from "../../../services/ContactPersonService";

const mapStatus = (status) => {
  const normalized = (status || "").toString().trim().toUpperCase();
  if (normalized === "A" || normalized === "APPROVED") return "Admin Approved";
  if (normalized === "R" || normalized === "REJECTED") return "Rejected";
  if (normalized === "SENT" || normalized === "SENT_TO_ADMIN")
    return "Accepted by Contact Person";
  if (normalized === "ACCEPTED") return "Accepted by Visitor";
  if (
    normalized === "C" ||
    normalized === "CHECKED OUT" ||
    normalized === "CHECKED_OUT"
  )
    return "Checked Out";
  return "Sent to Visitor";
};

const formatDateOnly = (value) => {
  if (!value) return "N/A";
  const raw = String(value);
  if (raw.includes("T")) return raw.split("T")[0];
  return raw;
};

const RequestsInboxMain = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cpId, setCpId] = useState(null);

  const { searchTerm, statusFilter } = useSelector(
    (state) => state.contactPortal,
  );
  const { visitRequestsByCP, isLoading, error } = useSelector(
    (state) => state.visitRequestsState,
  );
  const user = useSelector((state) => state.login.user);
  const { themeMode } = useThemeMode();
  const isLight = themeMode === "light";
  const userEmail = user?.ResultSet?.[0]?.VA_Email;

  useEffect(() => {
    const loadContactPersonId = async () => {
      try {
        const response = await ContactPersonService.GetAllContactPersons();
        const contactPersons = response?.data?.ResultSet || [];
        const match = contactPersons.find(
          (cp) =>
            cp?.VCP_Email?.trim().toLowerCase() ===
            userEmail?.trim().toLowerCase(),
        );

        if (match?.VCP_Contact_person_id) {
          setCpId(match.VCP_Contact_person_id);
          return;
        }

        setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
      } catch (err) {
        console.error("Error loading contact person:", err);
        setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
      }
    };

    if (userEmail) {
      loadContactPersonId();
    } else {
      setCpId(user?.ResultSet?.[0]?.VCP_Contact_person_id || null);
    }
  }, [userEmail, user]);

  useEffect(() => {
    if (!cpId) return;
    dispatch(GetVisitRequestsByCP(cpId));
  }, [dispatch, cpId]);

  const mappedRequests = useMemo(() => {
    return (visitRequestsByCP || []).map((req) => {
      const requestId = req?.VVR_Request_id;
      const visitorName =
        req?.VV_Name ||
        req?.Visitor_Name ||
        `VISITOR ${req?.VVR_Visitor_id || "UNKNOWN"}`;
      const cpName =
        req?.VCP_Name || user?.ResultSet?.[0]?.VA_Name || "CONTACT PERSON";

      return {
        id: String(requestId || ""),
        batchId: req?.VVR_Batch_id || `BATCH-${requestId || "N/A"}`,
        name: visitorName,
        purpose: req?.VVR_Purpose || "N/A",
        contactPerson: cpName,
        date: formatDateOnly(req?.VVR_Visit_Date),
        timeIn: req?.VVR_Visit_Time || "N/A",
        areas: [req?.VVR_Places_to_Visit || "N/A"],
        status: mapStatus(req?.VVR_Status),
        members: [],
      };
    });
  }, [visitRequestsByCP, user]);

  const sourceRequests = mappedRequests;

  const filteredRequests = sourceRequests.filter((req) => {
    const matchesSearch =
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.batchId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSearchChange = (term) => {
    dispatch(setSearchTerm(term));
  };

  const handleFilterChange = (status) => {
    dispatch(setStatusFilter(status));
  };

  const handleReview = (requestId) => {
    dispatch(setSelectedRequest(requestId));
    navigate("/contact_person/request-review", {
      state: { requestId },
    });
  };

  return (
    <div
      className={`p-3 md:p-5 animate-fade-in-slow relative max-w-[1600px] mx-auto w-full h-full min-h-0 overflow-hidden z-10 transition-colors duration-500`}
    >
      {isLoading && (
        <p
          className={`text-[10px] tracking-[0.2em] uppercase ${isLight ? "text-gray-400" : "text-white/40"}`}
        >
          Loading requests...
        </p>
      )}
      {!!error && (
        <p className="text-[10px] tracking-[0.2em] text-primary uppercase">
          {error}
        </p>
      )}

      <header
        className={`mb-6 flex flex-col md:flex-row justify-between items-start md:items-end border-b pb-4 gap-4 relative z-10 ${isLight ? "border-gray-100" : "border-white/[0.03]"}`}
      >
        <div>
          <h1
            className={`uppercase px-1 text-[18px] md:text-[20px] font-bold tracking-tight ${isLight ? "text-[#1A1A1A]" : "text-white"}`}
          >
            REQUESTS INBOX
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto items-center">
          <div
            className={`flex items-center transition-colors rounded-xl px-2.5 py-2 min-w-[200px] md:min-w-[220px] border ${isLight ? "bg-white border-gray-200 hover:border-gray-300" : "bg-black/40 border-white/10 hover:border-white/20"}`}
          >
            <Search
              size={12}
              className={`${isLight ? "text-gray-400" : "text-white/20"} mr-2`}
            />
            <input
              type="text"
              placeholder="Search Visitor..."
              className={`bg-transparent text-[10px] focus:outline-none w-full ${isLight ? "text-[#1A1A1A] placeholder-gray-400" : "text-white placeholder-white/20"}`}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>

          <div className="relative min-w-[120px] w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange(e.target.value)}
              className={`w-full pl-2.5 pr-7 py-1.5 rounded-xl text-[9px] font-medium uppercase tracking-widest transition-all cursor-pointer outline-none appearance-none border ${isLight ? "bg-white border-gray-200 text-[#1A1A1A] hover:bg-gray-50" : "bg-black/40 border-white/10 text-white hover:border-white/20"}`}
            >
              <option
                value="All"
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[#0A0A0B] text-white"
                }
              >
                ALL STATUS
              </option>
              <option
                value="Sent to Visitor"
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[#0A0A0B] text-white"
                }
              >
                SENT TO VISITOR
              </option>
              <option
                value="Accepted by Visitor"
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[#0A0A0B] text-white"
                }
              >
                ACCEPTED BY VISITOR
              </option>
              <option
                value="Accepted by Contact Person"
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[#0A0A0B] text-white"
                }
              >
                ACCEPTED BY CONTACT PERSON
              </option>
              <option
                value="Admin Approved"
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[#0A0A0B] text-white"
                }
              >
                ADMIN APPROVED
              </option>
              <option
                value="Rejected"
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[#0A0A0B] text-white"
                }
              >
                REJECTED
              </option>
              <option
                value="Checked Out"
                className={
                  isLight
                    ? "bg-white text-[#1A1A1A]"
                    : "bg-[#0A0A0B] text-white"
                }
              >
                CHECKED OUT
              </option>
            </select>
            <div
              className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none border-l pl-2 ${isLight ? "text-gray-400 border-gray-200" : "text-gray-300 border-white/10"}`}
            >
              <Eye size={9} />
            </div>
          </div>
        </div>
      </header>

      <div className="mt-2 h-[calc(100vh-180px)] min-h-0 overflow-hidden">
        <RequestsTable requests={filteredRequests} onReview={handleReview} />
      </div>
    </div>
  );
};

export default RequestsInboxMain;
