import axios from 'axios';

const GetAllVisitors = async () => {
    let config = {
        method: 'get',
        url: 'https://visitormanagement.dockyardsoftware.com/Visitor/GetAllVisitors'
    };
    return axios.request(config).then((response) => response);
}

const AddVisitor = async (visitorData) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/Visitor/AddVisitor?VV_Contact_person_id=${encodeURIComponent(visitorData.VV_Contact_person_id)}&VV_Name=${encodeURIComponent(visitorData.VV_Name)}&VV_NIC_Passport_NO=${encodeURIComponent(visitorData.VV_NIC_Passport_NO)}&VV_Visiting_places=${encodeURIComponent(visitorData.VV_Visiting_places)}&VV_Visitor_Type=${encodeURIComponent(visitorData.VV_Visitor_Type)}&VV_Phone=${encodeURIComponent(visitorData.VV_Phone)}&VV_Email=${encodeURIComponent(visitorData.VV_Email)}&VV_Company=${encodeURIComponent(visitorData.VV_Company)}`,
        data: ''
    };
    return axios.request(config).then((response) => response);
}

const GetVisitorById = async (id) => {
    let config = {
        method: 'get',
        url: `https://visitormanagement.dockyardsoftware.com/Visitor/GetVisitorById?VV_Visitor_id=${encodeURIComponent(id)}`
    };
    return axios.request(config).then((response) => response);
}

const ActivateVisitor = async (id, status) => {
    let config = {
        method: 'post',
        url: `https://visitormanagement.dockyardsoftware.com/Visitor/ActivateVisitor?VV_Status=${encodeURIComponent(status)}&VV_Visitor_id=${encodeURIComponent(id)}`,
        data: ''
    };
    return axios.request(config).then((response) => response);
}

const GetVisitorsByContactPerson = async (cpId) => {
    let config = {
        method: 'get',
        url: `https://visitormanagement.dockyardsoftware.com/Visitor/GetVisitorsByContactPerson?VV_Contact_person_id=${encodeURIComponent(cpId)}`
    };
    return axios.request(config).then((response) => response);
}

export default {
    GetAllVisitors,
    AddVisitor,
    GetVisitorById,
    ActivateVisitor,
    GetVisitorsByContactPerson
};
