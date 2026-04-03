import {
    GET_ALL_CONTACT_PERSONS_REQUEST,
    GET_ALL_CONTACT_PERSONS_SUCCESS,
    GET_ALL_CONTACT_PERSONS_FAILURE,
    GET_ACTIVE_CONTACT_PERSONS_REQUEST,
    GET_ACTIVE_CONTACT_PERSONS_SUCCESS,
    GET_ACTIVE_CONTACT_PERSONS_FAILURE,
    ADD_CONTACT_PERSON_REQUEST,
    ADD_CONTACT_PERSON_SUCCESS,
    ADD_CONTACT_PERSON_FAILURE,
    UPDATE_CONTACT_PERSON_REQUEST,
    UPDATE_CONTACT_PERSON_SUCCESS,
    UPDATE_CONTACT_PERSON_FAILURE,
    UPDATE_STATUS_REQUEST,
    UPDATE_STATUS_SUCCESS,
    UPDATE_STATUS_FAILURE,
    SEARCH_CONTACT_PERSONS_REQUEST,
    SEARCH_CONTACT_PERSONS_SUCCESS,
    SEARCH_CONTACT_PERSONS_FAILURE,
    GET_CONTACT_PERSON_BY_ID_REQUEST,
    GET_CONTACT_PERSON_BY_ID_SUCCESS,
    GET_CONTACT_PERSON_BY_ID_FAILURE
} from "../constants/ContactPersonConstants";

const initialState = {
    loading: false,
    contactPersons: [],
    contactPerson: null,
    error: null,
    success: false,
};

const ContactPersonReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_CONTACT_PERSONS_REQUEST:
        case GET_ACTIVE_CONTACT_PERSONS_REQUEST:
        case ADD_CONTACT_PERSON_REQUEST:
        case UPDATE_CONTACT_PERSON_REQUEST:
        case UPDATE_STATUS_REQUEST:
        case SEARCH_CONTACT_PERSONS_REQUEST:
        case GET_CONTACT_PERSON_BY_ID_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                success: false
            };

        case GET_ALL_CONTACT_PERSONS_SUCCESS:
        case GET_ACTIVE_CONTACT_PERSONS_SUCCESS:
        case SEARCH_CONTACT_PERSONS_SUCCESS:
            return {
                ...state,
                loading: false,
                contactPersons: action.payload,
            };

        case GET_CONTACT_PERSON_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                contactPerson: action.payload
            };

        case ADD_CONTACT_PERSON_SUCCESS:
        case UPDATE_CONTACT_PERSON_SUCCESS:
        case UPDATE_STATUS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true
            };

        case GET_ALL_CONTACT_PERSONS_FAILURE:
        case GET_ACTIVE_CONTACT_PERSONS_FAILURE:
        case ADD_CONTACT_PERSON_FAILURE:
        case UPDATE_CONTACT_PERSON_FAILURE:
        case UPDATE_STATUS_FAILURE:
        case SEARCH_CONTACT_PERSONS_FAILURE:
        case GET_CONTACT_PERSON_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                success: false
            };

        default:
            return state;
    }
};

export default ContactPersonReducer;
