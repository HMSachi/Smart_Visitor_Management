import GatePassService from "../services/GatePassService";
import BlacklistService from "../services/BlacklistService";
import { setDashboardMetrics, updateActiveVisitors, setDashboardAlerts } from "../reducers/adminSlice";

export const FetchAdminDashboardMetrics = () => async (dispatch) => {
    try {
        // 1. Fetch Today's Visits (All gate passes filtered by today's date)
        const allPassesRes = await GatePassService.GetAllGatePasses();
        const allPasses = allPassesRes.data || [];
        const today = new Date().toISOString().split('T')[0];
        const todayVisits = allPasses.filter(pass => {
            const passDate = pass.VGP_Issue_Date || pass.vgp_Issue_Date;
            return passDate && passDate.startsWith(today);
        }).length;

        // 2. Fetch Active Visitors (On-Premise)
        const activeRes = await GatePassService.GetActiveGatePasses();
        const activeVisitorsCount = (activeRes.data || []).length;

        // 3. Fetch Blacklist Count (Restricted List)
        const blacklistRes = await BlacklistService.GetAllBlacklist();
        const blacklistCount = (blacklistRes.data?.ResultSet || blacklistRes.data || []).length;

        dispatch(updateActiveVisitors(activeVisitorsCount));

        dispatch(setDashboardMetrics({
            todayVisits,
            activeVisitors: activeVisitorsCount,
            blacklistCount
        }));

        // 4. Map Recent Activity to Alerts
        const mappedAlerts = allPasses.slice(0, 5).map(pass => ({
            id: pass.VGP_Pass_id,
            type: pass.VGP_Status?.toLowerCase() === 'in' ? 'info' : 'warning',
            message: `${pass.Visitor_Name || pass.VV_Name || "Visitor"} has ${pass.VGP_Status?.toLowerCase() === 'in' ? 'entered' : 'exited'} the premises.`,
            time: pass.VGP_Issue_Date ? calculateRelativeTime(pass.VGP_Issue_Date) : "Just now"
        }));
        dispatch(setDashboardAlerts(mappedAlerts));

        return { success: true };
    } catch (error) {
        console.error("Error fetching admin dashboard metrics:", error);
        return { success: false, error: error.message };
    }
};

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
