import React, { useCallback, useEffect, useState } from "react";
import {
  Activity,
  Building,
  Clock,
  Filter,
  LogOut,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Shield,
  Users,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import PageSpinner from "../../../components/common/PageSpinner";
import GatePassService from "../../../services/GatePassService";
import VisitLogService from "../../../services/VisitLogService";
import {
  toLocalApiDateTime,
  unwrapApiList,
  createPassLookup,
  normalizeVisitLog,
  getVisitLogPassId,
  cleanPassId,
} from "../../../utils/visitLogUtils";

/* ─── helpers ─────────────────────────────────────────────────── */
const safeDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return isNaN(d.getTime()) ? null : d;
};

const formatTime = (value) => {
  const d = safeDate(value);
  if (!d) return "N/A";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
};

const formatDateTime = (value) => {
  const d = safeDate(value);
  if (!d) return "N/A";
  return d.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calcDuration = (inValue, outValue) => {
  const start = safeDate(inValue);
  if (!start) return "—";
  const end = outValue ? safeDate(outValue) : new Date();
  if (!end) return "—";
  const diffMs = Math.max(0, end.getTime() - start.getTime());
  const h = Math.floor(diffMs / 3_600_000);
  const m = Math.floor((diffMs % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const getField = (obj, ...keys) => {
  for (const k of keys) {
    if (obj?.[k] !== undefined && obj?.[k] !== null && obj?.[k] !== "") return obj[k];
  }
  return null;
};

const getInTime  = (log) => getField(log, "VVL_Check_in_Time", "VVL_Created_Date", "VVL_Check_In_Time", "VVL_CheckInTime", "VVL_In_Time", "VVL_Entry_Time", "Check_In_Time", "CheckInTime", "Created_Date", "CreatedDate", "vvl_created_date", "vvl_check_in_time") || log?.checkInTime;
const getOutTime = (log) => getField(log, "VVL_Check_out_Time", "VVL_Check_Out_Time", "VVL_Out_Time", "VVL_CheckOutTime", "Check_Out_Time", "CheckOutTime", "vvl_check_out_time") || log?.checkOutTime;
const getPassId  = (log) => cleanPassId(getField(log, "VVL_Pass_id", "VGP_Pass_id", "PassId", "Pass_id", "vvl_pass_id") || log?.passId);
const getVisitId = (log) => getField(log, "VVL_Visit_id", "VisitLogId", "id", "vvl_visit_id") || log?.id;
const getAreas   = (log) => getField(log, "VVL_Accessed_Areas", "Accessed_Areas") || log?.accessedAreas || "General Entry";
const getName    = (log) => getField(log, "Visitor_Name", "VV_Name", "VVL_Visitor_Name") || log?.name || "Unknown Visitor";
const getNIC     = (log) => getField(log, "Visitor_NIC", "VV_NIC_Passport_NO", "NIC") || log?.nic || "N/A";
const getPhone   = (log) => getField(log, "Visitor_Phone", "VV_Phone", "Phone") || log?.phone || "N/A";
const getCompany = (log) => getField(log, "Visitor_Company", "VV_Company") || log?.company || "N/A";

/* ─── small presentational pieces ────────────────────────────── */
const Avatar = ({ name, dot }) => {
  const initials = String(name || "V")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase() || "V";
  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] text-[12px] font-bold text-[var(--color-text-primary)]">
      {initials}
      <span className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[var(--color-bg-paper)] ${dot}`} />
    </div>
  );
};

const Badge = ({ children, color = "gray" }) => {
  const map = {
    green:  "bg-green-500/10  border-green-500/20  text-green-500",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-500",
    blue:   "bg-blue-500/10   border-blue-500/20   text-blue-500",
    gray:   "bg-[var(--color-surface-1)] border-[var(--color-border-soft)] text-[var(--color-text-secondary)]",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-[5px] border px-2 py-0.5 text-[11px] font-semibold ${map[color]}`}>
      {children}
    </span>
  );
};

const StatusFilterSelect = ({ value, onChange, className = "" }) => (
  <div className={`relative ${className}`}>
    <Filter
      size={14}
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]"
    />
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-[5px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] py-2 pl-9 pr-3 text-[12px] text-[var(--color-text-primary)] outline-none transition focus:border-primary/50 sm:w-44"
    >
      <option value="all">All visitors</option>
      <option value="inside">Inside only</option>
      <option value="outside">Outside only</option>
    </select>
  </div>
);

const matchesStatusFilter = (log, statusFilter) => {
  const isInside = !getOutTime(log);
  if (statusFilter === "inside") return isInside;
  if (statusFilter === "outside") return !isInside;
  return true;
};

const StatCard = ({ icon: Icon, label, value, sub }) => (
  <div className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-medium text-[var(--color-text-secondary)]">{label}</p>
        <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">{value}</p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-primary/20 bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
    </div>
    {sub && <p className="mt-2 text-[11px] text-[var(--color-text-dim)]">{sub}</p>}
  </div>
);

/* ─── Inside Visitors page ────────────────────────────────────── */
const InsideVisitors = ({ isAdmin = false }) => {
  const [logs, setLogs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [syncing, setSyncing]   = useState(false);
  const [error, setError]       = useState("");
  const [query, setQuery]       = useState("");
  const [checkingOut, setCheckingOut] = useState(null);
  const [toast, setToast]       = useState(null); // { type: 'success'|'error', msg }
  const [now, setNow]           = useState(new Date());

  // live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const showToast = (type, msg) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  };

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const [logsRes, passesRes] = await Promise.allSettled([
        VisitLogService.GetVisitorsInside(),
        GatePassService.GetAllGatePasses()
      ]);
      const rawLogs = logsRes.status === "fulfilled" ? unwrapApiList(logsRes.value) : [];
      const passes = passesRes.status === "fulfilled" ? unwrapApiList(passesRes.value) : [];
      const passLookup = createPassLookup(passes);
      
      const normalized = rawLogs.map(log => 
        normalizeVisitLog(log, passLookup.get(cleanPassId(getVisitLogPassId(log))) || {})
      );
      setLogs(normalized);
    } catch (e) {
      console.error(e);
      setError("Could not load inside visitors. Please check the connection.");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCheckout = async (log) => {
    const visitId = getVisitId(log);
    const passId  = getPassId(log);
    if (!visitId || !passId) {
      showToast("error", "Missing visit ID or pass ID for this record.");
      return;
    }
    setCheckingOut(visitId);
    try {
      await VisitLogService.UpdateVisitLog(
        visitId,
        passId,
        getAreas(log),
        toLocalApiDateTime(new Date())
      );
      try { await GatePassService.UpdateGatePassStatus(passId, "OUT"); } catch (_) {}
      showToast("success", `Check-out done for Pass ${passId}`);
      await load({ silent: true });
    } catch (e) {
      console.error(e);
      showToast("error", "Checkout failed. Please try again.");
    } finally {
      setCheckingOut(null);
    }
  };

  const filtered = logs.filter((log) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [getName(log), getNIC(log), String(getPassId(log) || ""), getAreas(log)]
      .some((v) => String(v).toLowerCase().includes(q));
  });

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-green-500/20 bg-green-500/10 text-green-500">
            <Users size={21} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--color-text-primary)]">Inside Visitors</h2>
            <p className="text-[12px] text-[var(--color-text-secondary)]">
              People currently inside the premises
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] px-3 py-2 text-[12px] font-mono text-[var(--color-text-secondary)]">
            {now.toLocaleTimeString()}
          </div>
          <button
            onClick={() => { setSyncing(true); load({ silent: true }); }}
            disabled={syncing}
            className="inline-flex items-center gap-2 rounded-[5px] bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
          >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-2 rounded-[5px] border px-4 py-3 text-[12px] font-medium ${
          toast.type === "success"
            ? "border-green-500/20 bg-green-500/10 text-green-600"
            : "border-red-500/20 bg-red-500/10 text-red-600"
        }`}>
          {toast.type === "success" ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
          {toast.msg}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard icon={Users}    label="Inside now"    value={logs.length}  sub="Active visitors" />
        <StatCard icon={Activity} label="Live tracking" value="Active"        sub="Auto-refreshes every 30s" />
        <StatCard icon={Shield}   label="Security mode" value="Monitoring"    sub="Entry scan enabled" />
      </div>

      {/* Table */}
      <div className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] shadow-sm">
        {/* toolbar */}
        <div className="flex flex-col gap-3 border-b border-[var(--color-border-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <Badge color="green">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
            {filtered.length} visitor{filtered.length !== 1 ? "s" : ""} inside
          </Badge>
          <div className="relative w-full sm:max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, NIC, pass or area…"
              className="w-full rounded-[5px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] py-2 pl-9 pr-3 text-[12px] outline-none transition focus:border-primary/50"
            />
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-[5px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12px] text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><PageSpinner size={40} color="var(--color-primary)" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-4">
              <Users size={26} />
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">No visitors inside right now</p>
            <p className="mt-1 text-[12px] text-[var(--color-text-secondary)]">Scan a QR code at the gate to record an entry.</p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="grid gap-3 p-4 md:hidden">
              {filtered.map((log) => {
                const visitId = getVisitId(log);
                const inTime  = getInTime(log);
                return (
                  <div key={visitId || getPassId(log)} className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar name={getName(log)} dot="bg-green-500" />
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate">{getName(log)}</p>
                        <p className="text-[11px] text-[var(--color-text-secondary)]">NIC/Passport: {getNIC(log)}</p>
                      </div>
                      <Badge color="green">Inside</Badge>
                    </div>
                    <div className="space-y-1.5 text-[12px] text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-2"><Clock size={13} className="text-green-500" /><span>In: {formatTime(inTime)}</span></div>
                      <div className="flex items-center gap-2"><Clock size={13} className="text-blue-500" /><span>Time spent: {calcDuration(inTime, null)}</span></div>
                      <div className="flex items-center gap-2"><MapPin size={13} className="text-primary" /><span className="truncate">{getAreas(log)}</span></div>
                      <div className="flex items-center gap-2"><Phone size={13} /><span>{getPhone(log)}</span></div>
                    </div>
                    {!isAdmin && (
                      <button
                        onClick={() => handleCheckout(log)}
                        disabled={checkingOut === visitId}
                        className="mt-3 w-full inline-flex items-center justify-center gap-2 rounded-[5px] bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
                      >
                        {checkingOut === visitId ? <RefreshCw size={13} className="animate-spin" /> : <LogOut size={13} />}
                        Check Out
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[800px] text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border-soft)] bg-[var(--color-surface-1)] text-[11px] uppercase tracking-wider text-[var(--color-text-secondary)]">
                    <th className="px-5 py-3 font-medium">Visitor</th>
                    <th className="px-5 py-3 font-medium">In Time</th>
                    <th className="px-5 py-3 font-medium">Time Spent</th>
                    <th className="px-5 py-3 font-medium">Accessed Area</th>
                    <th className="px-5 py-3 font-medium">Contact</th>
                    <th className="px-5 py-3 text-center font-medium">Status</th>
                    {!isAdmin && <th className="px-5 py-3 text-right font-medium">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-soft)]">
                  {filtered.map((log) => {
                    const visitId = getVisitId(log);
                    const inTime  = getInTime(log);
                    return (
                      <tr key={visitId || getPassId(log)} className="transition hover:bg-[var(--color-surface-1)]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={getName(log)} dot="bg-green-500" />
                            <div>
                              <p className="text-sm font-bold text-[var(--color-text-primary)]">{getName(log)}</p>
                              <p className="text-[11px] text-[var(--color-text-secondary)]">NIC/Passport: {getNIC(log)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-[12px] text-[var(--color-text-secondary)]">
                            <Clock size={14} className="text-green-500 shrink-0" />
                            <span className="font-medium">{formatTime(inTime)}</span>
                          </div>
                          <p className="mt-1 text-[11px] text-[var(--color-text-dim)] pl-5">{inTime ? new Date(inTime).toLocaleDateString() : ""}</p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-[12px] text-blue-500">
                            <Clock size={14} className="shrink-0" />
                            <span className="font-semibold">{calcDuration(inTime, null)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {String(getAreas(log)).split(/[,|]/).filter(Boolean).map((a) => (
                              <span key={a} className="rounded-[4px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]">{a.trim()}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[12px] text-[var(--color-text-secondary)]">
                          <div className="flex items-center gap-1.5 mb-1"><Phone size={13} /><span>{getPhone(log)}</span></div>
                          <div className="flex items-center gap-1.5"><Building size={13} /><span>{getCompany(log)}</span></div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <Badge color="green">
                            <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                            Inside
                          </Badge>
                        </td>
                        {!isAdmin && (
                          <td className="px-5 py-4 text-right">
                            <button
                              onClick={() => handleCheckout(log)}
                              disabled={checkingOut === visitId}
                              className="inline-flex items-center gap-2 rounded-[5px] bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-500 disabled:opacity-60"
                            >
                              {checkingOut === visitId ? <RefreshCw size={13} className="animate-spin" /> : <LogOut size={13} />}
                              Check Out
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Left Visitors page ──────────────────────────────────────── */
const LeftVisitors = ({ isAdmin = false }) => {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError]     = useState("");
  const [query, setQuery]     = useState("");
  const [statusFilter, setStatusFilter] = useState("outside");

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const [logsRes, passesRes] = await Promise.allSettled([
        VisitLogService.GetAllVisitLogs(),
        GatePassService.GetAllGatePasses()
      ]);
      const rawLogs = logsRes.status === "fulfilled" ? unwrapApiList(logsRes.value) : [];
      const passes = passesRes.status === "fulfilled" ? unwrapApiList(passesRes.value) : [];
      const passLookup = createPassLookup(passes);
      
      const normalized = rawLogs.map(log => 
        normalizeVisitLog(log, passLookup.get(cleanPassId(getVisitLogPassId(log))) || {})
      );
      
      normalized.sort((a, b) => {
        const ta = safeDate(getOutTime(a) || getInTime(a))?.getTime() || 0;
        const tb = safeDate(getOutTime(b) || getInTime(b))?.getTime() || 0;
        return tb - ta;
      });
      setLogs(normalized);
    } catch (e) {
      console.error(e);
      setError("Could not load departed visitors. Please check the connection.");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = logs.filter((log) => {
    if (!matchesStatusFilter(log, statusFilter)) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [getName(log), getNIC(log), String(getPassId(log) || ""), getAreas(log)]
      .some((v) => String(v).toLowerCase().includes(q));
  });

  const insideCount = logs.filter((l) => !getOutTime(l)).length;
  const outsideCount = logs.filter((l) => !!getOutTime(l)).length;

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-orange-500/20 bg-orange-500/10 text-orange-500">
            <LogOut size={21} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--color-text-primary)]">Left Visitors</h2>
            <p className="text-[12px] text-[var(--color-text-secondary)]">
              Visitors who have completed their visit and checked out
            </p>
          </div>
        </div>
        <button
          onClick={() => { setSyncing(true); load({ silent: true }); }}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-[5px] bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard icon={LogOut}      label="Checked out"    value={outsideCount}  sub="Visitors who left" />
        <StatCard icon={Users}       label="Inside now"     value={insideCount}   sub="Still on premises" />
        <StatCard icon={Activity}    label="Showing"        value={filtered.length} sub="After current filters" />
      </div>

      {/* Table */}
      <div className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[var(--color-border-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <Badge color="orange">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 inline-block" />
            {filtered.length} record{filtered.length !== 1 ? "s" : ""}
          </Badge>
          <div className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row">
            <StatusFilterSelect value={statusFilter} onChange={setStatusFilter} />
            <div className="relative w-full sm:flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, NIC, pass or area…"
                className="w-full rounded-[5px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] py-2 pl-9 pr-3 text-[12px] outline-none transition focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-[5px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12px] text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-16"><PageSpinner size={40} color="var(--color-primary)" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10 text-orange-500 mb-4">
              <LogOut size={26} />
            </div>
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">No visitors match your filters</p>
            <p className="mt-1 text-[12px] text-[var(--color-text-secondary)]">Try changing the status filter or search term.</p>
          </div>
        ) : (
          <>
            {/* Mobile cards */}
            <div className="grid gap-3 p-4 md:hidden">
              {filtered.map((log) => {
                const visitId = getVisitId(log);
                const inTime  = getInTime(log);
                const outTime = getOutTime(log);
                const isInside = !outTime;
                return (
                  <div key={visitId || getPassId(log)} className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar name={getName(log)} dot={isInside ? "bg-green-500" : "bg-orange-500"} />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">{getName(log)}</p>
                        <p className="text-[11px] text-[var(--color-text-secondary)]">NIC/Passport: {getNIC(log)}</p>
                      </div>
                      <Badge color={isInside ? "green" : "orange"}>{isInside ? "Inside" : "Left"}</Badge>
                    </div>
                    <div className="space-y-1.5 text-[12px] text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-2"><Clock size={13} className="text-green-500" /><span>In: {formatTime(inTime)}</span></div>
                      {outTime ? (
                        <div className="flex items-center gap-2"><LogOut size={13} className="text-orange-500" /><span>Out: {formatTime(outTime)}</span></div>
                      ) : (
                        <div className="flex items-center gap-2"><Clock size={13} className="text-blue-500" /><span>Time spent: {calcDuration(inTime, null)}</span></div>
                      )}
                      {outTime && (
                        <div className="flex items-center gap-2"><Clock size={13} className="text-blue-500" /><span>Duration: {calcDuration(inTime, outTime)}</span></div>
                      )}
                      <div className="flex items-center gap-2"><MapPin size={13} className="text-primary" /><span className="truncate">{getAreas(log)}</span></div>
                      <div className="flex items-center gap-2"><Phone size={13} /><span>{getPhone(log)}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[860px] text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border-soft)] bg-[var(--color-surface-1)] text-[11px] uppercase tracking-wider text-[var(--color-text-secondary)]">
                    <th className="px-5 py-3 font-medium">Visitor</th>
                    <th className="px-5 py-3 font-medium">In Time</th>
                    <th className="px-5 py-3 font-medium">Out Time</th>
                    <th className="px-5 py-3 font-medium">Duration</th>
                    <th className="px-5 py-3 font-medium">Accessed Area</th>
                    <th className="px-5 py-3 font-medium">Contact</th>
                    <th className="px-5 py-3 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-soft)]">
                  {filtered.map((log) => {
                    const visitId = getVisitId(log);
                    const inTime  = getInTime(log);
                    const outTime = getOutTime(log);
                    const isInside = !outTime;
                    return (
                      <tr key={visitId || getPassId(log)} className="transition hover:bg-[var(--color-surface-1)]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={getName(log)} dot={isInside ? "bg-green-500" : "bg-orange-500"} />
                            <div>
                              <p className="text-sm font-bold text-[var(--color-text-primary)]">{getName(log)}</p>
                              <p className="text-[11px] text-[var(--color-text-secondary)]">NIC/Passport: {getNIC(log)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-[12px]">
                            <Clock size={14} className="text-green-500 shrink-0" />
                            <div>
                              <p className="font-medium text-[var(--color-text-primary)]">{formatTime(inTime)}</p>
                              <p className="text-[11px] text-[var(--color-text-dim)]">{inTime ? new Date(inTime).toLocaleDateString() : ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {outTime ? (
                            <div className="flex items-center gap-2 text-[12px]">
                              <LogOut size={14} className="text-orange-500 shrink-0" />
                              <div>
                                <p className="font-medium text-[var(--color-text-primary)]">{formatTime(outTime)}</p>
                                <p className="text-[11px] text-[var(--color-text-dim)]">{new Date(outTime).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[var(--color-text-dim)]">Still inside</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-[12px] text-blue-500">
                            <Clock size={14} className="shrink-0" />
                            <span className="font-semibold">{calcDuration(inTime, outTime)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {String(getAreas(log)).split(/[,|]/).filter(Boolean).map((a) => (
                              <span key={a} className="rounded-[4px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]">{a.trim()}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[12px] text-[var(--color-text-secondary)]">
                          <div className="flex items-center gap-1.5 mb-1"><Phone size={13} /><span>{getPhone(log)}</span></div>
                          <div className="flex items-center gap-1.5"><Building size={13} /><span>{getCompany(log)}</span></div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <Badge color={isInside ? "green" : "orange"}>
                            <span className={`h-1.5 w-1.5 rounded-full inline-block ${isInside ? "bg-green-500" : "bg-orange-500"}`} />
                            {isInside ? "Inside" : "Left"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── All Visitor Logs (Admin) ────────────────────────────────── */
const AllVisitorLogs = () => {
  const [logs, setLogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError]     = useState("");
  const [query, setQuery]     = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const [logsRes, passesRes] = await Promise.allSettled([
        VisitLogService.GetAllVisitLogs(),
        GatePassService.GetAllGatePasses()
      ]);
      const rawLogs = logsRes.status === "fulfilled" ? unwrapApiList(logsRes.value) : [];
      const passes = passesRes.status === "fulfilled" ? unwrapApiList(passesRes.value) : [];
      const passLookup = createPassLookup(passes);
      
      const normalized = rawLogs.map(log => 
        normalizeVisitLog(log, passLookup.get(cleanPassId(getVisitLogPassId(log))) || {})
      );
      
      normalized.sort((a, b) => {
        const ta = safeDate(getInTime(a))?.getTime() || 0;
        const tb = safeDate(getInTime(b))?.getTime() || 0;
        return tb - ta;
      });
      setLogs(normalized);
    } catch (e) {
      console.error(e);
      setError("Could not load visitor logs. Please check the connection.");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const insideCount = logs.filter((l) => !getOutTime(l)).length;
  const leftCount   = logs.filter((l) => !!getOutTime(l)).length;

  const filtered = logs.filter((log) => {
    if (!matchesStatusFilter(log, statusFilter)) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return [getName(log), getNIC(log), String(getPassId(log) || ""), getAreas(log)]
      .some((v) => String(v).toLowerCase().includes(q));
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-primary/20 bg-primary/10 text-primary">
            <Activity size={21} />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--color-text-primary)]">All Visitor Logs</h2>
            <p className="text-[12px] text-[var(--color-text-secondary)]">Complete history — inside and departed</p>
          </div>
        </div>
        <button
          onClick={() => { setSyncing(true); load({ silent: true }); }}
          disabled={syncing}
          className="inline-flex items-center gap-2 rounded-[5px] bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60 self-start sm:self-auto"
        >
          <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={Activity}    label="Total logs"   value={logs.length}   sub="All records" />
        <StatCard icon={Users}       label="Inside now"   value={insideCount}   sub="No checkout yet" />
        <StatCard icon={CheckCircle2} label="Checked out" value={leftCount}      sub="Completed visits" />
      </div>

      <div className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] shadow-sm">
        <div className="flex flex-col gap-3 border-b border-[var(--color-border-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-[12px] font-semibold text-[var(--color-text-secondary)]">{filtered.length} records</span>
          <div className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row">
            <StatusFilterSelect value={statusFilter} onChange={setStatusFilter} />
            <div className="relative w-full sm:flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, NIC, pass, area…"
                className="w-full rounded-[5px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] py-2 pl-9 pr-3 text-[12px] outline-none transition focus:border-primary/50"
              />
            </div>
          </div>
        </div>

        {error && <div className="m-4 rounded-[5px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-[12px] text-red-600">{error}</div>}

        {loading ? (
          <div className="flex justify-center py-16"><PageSpinner size={40} color="var(--color-primary)" /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity size={40} className="mb-4 text-[var(--color-text-dim)]" />
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">No visitor logs found</p>
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="grid gap-3 p-4 md:hidden">
              {filtered.map((log) => {
                const inTime  = getInTime(log);
                const outTime = getOutTime(log);
                const isInside = !outTime;
                return (
                  <div key={getVisitId(log) || getPassId(log)} className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar name={getName(log)} dot={isInside ? "bg-green-500" : "bg-orange-500"} />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-sm truncate">{getName(log)}</p>
                        <p className="text-[11px] text-[var(--color-text-secondary)]">NIC/Passport: {getNIC(log)}</p>
                      </div>
                      <Badge color={isInside ? "green" : "orange"}>{isInside ? "Inside" : "Left"}</Badge>
                    </div>
                    <div className="space-y-1 text-[12px] text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-2"><Clock size={13} className="text-green-500" /><span>In: {formatTime(inTime)}</span></div>
                      {outTime && <div className="flex items-center gap-2"><LogOut size={13} className="text-orange-500" /><span>Out: {formatTime(outTime)}</span></div>}
                      <div className="flex items-center gap-2"><Clock size={13} className="text-blue-500" /><span>{calcDuration(inTime, outTime)}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[860px] text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border-soft)] bg-[var(--color-surface-1)] text-[11px] uppercase tracking-wider text-[var(--color-text-secondary)]">
                    <th className="px-5 py-3 font-medium">Visitor</th>
                    <th className="px-5 py-3 font-medium">In Time</th>
                    <th className="px-5 py-3 font-medium">Out Time</th>
                    <th className="px-5 py-3 font-medium">Duration</th>
                    <th className="px-5 py-3 font-medium">Accessed Area</th>
                    <th className="px-5 py-3 font-medium">Contact</th>
                    <th className="px-5 py-3 text-center font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-soft)]">
                  {filtered.map((log) => {
                    const inTime  = getInTime(log);
                    const outTime = getOutTime(log);
                    const isInside = !outTime;
                    return (
                      <tr key={getVisitId(log) || getPassId(log)} className="transition hover:bg-[var(--color-surface-1)]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar name={getName(log)} dot={isInside ? "bg-green-500" : "bg-orange-500"} />
                            <div>
                              <p className="text-sm font-bold text-[var(--color-text-primary)]">{getName(log)}</p>
                              <p className="text-[11px] text-[var(--color-text-secondary)]">NIC/Passport: {getNIC(log)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-[12px]">
                            <Clock size={14} className="text-green-500 shrink-0" />
                            <div>
                              <p className="font-medium text-[var(--color-text-primary)]">{formatTime(inTime)}</p>
                              <p className="text-[11px] text-[var(--color-text-dim)]">{inTime ? new Date(inTime).toLocaleDateString() : ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {outTime ? (
                            <div className="flex items-center gap-2 text-[12px]">
                              <LogOut size={14} className="text-orange-500 shrink-0" />
                              <div>
                                <p className="font-medium text-[var(--color-text-primary)]">{formatTime(outTime)}</p>
                                <p className="text-[11px] text-[var(--color-text-dim)]">{new Date(outTime).toLocaleDateString()}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[var(--color-text-dim)]">Still inside</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-[12px] text-blue-500">
                            <Clock size={14} />
                            <span className="font-semibold">{calcDuration(inTime, outTime)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1">
                            {String(getAreas(log)).split(/[,|]/).filter(Boolean).map((a) => (
                              <span key={a} className="rounded-[4px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] px-2 py-0.5 text-[11px] text-[var(--color-text-secondary)]">{a.trim()}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[12px] text-[var(--color-text-secondary)]">
                          <div className="flex items-center gap-1.5 mb-1"><Phone size={13} /><span>{getPhone(log)}</span></div>
                          <div className="flex items-center gap-1.5"><Building size={13} /><span>{getCompany(log)}</span></div>
                        </td>
                        <td className="px-5 py-4 text-center">
                          <Badge color={isInside ? "green" : "orange"}>
                            <span className={`h-1.5 w-1.5 rounded-full inline-block ${isInside ? "bg-green-500" : "bg-orange-500"}`} />
                            {isInside ? "Inside" : "Left"}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Root export — routes to the right page by defaultTab ────── */
const ActiveVisitorsMain = ({ defaultTab = "inside", isAdmin = false }) => {
  if (defaultTab === "all")   return <AllVisitorLogs />;
  if (defaultTab === "left")  return <LeftVisitors isAdmin={isAdmin} />;
  return <InsideVisitors isAdmin={isAdmin} />;
};

export default ActiveVisitorsMain;
