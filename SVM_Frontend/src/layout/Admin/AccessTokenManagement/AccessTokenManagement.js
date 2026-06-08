import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Hash,
  KeyRound,
  RefreshCw,
  Search,
  ShieldOff,
  XCircle,
  Mail,
  Plus,
  Send,
  Calendar,
  MapPin,
  ClipboardCheck,
} from "lucide-react";
import Header from "../../../components/Admin/Layout/Header";
import PageSpinner from "../../../components/common/PageSpinner";
import VisitorAccessTokenService from "../../../services/VisitorAccessTokenService";
import VisitRequestService from "../../../services/VisitRequestService";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Active", value: "A" },
  { label: "Expired", value: "E" },
];

const getResultSet = (response) => {
  const data = response?.data?.ResultSet || response?.data || response;
  if (!data) return [];
  return Array.isArray(data) ? data : [data];
};

const getField = (token, fields, fallback = "-") => {
  const value = fields
    .map((field) => token?.[field])
    .find((item) => item !== undefined && item !== null && item !== "");
  return value ?? fallback;
};

const normalizeStatus = (status) => String(status || "").trim().toUpperCase();

const isActiveToken = (token) => {
  const status = normalizeStatus(getField(token, ["VVAT_Status", "Status"], ""));
  return status === "A" || status === "ACTIVE";
};

const getStatusLabel = (token) => (isActiveToken(token) ? "Active" : "Expired");

const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

const AccessTokenManagement = () => {
  const [activeTab, setActiveTab] = useState(0); // 0 = Token List, 1 = Lookup Requests by Visitor
  const [tokens, setTokens] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isActioning, setIsActioning] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  // Expiration modal state
  const [confirmToken, setConfirmToken] = useState(null);
  
  // Visit Request lookup state
  const [lookupVisitorId, setLookupVisitorId] = useState("");
  const [visitorRequestsList, setVisitorRequestsList] = useState([]);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  
  // Manual Generation Dialog state
  const [genDialogOpen, setGenDialogOpen] = useState(false);
  const [genRequestId, setGenRequestId] = useState("");
  const [genVisitorId, setGenVisitorId] = useState("");
  const [genPuid, setGenPuid] = useState("Admin");
  const [sendNotificationOption, setSendNotificationOption] = useState(true);

  const activeCount = useMemo(
    () => tokens.filter((token) => isActiveToken(token)).length,
    [tokens],
  );
  const expiredCount = Math.max(tokens.length - activeCount, 0);

  const notify = (message, severity = "success") => {
    setNotification({ open: true, message, severity });
  };

  const loadTokens = async (status = statusFilter) => {
    try {
      setLoading(true);
      setError("");
      const response = await VisitorAccessTokenService.GetAllTokens(status);
      setTokens(getResultSet(response));
    } catch (err) {
      setError(
        err?.response?.data?.Message ||
          err?.message ||
          "Failed to load access tokens.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokens(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered tokens based on search input (Request ID or Visitor ID)
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return tokens;
    const q = searchQuery.trim().toLowerCase();
    return tokens.filter((token) => {
      const rId = String(getField(token, ["VVR_Request_id", "Request_id", "RequestId"], "")).toLowerCase();
      const vId = String(getField(token, ["VV_Visitor_id", "Visitor_id", "VisitorId"], "")).toLowerCase();
      const tkValue = String(getField(token, ["VVAT_Token", "Token", "AccessToken"], "")).toLowerCase();
      return rId.includes(q) || vId.includes(q) || tkValue.includes(q);
    });
  }, [tokens, searchQuery]);

  const handleLookupRequests = async (e) => {
    if (e) e.preventDefault();
    if (!lookupVisitorId.trim()) {
      setVisitorRequestsList([]);
      return;
    }

    try {
      setLookupLoading(true);
      setLookupError("");
      const response = await VisitRequestService.GetVisitRequestsByVisitor(lookupVisitorId.trim());
      const list = getResultSet(response);
      setVisitorRequestsList(list);
      if (list.length === 0) {
        setLookupError("No visit requests found for this visitor ID.");
      }
    } catch (err) {
      setVisitorRequestsList([]);
      setLookupError(
        err?.response?.data?.Message ||
          err?.message ||
          "Failed to load visitor visit requests.",
      );
    } finally {
      setLookupLoading(false);
    }
  };

  const handleManualGenerateToken = async (e) => {
    e.preventDefault();
    if (!genRequestId.trim() || !genVisitorId.trim()) {
      notify("Please fill in both Request ID and Visitor ID", "error");
      return;
    }

    try {
      setIsActioning(true);
      if (sendNotificationOption) {
        // Generate and dispatch SMS/Email
        await VisitorAccessTokenService.GenerateVisitorSmsAndEmailAccessToken(
          genRequestId.trim(),
          genVisitorId.trim(),
          genPuid.trim() || "Admin",
        );
        notify(
          `Access token generated and notifications dispatched to visitor #${genVisitorId}.`,
        );
      } else {
        // Generate only
        await VisitorAccessTokenService.GenerateToken(
          genRequestId.trim(),
          genVisitorId.trim(),
          genPuid.trim() || "Admin",
        );
        notify(`Access token generated successfully for visitor #${genVisitorId}.`);
      }
      setGenDialogOpen(false);
      setGenRequestId("");
      setGenVisitorId("");
      await loadTokens(statusFilter);
      // If we are looking up requests, refresh the requests list as well
      if (lookupVisitorId.trim()) {
        handleLookupRequests();
      }
    } catch (err) {
      notify(
        err?.response?.data?.Message ||
          err?.message ||
          "Failed to generate access token.",
        "error",
      );
    } finally {
      setIsActioning(false);
    }
  };

  const handleGenerateFromLookup = async (request) => {
    const rId = request.VVR_Request_id || request.Request_id;
    const vId = request.VVR_Visitor_id || request.Visitor_id || lookupVisitorId.trim();

    if (!rId || !vId) {
      notify("Missing Request ID or Visitor ID.", "error");
      return;
    }

    try {
      setIsActioning(true);
      await VisitorAccessTokenService.GenerateVisitorSmsAndEmailAccessToken(
        rId,
        vId,
        "Admin",
      );
      notify(
        `Access token generated and SMS/Email sent to visitor for request #${rId}!`,
      );
      await loadTokens(statusFilter);
      // Reload lookup requests to update UI
      handleLookupRequests();
    } catch (err) {
      notify(
        err?.response?.data?.Message ||
          err?.message ||
          "Failed to generate and send token.",
        "error",
      );
    } finally {
      setIsActioning(false);
    }
  };

  const handleExpireToken = async () => {
    if (!confirmToken) return;

    const rId = getField(confirmToken, ["VVR_Request_id", "Request_id", "RequestId"], "");
    if (!rId) {
      notify("Request ID is missing for this token.", "error");
      setConfirmToken(null);
      return;
    }

    try {
      setIsActioning(true);
      await VisitorAccessTokenService.ExpireToken(rId, "System");
      notify(`Access token for request #${rId} expired successfully.`);
      setConfirmToken(null);
      await loadTokens(statusFilter);
      if (lookupVisitorId.trim()) {
        handleLookupRequests();
      }
    } catch (err) {
      notify(
        err?.response?.data?.Message ||
          err?.message ||
          "Failed to expire access token.",
        "error",
      );
    } finally {
      setIsActioning(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notify("Token copied to clipboard!");
  };

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header title="Access Token Management" />

      <div className="flex-1 p-3 sm:p-4 md:p-8 overflow-y-auto w-full animate-fade-in-slow relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        
        <div className="max-w-none mx-auto">
          {/* Top Info Cards */}
          <header className="mb-6 flex flex-col xl:flex-row justify-between items-center gap-6 relative z-10 px-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-xl backdrop-blur-md">
                <KeyRound size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
                  Visitor Access Tokens
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {tokens.length} Total Tokens
                  </span>
                  <span className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest font-medium">
                    {activeCount} Active / {expiredCount} Expired
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center shrink-0 w-full xl:w-auto justify-end">
              <button
                type="button"
                onClick={() => setGenDialogOpen(true)}
                className="flex items-center justify-center gap-2 h-9 px-4 rounded-[10px] bg-primary text-white hover:bg-primary-hover transition-all text-[11px] font-bold uppercase tracking-widest"
              >
                <Plus size={14} />
                Generate Token
              </button>

              <button
                type="button"
                onClick={() => loadTokens(statusFilter)}
                disabled={loading}
                className="flex items-center justify-center gap-2 h-9 px-4 rounded-[10px] border border-[var(--color-border-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-all disabled:opacity-50 text-[11px] font-bold uppercase tracking-widest"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </header>

          {/* Navigation Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "rgba(255, 255, 255, 0.05)", mb: 4 }}>
            <Tabs
              value={activeTab}
              onChange={(e, val) => setActiveTab(val)}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                "& .MuiTab-root": {
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--color-text-dim)",
                  "&.Mui-selected": {
                    color: "var(--color-primary)",
                  },
                },
              }}
            >
              <Tab label="Access Tokens Registry" />
              <Tab label="Retrieve Requests By Visitor" />
            </Tabs>
          </Box>

          {activeTab === 0 ? (
            /* TAB 0: TOKEN REGISTRY */
            <div className="space-y-4">
              {/* Filter / Search Bar */}
              <div className="flex flex-col lg:flex-row gap-3 justify-between items-center bg-[var(--color-surface-1)] p-4 border border-[var(--color-border-soft)] rounded-[12px]">
                <div className="flex gap-1 p-1 bg-[var(--color-bg-default)] border border-[var(--color-border-soft)] rounded-[10px] w-full sm:w-auto">
                  {statusOptions.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter(option.value);
                      }}
                      className={`h-7 px-4 rounded-[6px] text-[10px] font-bold uppercase tracking-widest transition-all ${
                        statusFilter === option.value
                          ? "bg-primary text-white"
                          : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-80 group">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search
                      size={14}
                      className="text-[var(--color-text-dim)] group-focus-within:text-primary transition-colors"
                    />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by Request/Visitor ID or Token..."
                    className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] text-[var(--color-text-primary)] text-[12px] rounded-full py-2 pl-9 pr-10 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-[var(--color-text-dim)]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-dim)] hover:text-[var(--color-text-primary)] transition-colors"
                      title="Clear search"
                    >
                      <XCircle size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Main Token Table */}
              <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[5px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                {loading ? (
                  <div className="p-20 flex flex-col items-center justify-center text-center">
                    <PageSpinner size={40} color="var(--color-primary)" />
                  </div>
                ) : error ? (
                  <div className="p-20 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                      <AlertCircle size={24} />
                    </div>
                    <p className="text-primary text-[12px] font-bold uppercase tracking-widest leading-relaxed">
                      {error}
                    </p>
                  </div>
                ) : (
                  <TableContainer
                    component={Paper}
                    className="bg-transparent border-none z-10 relative"
                    sx={{ maxHeight: "620px", minHeight: "400px", overflow: "auto" }}
                  >
                    <Table stickyHeader aria-label="access token table" sx={{ tableLayout: "fixed", width: "100%" }}>
                      <TableHead>
                        <TableRow sx={{ height: "24px", backgroundColor: "var(--color-bg-paper)" }}>
                          {["Request ID", "Visitor ID", "Token Value", "Created On", "Expired On", "Status", "Actions"].map((heading, index) => (
                            <TableCell
                              key={heading}
                              align={index >= 5 ? "center" : "left"}
                              sx={{
                                padding: "8px 16px",
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                width: index === 2 ? "30%" : index >= 5 ? "120px" : "14%",
                              }}
                              className="text-[var(--color-text-secondary)] font-normal text-[11px] tracking-[0.2em] uppercase whitespace-nowrap bg-inherit"
                            >
                              {heading}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody className="divide-y divide-white/[0.04]">
                        {filteredTokens.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              align="center"
                              className="py-16 text-[var(--color-text-dim)] uppercase tracking-widest text-[12px]"
                            >
                              No access tokens found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTokens.map((token, index) => {
                            const requestIdValue = getField(token, ["VVR_Request_id", "Request_id", "RequestId"]);
                            const visitorIdValue = getField(token, ["VV_Visitor_id", "Visitor_id", "VisitorId"]);
                            const tokenValue = getField(token, ["VVAT_Token", "Token", "AccessToken"]);
                            const createdAt = getField(token, ["VVAT_Created_Date", "Created_Date", "CreatedDate", "Created_On"], "");
                            const expiredAt = getField(token, ["VVAT_Expired_Date", "Expired_Date", "ExpiredDate", "Expired_On"], "");
                            const active = isActiveToken(token);

                            return (
                              <TableRow
                                key={`${requestIdValue}-${tokenValue}-${index}`}
                                sx={{
                                  "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" },
                                  height: "32px",
                                  transition: "all 0.2s ease",
                                }}
                              >
                                <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-primary)] align-middle font-normal text-[12px]">
                                  <div className="flex items-center gap-1">
                                    <Hash size={10} className="text-primary/40" />
                                    <span>{requestIdValue}</span>
                                  </div>
                                </TableCell>
                                <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-secondary)] align-middle font-normal text-[12px]">
                                  <span>{visitorIdValue}</span>
                                </TableCell>
                                <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-secondary)] align-middle font-mono text-[11px] truncate">
                                  <div className="flex items-center gap-2 max-w-full">
                                    <span className="truncate flex-1">{tokenValue}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleCopyToClipboard(tokenValue)}
                                      className="p-1 hover:bg-white/5 rounded text-[10px] text-primary/80 uppercase font-bold"
                                      title="Copy token string"
                                    >
                                      Copy
                                    </button>
                                  </div>
                                </TableCell>
                                <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-secondary)] align-middle font-normal text-[11px]">
                                  {formatDate(createdAt)}
                                </TableCell>
                                <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-secondary)] align-middle font-normal text-[11px]">
                                  {formatDate(expiredAt)}
                                </TableCell>
                                <TableCell align="center" sx={{ padding: "8px 16px", borderBottom: "none" }}>
                                  <Chip
                                    icon={active ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
                                    label={getStatusLabel(token)}
                                    size="small"
                                    sx={{
                                      height: 22,
                                      fontSize: "10px",
                                      fontWeight: 700,
                                      color: active ? "#22c55e" : "#ef4444",
                                      backgroundColor: active ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                                      border: `1px solid ${active ? "rgba(34,197,94,0.25)" : "rgba(239,68,68,0.25)"}`,
                                      "& .MuiChip-icon": { color: "inherit" },
                                    }}
                                  />
                                </TableCell>
                                <TableCell align="center" sx={{ padding: "8px 16px", borderBottom: "none" }}>
                                  <button
                                    type="button"
                                    onClick={() => setConfirmToken(token)}
                                    disabled={!active || isActioning}
                                    className="inline-flex items-center justify-center gap-1.5 h-7 px-3 rounded-[6px] text-[10px] font-bold uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                  >
                                    <ShieldOff size={11} />
                                    Expire
                                  </button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            </div>
          ) : (
            /* TAB 1: HISTORY LOOKUP & ACTIONS */
            <div className="space-y-6">
              {/* Lookup Form */}
              <div className="bg-[var(--color-surface-1)] p-5 border border-[var(--color-border-soft)] rounded-[12px]">
                <form onSubmit={handleLookupRequests} className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] uppercase font-bold text-[var(--color-text-dim)] tracking-widest">
                      Visitor ID Lookup
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={lookupVisitorId}
                      onChange={(e) => setLookupVisitorId(e.target.value)}
                      placeholder="Enter visitor ID (e.g. 10)..."
                      className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] text-[var(--color-text-primary)] text-[13px] rounded-lg py-2 px-3 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-[var(--color-text-dim)]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={lookupLoading || !lookupVisitorId}
                    className="flex items-center justify-center gap-2 h-9 px-6 rounded-[8px] bg-primary text-white hover:bg-primary-hover transition-all text-[11px] font-bold uppercase tracking-widest disabled:opacity-50 shrink-0 w-full md:w-auto"
                  >
                    {lookupLoading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
                    Retrieve requests
                  </button>
                </form>
              </div>

              {/* Lookup results */}
              <div className="bg-[var(--color-bg-paper)] border border-white/5 rounded-[5px] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                {lookupLoading ? (
                  <div className="p-20 flex flex-col items-center justify-center text-center">
                    <PageSpinner size={40} color="var(--color-primary)" />
                  </div>
                ) : lookupError ? (
                  <div className="p-16 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-primary/20 text-primary">
                      <AlertCircle size={20} />
                    </div>
                    <p className="text-primary text-[11px] font-bold uppercase tracking-widest">
                      {lookupError}
                    </p>
                  </div>
                ) : visitorRequestsList.length === 0 ? (
                  <div className="p-16 text-center text-[var(--color-text-dim)] uppercase tracking-widest text-[11px]">
                    Enter a Visitor ID and click retrieve to view visit requests history.
                  </div>
                ) : (
                  <TableContainer
                    component={Paper}
                    className="bg-transparent border-none z-10 relative"
                    sx={{ maxHeight: "620px", overflow: "auto" }}
                  >
                    <Table sx={{ tableLayout: "fixed", width: "100%" }}>
                      <TableHead>
                        <TableRow sx={{ height: "24px", backgroundColor: "var(--color-bg-paper)" }}>
                          {["Request ID", "Visit Date", "Visiting Place", "Purpose", "Status", "Actions"].map((heading, index) => (
                            <TableCell
                              key={heading}
                              align={index >= 4 ? "center" : "left"}
                              sx={{
                                padding: "8px 16px",
                                borderBottom: "1px solid rgba(255,255,255,0.05)",
                                width: index === 2 || index === 3 ? "24%" : index >= 4 ? "140px" : "12%",
                              }}
                              className="text-[var(--color-text-secondary)] font-normal text-[11px] tracking-[0.2em] uppercase whitespace-nowrap bg-inherit"
                            >
                              {heading}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody className="divide-y divide-white/[0.04]">
                        {visitorRequestsList.map((req, index) => {
                          const rId = req.VVR_Request_id || req.Request_id;
                          const date = req.VVR_Visit_Date ? req.VVR_Visit_Date.split("T")[0] : "N/A";
                          const places = req.VVR_Places_to_Visit || "N/A";
                          const purpose = req.VVR_Purpose || "N/A";
                          const statusStr = normalizeStatus(req.VVR_Status || "P");
                          
                          let displayStatus = "Pending";
                          let chipColor = "#fbbf24";
                          let chipBg = "rgba(251,191,36,0.12)";
                          
                          if (statusStr === "A" || statusStr === "APPROVED" || statusStr === "ACCEPTED") {
                            displayStatus = "Approved";
                            chipColor = "#22c55e";
                            chipBg = "rgba(34,197,94,0.12)";
                          } else if (statusStr === "R" || statusStr === "REJECTED" || statusStr === "DECLINED") {
                            displayStatus = "Rejected";
                            chipColor = "#ef4444";
                            chipBg = "rgba(239,68,68,0.12)";
                          } else if (statusStr === "SENT" || statusStr === "SENT_TO_ADMIN" || statusStr === "SENT TO ADMIN") {
                            displayStatus = "Sent to Admin";
                            chipColor = "#3b82f6";
                            chipBg = "rgba(59,130,246,0.12)";
                          }

                          // Check if we already have an active access token for this request
                          const existingToken = tokens.find(
                            (t) => String(getField(t, ["VVR_Request_id", "Request_id", "RequestId"])) === String(rId)
                          );
                          const hasActiveToken = existingToken && isActiveToken(existingToken);

                          return (
                            <TableRow
                              key={`${rId}-${index}`}
                              sx={{
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" },
                                height: "32px",
                                transition: "all 0.2s ease",
                              }}
                            >
                              <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-primary)] align-middle font-normal text-[12px]">
                                <div className="flex items-center gap-1">
                                  <Hash size={10} className="text-primary/40" />
                                  <span>{rId}</span>
                                </div>
                              </TableCell>
                              <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-secondary)] align-middle font-normal text-[12px]">
                                <div className="flex items-center gap-1.5">
                                  <Calendar size={11} className="text-primary/40" />
                                  <span>{date}</span>
                                </div>
                              </TableCell>
                              <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-secondary)] align-middle font-normal text-[12px] truncate">
                                <div className="flex items-center gap-1.5 truncate">
                                  <MapPin size={11} className="text-primary/40" />
                                  <span className="truncate">{places}</span>
                                </div>
                              </TableCell>
                              <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-secondary)] align-middle font-normal text-[12px] truncate">
                                <span className="truncate">{purpose}</span>
                              </TableCell>
                              <TableCell align="center" sx={{ padding: "8px 16px", borderBottom: "none" }}>
                                <Chip
                                  label={displayStatus}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: "9px",
                                    fontWeight: 700,
                                    color: chipColor,
                                    backgroundColor: chipBg,
                                    border: `1px solid ${chipColor}33`,
                                  }}
                                />
                              </TableCell>
                              <TableCell align="center" sx={{ padding: "8px 16px", borderBottom: "none" }}>
                                {hasActiveToken ? (
                                  <div className="flex items-center justify-center gap-1 text-[#22c55e] text-[10px] font-bold uppercase tracking-wider">
                                    <ClipboardCheck size={12} />
                                    <span>Token Active</span>
                                  </div>
                                ) : statusStr === "A" || statusStr === "APPROVED" ? (
                                  <button
                                    type="button"
                                    onClick={() => handleGenerateFromLookup(req)}
                                    disabled={isActioning}
                                    className="inline-flex items-center justify-center gap-1.5 h-7 px-3 rounded-[6px] text-[10px] font-bold uppercase tracking-widest bg-green-500/10 border border-green-500/20 text-[#22c55e] hover:bg-green-500 hover:text-white transition-all disabled:opacity-40"
                                  >
                                    <Send size={11} />
                                    Send SMS/Email
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-wider">
                                    Requires Approval
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONFIRM EXPIRE DIALOG */}
      <Dialog open={Boolean(confirmToken)} onClose={() => setConfirmToken(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Expire Access Token</DialogTitle>
        <DialogContent>
          <p className="text-[13px] text-[var(--color-text-secondary)] leading-6">
            Are you sure you want to expire the active access token for request #
            {getField(confirmToken, ["VVR_Request_id", "Request_id", "RequestId"], "")}? The visitor will lose gate clearance immediately upon confirmation.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setConfirmToken(null)} color="inherit" disabled={isActioning}>
            Cancel
          </Button>
          <Button onClick={handleExpireToken} variant="contained" color="primary" disabled={isActioning}>
            {isActioning ? "Expiring..." : "Expire Token"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* MANUAL GENERATION DIALOG */}
      <Dialog open={genDialogOpen} onClose={() => setGenDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Generate Visitor Access Token</DialogTitle>
        <DialogContent>
          <form onSubmit={handleManualGenerateToken} id="manual-token-form" className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[var(--color-text-dim)] tracking-widest">
                Visit Request ID (VVR_Request_id)
              </label>
              <input
                type="number"
                min="1"
                required
                value={genRequestId}
                onChange={(e) => setGenRequestId(e.target.value)}
                placeholder="Enter request ID..."
                className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] text-[var(--color-text-primary)] text-[13px] rounded-lg py-2 px-3 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[var(--color-text-dim)] tracking-widest">
                Visitor ID (VV_Visitor_id)
              </label>
              <input
                type="number"
                min="1"
                required
                value={genVisitorId}
                onChange={(e) => setGenVisitorId(e.target.value)}
                placeholder="Enter visitor ID..."
                className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] text-[var(--color-text-primary)] text-[13px] rounded-lg py-2 px-3 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[var(--color-text-dim)] tracking-widest">
                Issuer UID
              </label>
              <input
                type="text"
                required
                value={genPuid}
                onChange={(e) => setGenPuid(e.target.value)}
                placeholder="Admin..."
                className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] text-[var(--color-text-primary)] text-[13px] rounded-lg py-2 px-3 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="send-notif-checkbox"
                checked={sendNotificationOption}
                onChange={(e) => setSendNotificationOption(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <label htmlFor="send-notif-checkbox" className="text-[12px] text-[var(--color-text-secondary)] font-medium cursor-pointer">
                Automatically dispatch SMS and Email notification (dispatches to visitor's registered contacts)
              </label>
            </div>
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setGenDialogOpen(false)} color="inherit" disabled={isActioning}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="manual-token-form"
            variant="contained"
            color="primary"
            disabled={isActioning || !genRequestId || !genVisitorId}
            className="flex items-center gap-1.5"
          >
            {isActioning ? "Processing..." : sendNotificationOption ? "Generate & Send" : "Generate Token"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* SNACKBAR NOTIFICATIONS */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          sx={{ width: "100%", borderRadius: 2 }}
          elevation={6}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AccessTokenManagement;
