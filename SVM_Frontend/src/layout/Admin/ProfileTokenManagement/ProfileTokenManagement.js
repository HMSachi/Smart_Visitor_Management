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
} from "lucide-react";
import Header from "../../../components/Admin/Layout/Header";
import PageSpinner from "../../../components/common/PageSpinner";
import VisitorProfileTokenService from "../../../services/VisitorProfileTokenService";

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
  const value = fields.map((field) => token?.[field]).find((item) => item !== undefined && item !== null && item !== "");
  return value ?? fallback;
};

const normalizeStatus = (status) => String(status || "").trim().toUpperCase();

const isActiveToken = (token) => {
  const status = normalizeStatus(getField(token, ["VVPT_Status", "Status"], ""));
  return status === "A" || status === "ACTIVE";
};

const getStatusLabel = (token) => (isActiveToken(token) ? "Active" : "Expired");

const formatDate = (value) => {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString();
};

const ProfileTokenManagement = () => {
  const [tokens, setTokens] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExpiring, setIsExpiring] = useState(false);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmToken, setConfirmToken] = useState(null);

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
      const response = await VisitorProfileTokenService.GetAllProfileTokens(status);
      setTokens(getResultSet(response));
    } catch (err) {
      setError(err?.response?.data?.Message || err?.message || "Failed to load profile tokens.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTokens(statusFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleVisitorSearch = async (event) => {
    event.preventDefault();

    if (!visitorId.trim()) {
      loadTokens(statusFilter);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await VisitorProfileTokenService.GetProfileTokenByVisitorId(visitorId.trim());
      setTokens(getResultSet(response));
    } catch (err) {
      setTokens([]);
      setError(err?.response?.data?.Message || err?.message || "No profile token found for this visitor ID.");
    } finally {
      setLoading(false);
    }
  };

  const clearVisitorSearch = () => {
    setVisitorId("");
    loadTokens(statusFilter);
  };

  const handleExpireToken = async () => {
    if (!confirmToken) return;

    const selectedVisitorId = getField(confirmToken, ["VV_Visitor_id", "Visitor_id", "VisitorId"], "");
    if (!selectedVisitorId) {
      notify("Visitor ID is missing for this token.", "error");
      setConfirmToken(null);
      return;
    }

    try {
      setIsExpiring(true);
      await VisitorProfileTokenService.ExpireProfileToken(selectedVisitorId, "Admin");
      notify(`Profile token for visitor #${selectedVisitorId} expired successfully.`);
      setConfirmToken(null);
      await loadTokens(statusFilter);
    } catch (err) {
      notify(err?.response?.data?.Message || err?.message || "Failed to expire profile token.", "error");
    } finally {
      setIsExpiring(false);
    }
  };

  return (
    <div className="flex flex-col min-w-0 bg-[var(--color-bg-default)] min-h-screen">
      <Header title="Profile Token Management" />

      <div className="flex-1 p-3 sm:p-4 md:p-8 overflow-y-auto w-full animate-fade-in-slow relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        <div className="max-w-none mx-auto">
          <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 px-1">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary shadow-xl backdrop-blur-md">
                <KeyRound size={22} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] tracking-tight">
                  Visitor Profile Tokens
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {tokens.length} Tokens
                  </span>
                  <span className="text-[10px] text-[var(--color-text-dim)] uppercase tracking-widest font-medium">
                    {activeCount} Active / {expiredCount} Expired
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center shrink-0 w-full md:w-auto">
              <div className="flex gap-1 p-1.5 bg-[var(--color-surface-1)] border border-[var(--color-border-soft)] rounded-[12px] w-full sm:w-auto">
                {statusOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => {
                      setVisitorId("");
                      setStatusFilter(option.value);
                    }}
                    className={`h-8 px-4 rounded-[8px] text-[11px] font-bold uppercase tracking-widest transition-all flex-1 sm:flex-none ${
                      statusFilter === option.value
                        ? "bg-primary text-white"
                        : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <form onSubmit={handleVisitorSearch} className="relative w-full sm:w-72 group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <Search
                    size={14}
                    className="text-[var(--color-text-dim)] group-focus-within:text-primary transition-colors"
                  />
                </div>
                <input
                  type="number"
                  min="1"
                  value={visitorId}
                  onChange={(event) => setVisitorId(event.target.value)}
                  placeholder="Filter by visitor ID..."
                  className="w-full bg-[var(--color-bg-paper)] border border-[var(--color-border-soft)] text-[var(--color-text-primary)] text-[13px] rounded-full py-2 pl-9 pr-10 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-[var(--color-text-dim)]"
                />
                {visitorId && (
                  <button
                    type="button"
                    onClick={clearVisitorSearch}
                    className="absolute inset-y-0 right-3 flex items-center text-[var(--color-text-dim)] hover:text-[var(--color-text-primary)] transition-colors"
                    title="Clear visitor filter"
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </form>

              <button
                type="button"
                onClick={() => loadTokens(statusFilter)}
                disabled={loading}
                className="flex items-center justify-center gap-2 h-9 px-4 rounded-[10px] border border-[var(--color-border-soft)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5 transition-all disabled:opacity-50 text-[11px] font-bold uppercase tracking-widest w-full sm:w-auto"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </header>

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
                sx={{ maxHeight: "620px", minHeight: "400px", overflow: "auto", overflowX: "auto" }}
              >
                <Table stickyHeader aria-label="profile token table" sx={{ minWidth: 900, tableLayout: "fixed", width: "100%" }}>
                  <TableHead>
                    <TableRow sx={{ height: "24px", backgroundColor: "var(--color-bg-paper)" }}>
                      {["Visitor ID", "Token", "Created", "Expired", "Status", "Actions"].map((heading, index) => (
                        <TableCell
                          key={heading}
                          align={index >= 4 ? "center" : "left"}
                          sx={{
                            padding: "8px 16px",
                            borderBottom: "1px solid rgba(255,255,255,0.05)",
                            width: index === 1 ? "34%" : index >= 4 ? "130px" : "16%",
                          }}
                          className="text-[var(--color-text-secondary)] font-normal text-[12px] tracking-[0.3em] uppercase whitespace-nowrap bg-[var(--color-bg-paper)]"
                        >
                          {heading}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody className="divide-y divide-white/[0.04]">
                    {tokens.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          align="center"
                          className="py-12 text-[var(--color-text-dim)] uppercase tracking-widest text-[12px]"
                        >
                          No profile tokens found
                        </TableCell>
                      </TableRow>
                    ) : (
                      tokens.map((token, index) => {
                        const visitorIdValue = getField(token, ["VV_Visitor_id", "Visitor_id", "VisitorId"]);
                        const tokenValue = getField(token, ["VVPT_Token", "Token", "ProfileToken"]);
                        const createdAt = getField(token, ["VVPT_Created_Date", "Created_Date", "CreatedDate", "Created_On"], "");
                        const expiredAt = getField(token, ["VVPT_Expired_Date", "Expired_Date", "ExpiredDate", "Expired_On"], "");
                        const active = isActiveToken(token);

                        return (
                          <TableRow
                            key={`${visitorIdValue}-${tokenValue}-${index}`}
                            sx={{
                              "&:hover": { backgroundColor: "rgba(255,255,255,0.02)" },
                              height: "32px",
                              transition: "all 0.2s ease",
                            }}
                          >
                            <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-primary)] align-middle font-normal text-[12px]">
                              <div className="flex items-center gap-1">
                                <Hash size={10} className="text-primary/40" />
                                <span>{visitorIdValue}</span>
                              </div>
                            </TableCell>
                            <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-secondary)] align-middle font-mono text-[12px] truncate">
                              {tokenValue}
                            </TableCell>
                            <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-secondary)] align-middle font-normal text-[12px]">
                              {formatDate(createdAt)}
                            </TableCell>
                            <TableCell sx={{ padding: "8px 16px", borderBottom: "none" }} className="text-[var(--color-text-secondary)] align-middle font-normal text-[12px]">
                              {formatDate(expiredAt)}
                            </TableCell>
                            <TableCell align="center" sx={{ padding: "8px 16px", borderBottom: "none" }}>
                              <Chip
                                icon={active ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                                label={getStatusLabel(token)}
                                size="small"
                                sx={{
                                  height: 24,
                                  fontSize: "11px",
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
                                disabled={!active || isExpiring}
                                className="inline-flex items-center justify-center gap-2 h-8 px-3 rounded-[8px] text-[11px] font-bold uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <ShieldOff size={13} />
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
      </div>

      <Dialog open={Boolean(confirmToken)} onClose={() => setConfirmToken(null)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Expire Profile Token</DialogTitle>
        <DialogContent>
          <p className="text-[13px] text-[var(--color-text-secondary)] leading-6">
            This will expire the active profile token for visitor #
            {getField(confirmToken, ["VV_Visitor_id", "Visitor_id", "VisitorId"], "")}. The visitor will not be able to use this token after confirmation.
          </p>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setConfirmToken(null)} color="inherit" disabled={isExpiring}>
            Cancel
          </Button>
          <Button onClick={handleExpireToken} variant="contained" color="primary" disabled={isExpiring}>
            {isExpiring ? "Expiring..." : "Expire Token"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default ProfileTokenManagement;
