import {
  updateMetric,
  setActiveVisitors,
  setAccessLogs,
  setAlerts,
} from "../reducers/securitySlice";
import GatePassService from "../services/GatePassService";
import VisitLogService from "../services/VisitLogService";
import {
  createPassLookup,
  formatDateOnly,
  getVisitLogPassId,
  hasVisitLogCheckedOut,
  normalizeVisitLog,
  sortVisitLogsNewestFirst,
  unwrapApiList,
} from "../utils/visitLogUtils";

export const FetchSecurityDashboardData = () => async (dispatch) => {
  try {
    const dashboard = await loadVisitLogSecurityDashboard();
    dispatch(setActiveVisitors(dashboard.activeVisitors));
    dispatch(setAlerts(dashboard.alerts));
    dispatch(setAccessLogs(dashboard.accessLogs));

    dispatch(
      updateMetric({
        label: "People Inside",
        value: dashboard.metrics.peopleInside.toString(),
      }),
    );
    dispatch(
      updateMetric({
        label: "Scans Today",
        value: dashboard.metrics.scansToday.toString(),
      }),
    );

    return { success: true };
  } catch (error) {
    console.error("Error fetching security dashboard data:", error);
    const fallback = loadLocalSecurityDashboard();
    dispatch(setActiveVisitors(fallback.activeVisitors));
    dispatch(setAlerts(fallback.alerts));
    dispatch(setAccessLogs(fallback.accessLogs));
    dispatch(
      updateMetric({
        label: "People Inside",
        value: fallback.metrics.peopleInside.toString(),
      }),
    );
    dispatch(
      updateMetric({
        label: "Scans Today",
        value: fallback.metrics.scansToday.toString(),
      }),
    );
    return { success: false, error };
  }
};

const loadVisitLogSecurityDashboard = async () => {
  const [insideResult, allResult, passesResult] = await Promise.allSettled([
    VisitLogService.GetVisitorsInside(),
    VisitLogService.GetAllVisitLogs(),
    GatePassService.GetAllGatePasses(),
  ]);

  const insideLogs =
    insideResult.status === "fulfilled" ? unwrapApiList(insideResult.value) : [];
  const allLogs =
    allResult.status === "fulfilled" ? unwrapApiList(allResult.value) : [];
  const passes =
    passesResult.status === "fulfilled" ? unwrapApiList(passesResult.value) : [];

  if (insideResult.status === "rejected" && allResult.status === "rejected") {
    throw insideResult.reason || allResult.reason;
  }

  const passLookup = createPassLookup(passes);
  const allSource = allLogs.length > 0 ? allLogs : insideLogs;
  const activeSource =
    insideLogs.length > 0
      ? insideLogs
      : allSource.filter((log) => !hasVisitLogCheckedOut(log));

  const mapLog = (log) =>
    normalizeVisitLog(log, passLookup.get(String(getVisitLogPassId(log))) || {});

  const activeVisitors = sortVisitLogsNewestFirst(activeSource.map(mapLog)).map(
    (visitor) => ({
      id: visitor.id || visitor.passId,
      name: visitor.name,
      location: visitor.accessedAreas,
      duration: visitor.duration,
      badge: visitor.ref,
      status: "approved",
    }),
  );

  const normalizedLogs = sortVisitLogsNewestFirst(allSource.map(mapLog));
  const movementEntries = normalizedLogs.flatMap((visitor) => {
    const entries = [];

    if (visitor.checkInTime) {
      entries.push({
        id: `${visitor.id || visitor.passId}-in`,
        rawTimestamp: visitor.checkInTime,
        visitorName: visitor.name,
        action: "Entry",
        location: visitor.accessedAreas,
        status: "Success",
        method: "QR Code",
      });
    }

    if (visitor.checkOutTime) {
      entries.push({
        id: `${visitor.id || visitor.passId}-out`,
        rawTimestamp: visitor.checkOutTime,
        visitorName: visitor.name,
        action: "Exit",
        location: visitor.accessedAreas,
        status: "Success",
        method: "QR Code",
      });
    }

    return entries;
  });

  movementEntries.sort(
    (a, b) => new Date(b.rawTimestamp || 0) - new Date(a.rawTimestamp || 0),
  );

  const todayKey = formatDateOnly(new Date());
  const scansToday = movementEntries.filter((entry) =>
    String(entry.rawTimestamp || "").startsWith(todayKey),
  );

  const accessLogs = movementEntries.slice(0, 20).map((entry) => ({
    ...entry,
    timestamp: entry.rawTimestamp
      ? new Date(entry.rawTimestamp).toLocaleString([], {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A",
  }));

  const alerts = movementEntries.slice(0, 10).map((entry) => ({
    id: `alert-${entry.id}`,
    type: entry.action === "Entry" ? "info" : "success",
    title: entry.action === "Entry" ? "Visitor Entered" : "Visitor Exited",
    description: `${entry.visitorName} ${entry.action === "Entry" ? "checked in" : "checked out"} at ${entry.location}`,
    time: entry.rawTimestamp ? calculateRelativeTime(entry.rawTimestamp) : "Just now",
    severity: "normal",
  }));

  return {
    metrics: {
      peopleInside: activeVisitors.length,
      scansToday: scansToday.length,
    },
    activeVisitors,
    accessLogs,
    alerts,
  };
};

const loadLocalSecurityDashboard = () => {
  const emptyState = {
    metrics: { peopleInside: 0, scansToday: 0 },
    activeVisitors: [],
    accessLogs: [],
    alerts: [],
  };

  if (typeof window === "undefined") {
    return emptyState;
  }

  let keys = [];
  try {
    keys = Object.keys(window.localStorage || {});
  } catch (err) {
    console.warn("localStorage access blocked:", err);
    return emptyState;
  }

  const todayKey = new Date().toISOString().slice(0, 10);
  const scanLogKeys = keys.filter((key) => key.startsWith("svm.scanLog."));
  const entries = [];

  scanLogKeys.forEach((key) => {
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        parsed.forEach((entry) => {
          if (entry && entry.timestamp) {
            entries.push({
              ...entry,
              passId: entry.passId || entry.VGP_Pass_id,
            });
          }
        });
      }
    } catch (err) {
      console.warn("Failed to parse scan log:", err);
    }
  });

  entries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const latestByPass = new Map();
  entries.forEach((entry) => {
    if (!entry.passId) return;
    if (!latestByPass.has(entry.passId)) {
      latestByPass.set(entry.passId, entry);
    }
  });

  const getPassMeta = (passId) => {
    if (!passId) return null;
    try {
      const raw = window.localStorage.getItem(`svm.gatePassMeta.${passId}`);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn("Failed to read gate pass meta:", err);
      return null;
    }
  };

  const activeVisitors = Array.from(latestByPass.values())
    .filter((entry) => entry.type === "CHECK_IN")
    .map((entry) => {
      const meta = getPassMeta(entry.passId) || {};
      return {
        id: entry.passId,
        name: meta.name || "Unknown Visitor",
        location: meta.location || "Main Premises",
        duration: calculateDuration(entry.timestamp),
        badge: entry.passId ? `#${entry.passId}` : "N/A",
        status: "approved",
      };
    });

  const scansToday = entries.filter((entry) =>
    entry.timestamp?.startsWith(todayKey),
  );

  const accessLogs = entries.slice(0, 20).map((entry) => {
    const meta = getPassMeta(entry.passId) || {};
    const isEntry = entry.type === "CHECK_IN";
    return {
      id: `${entry.passId || "log"}-${entry.timestamp}`,
      timestamp: entry.timestamp
        ? new Date(entry.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A",
      visitorName: meta.name || "Unknown Visitor",
      action: isEntry ? "Entry" : "Exit",
      location: meta.location || "Gate 1",
      status: "Success",
      method: "QR Code",
    };
  });

  const alerts = entries.slice(0, 10).map((entry) => {
    const meta = getPassMeta(entry.passId) || {};
    const isEntry = entry.type === "CHECK_IN";
    return {
      id: `${entry.passId || "alert"}-${entry.timestamp}`,
      type: isEntry ? "info" : "success",
      title: isEntry ? "Visitor Entered" : "Visitor Exited",
      description: `${meta.name || "Unknown Visitor"} has ${isEntry ? "checked in" : "checked out"} at Gate 1`,
      time: entry.timestamp
        ? calculateRelativeTime(entry.timestamp)
        : "Just now",
      severity: "normal",
    };
  });

  return {
    metrics: {
      peopleInside: activeVisitors.length,
      scansToday: scansToday.length,
    },
    activeVisitors,
    accessLogs,
    alerts,
  };
};

// Helper to calculate duration since issue date
const calculateDuration = (issueDate) => {
  if (!issueDate) return "N/A";
  const start = new Date(issueDate);
  const now = new Date();
  const diffMs = now - start;
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHrs > 0) return `${diffHrs} hrs ${diffMins} mins`;
  return `${diffMins} mins`;
};

// Helper for relative time (e.g. "5 mins ago")
const calculateRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHrs = Math.floor(diffMins / 60);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  return date.toLocaleDateString();
};
