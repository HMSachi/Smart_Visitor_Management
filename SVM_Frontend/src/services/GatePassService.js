import axios from 'axios';

const GetAllGatePasses = async () => {
    let config = {
        method: 'get',
        url: 'https://visitormanagement.dockyardsoftware.com/GatePass/GetAllGatePasses'
    };
    return axios.request(config).then((response) => response);
};

const AddGatePass = async (visitorId, requestId) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/GatePass/AddGatePass?VGP_Visitor_id=${encodeURIComponent(visitorId)}&VGP_Request_id=${encodeURIComponent(requestId)}`,
        data: ''
    };
    return axios.request(config).then((response) => response);
};

const UpdateGatePass = async (passId, status, issueDate) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/GatePass/UpdateGatePass?VGP_Pass_id=${encodeURIComponent(passId)}&VGP_Status=${encodeURIComponent(status)}&VGP_Issue_Date=${encodeURIComponent(issueDate)}`,
        data: ''
    };
    return axios.request(config).then((response) => response);
};

const GetGatePassById = async (id) => {
    let config = {
        method: 'get',
        url: `https://visitormanagement.dockyardsoftware.com/GatePass/GetGatePassById?VGP_Pass_id=${encodeURIComponent(id)}`
    };
    return axios.request(config).then((response) => response);
};

const UpdateGatePassStatus = async (passId, status) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/GatePass/UpdateGatePassStatus?VGP_Pass_id=${encodeURIComponent(passId)}&VGP_Status=${encodeURIComponent(status)}`,
        data: ''
    };
    return axios.request(config).then((response) => response);
};

const GetActiveGatePasses = async () => {
    let config = {
        method: 'get',
        url: 'https://visitormanagement.dockyardsoftware.com/GatePass/GetActiveGatePasses'
    };
    return axios.request(config).then((response) => response);
};

export default {
    GetAllGatePasses,
    AddGatePass,
    UpdateGatePass,
    GetGatePassById,
    UpdateGatePassStatus,
    GetActiveGatePasses
};
