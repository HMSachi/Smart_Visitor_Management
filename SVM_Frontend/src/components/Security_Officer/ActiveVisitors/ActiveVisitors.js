import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  LogOut,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  Shield,
  Users,
} from "lucide-react";
import PageSpinner from "../../../components/common/PageSpinner";
import GatePassService from "../../../services/GatePassService";
import VisitLogService from "../../../services/VisitLogService";
import {
  createPassLookup,
  getVisitLogPassId,
  hasVisitLogCheckedOut,
  normalizeVisitLog,
  sortVisitLogsNewestFirst,
  toLocalApiDateTime,
  unwrapApiList,
} from "../../../utils/visitLogUtils";

const statusStyles = {
  Active: "text-green-500 bg-green-500/10 border-green-500/20",
  Left: "text-orange-500 bg-orange-500/10 border-orange-500/20",
};

const StatTile = ({ icon: Icon, label, value, detail }) => (
  <div className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] p-4 shadow-lg">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-medium text-[var(--color-text-secondary)]">
          {label}
        </p>
        <p className="mt-2 text-2xl font-bold text-[var(--color-text-primary)]">
          {value}
        </p>
      </div>
      <div className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-primary/20 bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
    </div>
    <p className="mt-3 text-[11px] text-[var(--color-text-dim)]">{detail}</p>
  </div>
);

const StatusPill = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-[5px] border px-2.5 py-1 text-[11px] font-semibold ${statusStyles[status] || statusStyles.Active}`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${status === "Active" ? "bg-green-500" : "bg-orange-500"}`}
    />
    {status === "Active" ? "Inside" : "Checked out"}
  </span>
);

const VisitorAvatar = ({ name, active }) => {
  const initials = String(name || "Visitor")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] text-[12px] font-bold text-[var(--color-text-primary)]">
      {initials || "V"}
      <span
        className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-[var(--color-bg-paper)] ${active ? "bg-green-500" : "bg-orange-500"}`}
      />
    </div>
  );
};

const VisitorCard = ({ visitor, onCheckout, checkingOut }) => (
  <article className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] p-4 shadow-lg">
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <VisitorAvatar name={visitor.name} active={visitor.status === "Active"} />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-[var(--color-text-primary)]">
            {visitor.name}
          </h3>
          <p className="text-[11px] text-[var(--color-text-secondary)]">
            {visitor.ref}
          </p>
        </div>
      </div>
      <StatusPill status={visitor.status} />
    </div>

    <div className="mt-4 grid grid-cols-1 gap-2 text-[12px] text-[var(--color-text-secondary)]">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-green-500" />
        <span>In: {visitor.entryTime}</span>
      </div>
      {visitor.status === "Left" && (
        <div className="flex items-center gap-2">
          <LogOut size={14} className="text-orange-500" />
          <span>Out: {visitor.exitTime}</span>
        </div>
      )}
      <div className="flex items-center gap-2">
        <MapPin size={14} className="text-primary" />
        <span className="truncate">{visitor.accessedAreas}</span>
      </div>
      <div className="flex items-center gap-2">
        <Phone size={14} className="text-[var(--color-text-dim)]" />
        <span>{visitor.phone}</span>
      </div>
    </div>

    {visitor.status === "Active" && (
      <button
        type="button"
        onClick={() => onCheckout(visitor)}
        disabled={checkingOut === visitor.id}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-[5px] bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {checkingOut === visitor.id ? (
          <RefreshCw size={14} className="animate-spin" />
        ) : (
          <LogOut size={14} />
        )}
        Check out
      </button>
    )}
  </article>
);

const EmptyState = ({ activeTab }) => (
  <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-surface-2)] text-[var(--color-text-dim)]">
      <Users size={22} />
    </div>
    <p className="mt-4 text-sm font-semibold text-[var(--color-text-primary)]">
      {activeTab === "inside" ? "No visitors inside" : "No departed visitors"}
    </p>
    <p className="mt-1 max-w-sm text-[12px] text-[var(--color-text-secondary)]">
      Scan a visitor QR code to create an entry log. Checked-out visitors will
      appear here after the out-time is stored.
    </p>
  </div>
);

const ActiveVisitorsMain = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("inside");
  const [visitorsList, setVisitorsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [checkingOut, setCheckingOut] = useState(null);
  const [error, setError] = useState("");
  const [lastSync, setLastSync] = useState(null);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString(),
  );

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentTime(new Date().toLocaleTimeString()),
      1000,
    );
    return () => clearInterval(timer);
  }, []);

  const fetchVisitors = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true);
    }
    setError("");

    try {
      const [insideResult, allResult, passesResult] = await Promise.allSettled([
        VisitLogService.GetVisitorsInside(),
        VisitLogService.GetAllVisitLogs(),
        GatePassService.GetAllGatePasses(),
      ]);

      const insideLogs =
        insideResult.status === "fulfilled"
          ? unwrapApiList(insideResult.value)
          : [];
      const allLogs =
        allResult.status === "fulfilled" ? unwrapApiList(allResult.value) : [];
      const passes =
        passesResult.status === "fulfilled"
          ? unwrapApiList(passesResult.value)
          : [];

      if (insideResult.status === "rejected" && allResult.status === "rejected") {
        throw insideResult.reason || allResult.reason;
      }

      const passLookup = createPassLookup(passes);
      const allSource = allLogs.length > 0 ? allLogs : insideLogs;
      const activeSource =
        insideLogs.length > 0
          ? insideLogs
          : allSource.filter((log) => !hasVisitLogCheckedOut(log));
      const departedSource = allSource.filter((log) =>
        hasVisitLogCheckedOut(log),
      );

      const mapLog = (log) =>
        normalizeVisitLog(
          log,
          passLookup.get(String(getVisitLogPassId(log))) || {},
        );

      setVisitorsList(
        sortVisitLogsNewestFirst([
          ...activeSource.map(mapLog),
          ...departedSource.map(mapLog),
        ]),
      );
      setLastSync(new Date());
    } catch (err) {
      console.error("Error fetching visit logs:", err);
      setVisitorsList([]);
      setError(
        err?.message ||
          "Unable to load visit logs. Please check the connection and try again.",
      );
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const triggerSync = async () => {
    setIsSyncing(true);
    await fetchVisitors({ silent: true });
  };

  const handleCheckout = async (visitor) => {
    if (!visitor?.id || !visitor?.passId) {
      alert("This visitor log is missing a visit id or pass id.");
      return;
    }

    setCheckingOut(visitor.id);
    try {
      await VisitLogService.UpdateVisitLog(
        visitor.id,
        visitor.passId,
        visitor.accessedAreas,
        toLocalApiDateTime(new Date()),
      );

      try {
        await GatePassService.UpdateGatePassStatus(visitor.passId, "OUT");
      } catch (statusErr) {
        console.warn("Gate pass status update failed:", statusErr);
      }

      await fetchVisitors({ silent: true });
    } catch (err) {
      console.error("Checkout failed:", err);
      alert(`Checkout failed: ${err?.message || "Unable to update visit log"}`);
    } finally {
      setCheckingOut(null);
    }
  };

  const activeCount = visitorsList.filter((v) => v.status === "Active").length;
  const leftCount = visitorsList.filter((v) => v.status === "Left").length;
  const latest = visitorsList[0];

  const filteredVisitors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return visitorsList.filter((visitor) => {
      const matchesTab =
        activeTab === "inside"
          ? visitor.status === "Active"
          : visitor.status === "Left";
      const matchesSearch =
        !query ||
        [visitor.name, visitor.nic, visitor.ref, visitor.accessedAreas]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, visitorsList]);

  return (
    <div className="space-y-5 text-[var(--color-text-primary)]">
      <header className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-primary/20 bg-primary/10 text-primary">
            <Shield size={21} />
          </div>
          <div>
            <h2 className="text-base font-bold">Visitor Movement Registry</h2>
            <p className="text-[12px] text-[var(--color-text-secondary)]">
              Live entry logs, current visitors inside, and database checkout.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] px-3 py-2 text-[12px] text-[var(--color-text-secondary)]">
            Time:{" "}
            <span className="font-mono text-[var(--color-text-primary)]">
              {currentTime}
            </span>
          </div>
          <button
            type="button"
            onClick={triggerSync}
            disabled={isSyncing}
            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={15} className={isSyncing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          icon={Users}
          label="Inside now"
          value={activeCount}
          detail="Open VisitLog records"
        />
        <StatTile
          icon={CheckCircle2}
          label="Checked out"
          value={leftCount}
          detail="Completed visitor movements"
        />
        <StatTile
          icon={Activity}
          label="Total logs"
          value={visitorsList.length}
          detail={latest ? `Latest: ${latest.name}` : "No movement yet"}
        />
      </section>

      <section className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] shadow-2xl">
        <div className="flex flex-col gap-3 border-b border-[var(--color-border-soft)] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex rounded-[5px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("inside")}
              className={`flex-1 rounded-[4px] px-4 py-2 text-xs font-semibold transition sm:flex-none ${
                activeTab === "inside"
                  ? "bg-green-500 text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
              }`}
            >
              Inside ({activeCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("left")}
              className={`flex-1 rounded-[4px] px-4 py-2 text-xs font-semibold transition sm:flex-none ${
                activeTab === "left"
                  ? "bg-orange-500 text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-2)]"
              }`}
            >
              Out ({leftCount})
            </button>
          </div>

          <div className="relative w-full lg:max-w-sm">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]"
            />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search by name, NIC, pass, or area"
              className="w-full rounded-[5px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] py-2 pl-9 pr-3 text-[12px] text-[var(--color-text-primary)] outline-none transition focus:border-primary/50"
            />
          </div>
        </div>

        {error && (
          <div className="m-4 rounded-[5px] border border-primary/20 bg-primary/10 px-4 py-3 text-[12px] text-primary">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-16">
            <PageSpinner size={42} color="var(--color-primary)" />
          </div>
        ) : filteredVisitors.length === 0 ? (
          <EmptyState activeTab={activeTab} />
        ) : (
          <>
            <div className="grid gap-3 p-4 md:hidden">
              {filteredVisitors.map((visitor) => (
                <VisitorCard
                  key={`${visitor.status}-${visitor.id || visitor.passId}`}
                  visitor={visitor}
                  onCheckout={handleCheckout}
                  checkingOut={checkingOut}
                />
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[860px] text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border-soft)] bg-[var(--color-surface-1)] text-[12px] text-[var(--color-text-secondary)]">
                    <th className="px-5 py-3 font-medium">Visitor</th>
                    <th className="px-5 py-3 font-medium">Time log</th>
                    <th className="px-5 py-3 font-medium">Accessed area</th>
                    <th className="px-5 py-3 font-medium">Contact</th>
                    <th className="px-5 py-3 text-center font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-soft)]">
                  {filteredVisitors.map((visitor) => (
                    <tr
                      key={`${visitor.status}-${visitor.id || visitor.passId}`}
                      className="transition hover:bg-[var(--color-surface-1)]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <VisitorAvatar
                            name={visitor.name}
                            active={visitor.status === "Active"}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-[var(--color-text-primary)]">
                              {visitor.name}
                            </p>
                            <p className="text-[11px] text-[var(--color-text-secondary)]">
                              {visitor.ref} | NIC: {visitor.nic}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[var(--color-text-secondary)]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock size={14} className="text-green-500" />
                            <span>In: {visitor.entryTime}</span>
                          </div>
                          {visitor.status === "Left" ? (
                            <div className="flex items-center gap-2">
                              <LogOut size={14} className="text-orange-500" />
                              <span>Out: {visitor.exitTime}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Activity size={14} className="text-primary" />
                              <span>Inside: {visitor.duration}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex max-w-[260px] flex-wrap gap-1.5">
                          {(visitor.areas.length > 0
                            ? visitor.areas
                            : ["Main Premises"]
                          ).map((area) => (
                            <span
                              key={area}
                              className="rounded-[5px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] px-2 py-1 text-[11px] text-[var(--color-text-secondary)]"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[var(--color-text-secondary)]">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Phone size={14} />
                            <span>{visitor.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Building size={14} />
                            <span>{visitor.company}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusPill status={visitor.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        {visitor.status === "Active" ? (
                          <button
                            type="button"
                            onClick={() => handleCheckout(visitor)}
                            disabled={checkingOut === visitor.id}
                            className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-orange-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {checkingOut === visitor.id ? (
                              <RefreshCw size={14} className="animate-spin" />
                            ) : (
                              <LogOut size={14} />
                            )}
                            Check out
                          </button>
                        ) : (
                          <span className="text-[11px] text-[var(--color-text-dim)]">
                            Complete
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default ActiveVisitorsMain;
