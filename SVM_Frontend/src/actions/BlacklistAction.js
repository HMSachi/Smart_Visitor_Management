import BlacklistService from "../services/BlacklistService";
import {
    GET_ALL_BLACKLIST_REQUEST,
    GET_ALL_BLACKLIST_SUCCESS,
    GET_ALL_BLACKLIST_FAILURE,
    GET_BLACKLIST_BY_ID_REQUEST,
    GET_BLACKLIST_BY_ID_SUCCESS,
    GET_BLACKLIST_BY_ID_FAILURE,
    ADD_BLACKLIST_REQUEST,
    ADD_BLACKLIST_SUCCESS,
    ADD_BLACKLIST_FAILURE,
    UPDATE_BLACKLIST_REQUEST,
    UPDATE_BLACKLIST_SUCCESS,
    UPDATE_BLACKLIST_FAILURE,
    UPDATE_BLACKLIST_STATUS_REQUEST,
    UPDATE_BLACKLIST_STATUS_SUCCESS,
    UPDATE_BLACKLIST_STATUS_FAILURE
} from "../constants/BlacklistConstants";

export const GetAllBlacklist = (status = "") => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_BLACKLIST_REQUEST });
        try {
            if (status === "") {
                const [approvedRes, pendingRes] = await Promise.all([
                    BlacklistService.GetAllBlacklist("Approved"),
                    BlacklistService.GetAllBlacklist("Pending")
                ]);
                const approvedList = approvedRes.data?.ResultSet || approvedRes.data || [];
                const pendingList = pendingRes.data?.ResultSet || pendingRes.data || [];
                
                // Combine and deduplicate by VB_id
                const combined = [...approvedList, ...pendingList];
                const seen = new Set();
                const deduplicated = [];
                for (const item of combined) {
                    if (item && item.VB_id && !seen.has(item.VB_id)) {
                        seen.add(item.VB_id);
                        deduplicated.push(item);
                    }
                }
                
                dispatch({ type: GET_ALL_BLACKLIST_SUCCESS, payload: deduplicated });
            } else {
                const response = await BlacklistService.GetAllBlacklist(status);
                const payloadData = response.data?.ResultSet || response.data || [];
                dispatch({ type: GET_ALL_BLACKLIST_SUCCESS, payload: payloadData });
            }
        } catch (error) {
            dispatch({ type: GET_ALL_BLACKLIST_FAILURE, payload: error.message });
        }
    };
};

export const GetBlacklistById = (id) => {
    return async (dispatch) => {
        dispatch({ type: GET_BLACKLIST_BY_ID_REQUEST });
        try {
            const response = await BlacklistService.GetBlacklistById(id);
            const payloadData = response.data?.ResultSet || response.data || [];
            dispatch({ type: GET_BLACKLIST_BY_ID_SUCCESS, payload: payloadData });
        } catch (error) {
            dispatch({ type: GET_BLACKLIST_BY_ID_FAILURE, payload: error.message });
        }
    };
};

export const AddBlacklist = (blacklistData) => {
    return async (dispatch) => {
        dispatch({ type: ADD_BLACKLIST_REQUEST });
        try {
            let adminName = "Admin";
            let adminEmail = "admin@example.com";
            let pUid = "Admin";
            try {
                const session = JSON.parse(localStorage.getItem('user_session') || '{}');
                const adminUser = session.ResultSet;
                if (adminUser) {
                    adminName = adminUser.VA_Name || adminUser.P_Name || adminName;
                    adminEmail = adminUser.VA_Email || adminUser.P_Email || adminEmail;
                    pUid = adminUser.P_UID || adminUser.VA_Admin_id || pUid;
                }
            } catch(e) {}

            const reportData = {
                VB_Visitor_id: blacklistData.VB_Visitor_id,
                VVG_id: blacklistData.VVG_id || "", 
                VB_Reporter_Name: adminName,
                VB_Reporter_Role: "Admin",
                VB_Reporter_Email: adminEmail,
                VB_Description: blacklistData.VB_Description,
                VB_Alert_Type: blacklistData.VB_Alert_Type || "Security",
                VB_Reported_By: adminName,
                P_UID: String(pUid)
            };

            const response = await BlacklistService.AddBlacklistReport(reportData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: ADD_BLACKLIST_SUCCESS, payload: response.data });
                dispatch(GetAllBlacklist());
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to add to blacklist");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: ADD_BLACKLIST_SUCCESS });
                dispatch(GetAllBlacklist());
                return { Status: "Success" };
            } else {
                dispatch({ type: ADD_BLACKLIST_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const UpdateBlacklist = (blacklistData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_BLACKLIST_REQUEST });
        try {
            let adminName = "Admin";
            let adminEmail = "admin@example.com";
            let pUid = "Admin";
            try {
                const session = JSON.parse(localStorage.getItem('user_session') || '{}');
                const adminUser = session.ResultSet;
                if (adminUser) {
                    adminName = adminUser.VA_Name || adminUser.P_Name || adminName;
                    adminEmail = adminUser.VA_Email || adminUser.P_Email || adminEmail;
                    pUid = adminUser.P_UID || adminUser.VA_Admin_id || pUid;
                }
            } catch(e) {}

            const reportData = {
                VB_id: blacklistData.VB_id,
                VB_Description: blacklistData.VB_Description,
                VB_Alert_Type: blacklistData.VB_Alert_Type || "Security",
                VB_Reporter_Name: adminName,
                VB_Reporter_Role: "Admin",
                VB_Reporter_Email: adminEmail,
                P_UID: String(pUid)
            };

            const response = await BlacklistService.UpdateBlacklistReport(reportData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_BLACKLIST_SUCCESS, payload: response.data });
                dispatch(GetAllBlacklist());
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to update blacklist");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_BLACKLIST_SUCCESS });
                dispatch(GetAllBlacklist());
                return { Status: "Success" };
            } else {
                dispatch({ type: UPDATE_BLACKLIST_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const UpdateBlacklistStatus = (id, status) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_BLACKLIST_STATUS_REQUEST });
        try {
            const response = await BlacklistService.UpdateBlacklistStatus(id, status);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to update blacklist status");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_SUCCESS });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const AddBlacklistReport = (blacklistData) => {
    return async (dispatch) => {
        dispatch({ type: ADD_BLACKLIST_REQUEST });
        try {
            const response = await BlacklistService.AddBlacklistReport(blacklistData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: ADD_BLACKLIST_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to add blacklist report");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: ADD_BLACKLIST_SUCCESS });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: ADD_BLACKLIST_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const UpdateBlacklistReport = (blacklistData) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_BLACKLIST_REQUEST });
        try {
            const response = await BlacklistService.UpdateBlacklistReport(blacklistData);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_BLACKLIST_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to update blacklist report");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_BLACKLIST_SUCCESS });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: UPDATE_BLACKLIST_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const ApproveBlacklist = (id, adminId, pUid) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_BLACKLIST_STATUS_REQUEST });
        try {
            const response = await BlacklistService.ApproveBlacklist(id, adminId, pUid);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to approve blacklist");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_SUCCESS });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};

export const RejectBlacklist = (id, adminId, rejectReason, pUid) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_BLACKLIST_STATUS_REQUEST });
        try {
            const response = await BlacklistService.RejectBlacklist(id, adminId, rejectReason, pUid);
            const isSuccess = response.data && (
                response.data.ResultSet ||
                response.data.Status === "Success" ||
                response.data.Status === "OK" ||
                response.status === 200
            );
            if (isSuccess) {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_SUCCESS, payload: response.data });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return response.data;
            } else {
                throw new Error(response.data?.Message || "Failed to reject blacklist");
            }
        } catch (error) {
            if (error.message === "Network Error") {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_SUCCESS });
                setTimeout(() => dispatch(GetAllBlacklist()), 1500);
                return { Status: "Success" };
            } else {
                dispatch({ type: UPDATE_BLACKLIST_STATUS_FAILURE, payload: error.message });
                throw error;
            }
        }
    };
};
