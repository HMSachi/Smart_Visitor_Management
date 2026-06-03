import {
  updateMetric,
  setActiveVisitors,
  setAccessLogs,
  setAlerts,
} from "../reducers/securitySlice";

export const FetchSecurityDashboardData = () => async (dispatch) => {
  try {
    const localDashboard = loadLocalSecurityDashboard();
    dispatch(setActiveVisitors(localDashboard.activeVisitors));
    dispatch(setAlerts(localDashboard.alerts));
    dispatch(setAccessLogs(localDashboard.accessLogs));

    dispatch(
      updateMetric({
        label: "People Inside",
        value: localDashboard.metrics.peopleInside.toString(),
      }),
    );
    dispatch(
      updateMetric({
        label: "Scans Today",
        value: localDashboard.metrics.scansToday.toString(),
      }),
    );

    return { success: true };
  } catch (error) {
    console.error("Error fetching security dashboard data:", error);
    return { success: false, error };
  }
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
