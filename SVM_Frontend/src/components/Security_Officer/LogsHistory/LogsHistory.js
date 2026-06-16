import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Download,
  Filter,
  History,
  LogIn,
  LogOut,
  MapPin,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";
import PageSpinner from "../../../components/common/PageSpinner";
import GatePassService from "../../../services/GatePassService";
import VisitLogService from "../../../services/VisitLogService";
import {
  createPassLookup,
  getVisitLogPassId,
  normalizeVisitLog,
  sortVisitLogsNewestFirst,
  unwrapApiList,
} from "../../../utils/visitLogUtils";

const CsvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center rounded-[5px] border px-2.5 py-1 text-[11px] font-semibold ${
      status === "Active"
        ? "border-green-500/20 bg-green-500/10 text-green-500"
        : "border-orange-500/20 bg-orange-500/10 text-orange-500"
    }`}
  >
    {status === "Active" ? "Inside" : "Completed"}
  </span>
);

const LogMobileCard = ({ log }) => (
  <article className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] p-4 shadow-lg">
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="truncate text-sm font-bold text-[var(--color-text-primary)]">
          {log.name}
        </h3>
        <p className="text-[11px] text-[var(--color-text-secondary)]">
          {log.ref} | {log.date}
        </p>
      </div>
      <StatusBadge status={log.status} />
    </div>

    <div className="mt-4 grid gap-2 text-[12px] text-[var(--color-text-secondary)]">
      <div className="flex items-center gap-2">
        <LogIn size={14} className="text-green-500" />
        <span>In: {log.entryTime}</span>
      </div>
      <div className="flex items-center gap-2">
        <LogOut size={14} className="text-orange-500" />
        <span>Out: {log.exitTime}</span>
      </div>
      <div className="flex items-center gap-2">
        <MapPin size={14} className="text-primary" />
        <span className="truncate">{log.accessedAreas}</span>
      </div>
    </div>
  </article>
);

const LogsHistoryMain = () => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState("");
  const [lastSync, setLastSync] = useState(null);

  const fetchLogs = useCallback(async ({ silent = false } = {}) => {
    if (!silent) {
      setIsLoading(true);
    }
    setError("");

    try {
      const [logsResult, passesResult] = await Promise.allSettled([
        VisitLogService.GetAllVisitLogs(),
        GatePassService.GetAllGatePasses(),
      ]);

      if (logsResult.status === "rejected") {
        throw logsResult.reason;
      }

      const visitLogs = unwrapApiList(logsResult.value);
      const passLookup = createPassLookup(
        passesResult.status === "fulfilled"
          ? unwrapApiList(passesResult.value)
          : [],
      );

      setLogs(
        sortVisitLogsNewestFirst(
          visitLogs.map((log) =>
            normalizeVisitLog(
              log,
              passLookup.get(String(getVisitLogPassId(log))) || {},
            ),
          ),
        ),
      );
      setLastSync(new Date());
    } catch (err) {
      console.error("Error loading VisitLog history:", err);
      setLogs([]);
      setError(
        err?.message ||
          "Unable to load movement history. Please refresh and try again.",
      );
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return logs.filter((log) => {
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && log.status === "Active") ||
        (statusFilter === "completed" && log.status === "Left");
      const matchesSearch =
        !query ||
        [log.name, log.nic, log.ref, log.accessedAreas]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [logs, searchQuery, statusFilter]);

  const exportCsv = () => {
    const header = [
      "Visit ID",
      "Pass ID",
      "Visitor",
      "NIC",
      "Entry Time",
      "Exit Time",
      "Accessed Areas",
      "Status",
    ];
    const rows = filteredLogs.map((log) => [
      log.id,
      log.passId,
      log.name,
      log.nic,
      log.entryTime,
      log.exitTime,
      log.accessedAreas,
      log.status === "Active" ? "Inside" : "Completed",
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map(CsvCell).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visit-log-history-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeCount = logs.filter((log) => log.status === "Active").length;
  const completedCount = logs.filter((log) => log.status === "Left").length;

  return (
    <div className="space-y-5 bg-[var(--color-bg-default)] p-4 text-[var(--color-text-primary)] sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 border-b border-[var(--color-border-soft)] pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[6px] border border-primary/20 bg-primary/10 text-primary">
            <History size={21} />
          </div>
          <div>
            <h1 className="text-lg font-bold">Movement Log History</h1>
            <p className="text-[12px] text-[var(--color-text-secondary)]">
              Complete VisitLog registry for entries, exits, and visitors still
              inside.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          <div className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] px-3 py-2 text-[12px] text-[var(--color-text-secondary)]">
            Inside:{" "}
            <span className="font-bold text-green-500">{activeCount}</span>
          </div>
          <div className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] px-3 py-2 text-[12px] text-[var(--color-text-secondary)]">
            Done:{" "}
            <span className="font-bold text-orange-500">{completedCount}</span>
          </div>
        </div>
      </header>

      <section className="rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-bg-paper)] shadow-2xl">
        <div className="flex flex-col gap-3 border-b border-[var(--color-border-soft)] p-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] xl:max-w-2xl">
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search visitor, NIC, pass, or area"
                className="w-full rounded-[5px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] py-2 pl-9 pr-3 text-[12px] text-[var(--color-text-primary)] outline-none transition focus:border-primary/50"
              />
            </div>

            <div className="relative">
              <Filter
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-dim)]"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-[5px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] py-2 pl-9 pr-3 text-[12px] text-[var(--color-text-primary)] outline-none transition focus:border-primary/50 sm:w-44"
              >
                <option value="all">All logs</option>
                <option value="active">Inside only</option>
                <option value="completed">Completed only</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-[6px] border border-[var(--color-border-soft)] bg-[var(--color-surface-1)] px-3 py-2 text-[12px] text-[var(--color-text-secondary)]">
              <Calendar size={14} />
              {lastSync
                ? lastSync.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Not synced"}
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSyncing(true);
                fetchLogs({ silent: true });
              }}
              disabled={isSyncing}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-[var(--color-border-soft)] px-4 py-2 text-xs font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-surface-2)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              type="button"
              onClick={exportCsv}
              disabled={filteredLogs.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Download size={14} />
              Export
            </button>
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
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <UserRound size={36} className="text-[var(--color-text-dim)]" />
            <p className="mt-4 text-sm font-semibold text-[var(--color-text-primary)]">
              No logs found
            </p>
            <p className="mt-1 max-w-sm text-[12px] text-[var(--color-text-secondary)]">
              New entries appear after security scans a valid visitor QR code.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 p-4 md:hidden">
              {filteredLogs.map((log) => (
                <LogMobileCard key={log.id || log.passId} log={log} />
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[820px] text-left">
                <thead>
                  <tr className="border-b border-[var(--color-border-soft)] bg-[var(--color-surface-1)] text-[12px] text-[var(--color-text-secondary)]">
                    <th className="px-5 py-3 font-medium">Visitor</th>
                    <th className="px-5 py-3 font-medium">Entry</th>
                    <th className="px-5 py-3 font-medium">Exit</th>
                    <th className="px-5 py-3 font-medium">Accessed area</th>
                    <th className="px-5 py-3 text-center font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Visit ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border-soft)]">
                  {filteredLogs.map((log) => (
                    <tr
                      key={log.id || log.passId}
                      className="transition hover:bg-[var(--color-surface-1)]"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">
                          {log.name}
                        </p>
                        <p className="text-[11px] text-[var(--color-text-secondary)]">
                          {log.ref} | NIC: {log.nic}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-2">
                          <LogIn size={14} className="text-green-500" />
                          <span>{log.entryTime}</span>
                        </div>
                        <p className="mt-1 text-[11px] text-[var(--color-text-dim)]">
                          {log.date}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-2">
                          <LogOut size={14} className="text-orange-500" />
                          <span>{log.exitTime}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[12px] text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-primary" />
                          <span className="max-w-[260px] truncate">
                            {log.accessedAreas}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={log.status} />
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-[12px] text-[var(--color-text-secondary)]">
                        #{log.id || "N/A"}
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

export default LogsHistoryMain;
