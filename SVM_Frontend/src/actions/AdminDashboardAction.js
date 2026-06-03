import GatePassService from "../services/GatePassService";
import BlacklistService from "../services/BlacklistService";
import AdministratorService from "../services/AdministratorService";
import ContactPersonService from "../services/ContactPersonService";
import VisitorService from "../services/VisitorService";
import VisitRequestService from "../services/VisitRequestService";
import { setDashboardMetrics, updateActiveVisitors, setDashboardAlerts, setLiveDataAvailable } from "../reducers/adminSlice";

export const FetchAdminDashboardMetrics = () => async (dispatch) => {
    try {
        let allPasses = [];
        let todayVisits = 0;
        let weeklyVisitCounts = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => ({ name: day, visits: 0 }));
        let allTimeVisits = 0;

        try {
            // 1. Fetch Today's Visits (All gate passes filtered by today's date)
            const allPassesRes = await GatePassService.GetAllGatePasses();
            allPasses = allPassesRes.data || [];
            // Ensure allPasses is an array
            if (!Array.isArray(allPasses)) {
                allPasses = allPasses?.ResultSet || [];
            }
            const today = new Date().toISOString().split('T')[0];
            todayVisits = allPasses.filter(pass => {
                const passDate = pass.VGP_Issue_Date || pass.vgp_Issue_Date;
                return passDate && passDate.startsWith(today);
            }).length;

            allPasses.forEach((pass) => {
                const passDate = pass.VGP_Issue_Date || pass.vgp_Issue_Date;
                if (!passDate) return;
                const dayIndex = new Date(passDate).getDay();
                if (Number.isInteger(dayIndex) && weeklyVisitCounts[dayIndex]) {
                    weeklyVisitCounts[dayIndex].visits += 1;
                }
            });

            // 4. Calculate All-Time Visits
            allTimeVisits = Array.isArray(allPasses) ? allPasses.length : 0;
        } catch (e) {
            console.error("Error fetching all gate passes:", e);
        }

        // 2. Fetch Active Visitors (On-Premise)
        let activeVisitorsCount = 0;
        try {
            const activeRes = await GatePassService.GetActiveGatePasses();
            activeVisitorsCount = (activeRes.data || []).length;
        } catch (e) {
            console.error("Error fetching active visitors:", e);
        }

        // 3. Fetch Blacklist Count (Restricted List)
        let blacklistCount = 0;
        try {
            const blacklistRes = await BlacklistService.GetAllBlacklist();
            const blacklistRaw = blacklistRes.data?.ResultSet || blacklistRes.data || [];
            blacklistCount = Array.isArray(blacklistRaw) ? blacklistRaw.length : 0;
        } catch (e) {
            console.error("Error fetching blacklist count:", e);
        }

        // 5. Fetch Administrators (Admins & Security Officers)
        let adminsCount = 0;
        let securityCount = 0;
        let visitorRoleCount = 0;
        try {
            const adminsRes = await AdministratorService.GetAllAdministrator();
            const adminsList = adminsRes.data?.ResultSet || adminsRes.data || [];
            if (Array.isArray(adminsList)) {
                adminsCount = adminsList.filter(a => a.VA_Role === 'Admin').length;
                securityCount = adminsList.filter(a => a.VA_Role === 'Security').length;
                visitorRoleCount = adminsList.filter(a => a.VA_Role === 'Visitor').length;
            }
        } catch (e) {
            console.error("Error fetching administrators list:", e);
        }

        // 6. Fetch Contact Persons
        let contactPersonsCount = 0;
        try {
            const contactsRes = await ContactPersonService.GetAllContactPersons();
            const contactsList = contactsRes.data?.ResultSet || contactsRes.data || [];
            if (Array.isArray(contactsList)) {
                contactPersonsCount = contactsList.length;
            }
        } catch (e) {
            console.error("Error fetching contact persons list:", e);
        }

        // 7. Fetch Visitors (Total registered visitors)
        let visitorsCount = 0;
        try {
            const visitorsRes = await VisitorService.GetAllVisitors();
            const visitorsList = visitorsRes.data?.ResultSet || visitorsRes.data || [];
            if (Array.isArray(visitorsList)) {
                visitorsCount = visitorsList.length;
            }
        } catch (e) {
            console.error("Error fetching visitors list:", e);
        }

        // 8. Fetch Visit Requests (Approve / Reject counts)
        let approvedRequestsCount = 0;
        let pendingRequestsCount = 0;
        let rejectedRequestsCount = 0;
        try {
            const requestsRes = await VisitRequestService.GetAllVisitRequests();
            const requestsList = requestsRes.data?.ResultSet || requestsRes.data || [];
            if (Array.isArray(requestsList)) {
                requestsList.forEach(req => {
                    const status = (req.VVR_Status || "").toString().trim().toUpperCase();
                    if (status === "A" || status === "APPROVED" || status === "ADMIN APPROVED" || status === "ADMIN_APPROVED") {
                        approvedRequestsCount++;
                    } else if (status === "R" || status === "REJECTED") {
                        rejectedRequestsCount++;
                    } else {
                        pendingRequestsCount++;
                    }
                });
            }
        } catch (e) {
            console.error("Error fetching visit requests list:", e);
        }

        dispatch(updateActiveVisitors(activeVisitorsCount));

        dispatch(setDashboardMetrics({
            todayVisits,
            activeVisitors: activeVisitorsCount,
            blacklistCount,
            totalVisits: allTimeVisits,
            history: weeklyVisitCounts,
            lastSyncedAt: new Date().toISOString(),
            counts: {
                admins: adminsCount,
                security: securityCount,
                contactPersons: contactPersonsCount,
                visitors: visitorsCount || visitorRoleCount,
                approvedRequests: approvedRequestsCount,
                pendingRequests: pendingRequestsCount,
                rejectedRequests: rejectedRequestsCount,
                restrictedCount: blacklistCount,
            }
        }));

        // 4. Map Recent Activity to Alerts
        const mappedAlerts = allPasses.slice(0, 5).map(pass => ({
            id: pass.VGP_Pass_id,
            type: pass.VGP_Status?.toLowerCase() === 'in' ? 'info' : 'warning',
            message: `${pass.Visitor_Name || pass.VV_Name || "Visitor"} has ${pass.VGP_Status?.toLowerCase() === 'in' ? 'entered' : 'exited'} the premises.`,
            time: pass.VGP_Issue_Date ? calculateRelativeTime(pass.VGP_Issue_Date) : "Just now"
        }));
        dispatch(setDashboardAlerts(mappedAlerts));

        dispatch(setLiveDataAvailable(true));
        return { success: true };
    } catch (error) {
        console.error("Error fetching admin dashboard metrics:", error);
        dispatch(setLiveDataAvailable(false));
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
