import GatePassService from "../services/GatePassService";
import { updateMetric, setActiveVisitors, setAccessLogs, setAlerts } from "../reducers/securitySlice";

export const FetchSecurityDashboardData = () => async (dispatch) => {
  try {
    // 1. Fetch Active Gate Passes (People Inside)
    const activeResponse = await GatePassService.GetActiveGatePasses();
    const activePasses = activeResponse.data || [];
    
    // Map backend data to frontend structure for ActiveVisitors
    const mappedActiveVisitors = activePasses.map(pass => ({
      id: pass.VGP_Pass_id,
      name: pass.Visitor_Name || pass.VV_Name || "N/A",
      location: pass.VGP_Visiting_Area || "Main Premises",
      duration: calculateDuration(pass.VGP_Issue_Date),
      badge: `#${pass.VGP_Pass_id}`,
      status: pass.VGP_Status?.toLowerCase() === "in" ? "approved" : "pending"
    }));

    dispatch(setActiveVisitors(mappedActiveVisitors));
    dispatch(updateMetric({ label: "People Inside", value: activePasses.length.toString() }));

    // 2. Fetch All Gate Passes to calculate Today's scans and for logs
    const allResponse = await GatePassService.GetAllGatePasses();
    const allPasses = allResponse.data || [];
    
    const today = new Date().toISOString().split('T')[0];
    const todayScans = allPasses.filter(pass => pass.VGP_Issue_Date?.startsWith(today));
    
    dispatch(updateMetric({ label: "Scans Today", value: todayScans.length.toString() }));

    // Map alerts from gate passes (Recent events)
    const mappedAlerts = allPasses.slice(0, 10).map(pass => ({
      id: pass.VGP_Pass_id,
      type: pass.VGP_Status?.toLowerCase() === 'in' ? 'info' : 'success',
      title: pass.VGP_Status?.toLowerCase() === 'in' ? 'Visitor Entered' : 'Visitor Exited',
      description: `${pass.Visitor_Name || pass.VV_Name || "N/A"} has ${pass.VGP_Status?.toLowerCase() === 'in' ? 'checked in' : 'checked out'} at Gate 1`,
      time: pass.VGP_Issue_Date ? calculateRelativeTime(pass.VGP_Issue_Date) : "Just now",
      severity: "normal"
    }));

    dispatch(setAlerts(mappedAlerts));

    // Map logs
    const mappedLogs = allPasses.slice(0, 20).map(pass => ({
      id: pass.VGP_Pass_id,
      timestamp: pass.VGP_Issue_Date ? new Date(pass.VGP_Issue_Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
      visitorName: pass.Visitor_Name || pass.VV_Name || "N/A",
      action: pass.VGP_Status || "Entry",
      location: pass.VGP_Visiting_Area || "Gate 1",
      status: "Success",
      method: "QR Code"
    }));

    dispatch(setAccessLogs(mappedLogs));

    return { success: true };
  } catch (error) {
    console.error("Error fetching security dashboard data:", error);
    return { success: false, error };
  }
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
