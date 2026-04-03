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
import contactPersonService from "../services/ContactPersonService";

export const GetAllContactPersons = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ALL_CONTACT_PERSONS_REQUEST });
        try {
            const response = await contactPersonService.GetAllContactPersons();
            const payload = response.data?.ResultSet || [];
            dispatch({ type: GET_ALL_CONTACT_PERSONS_SUCCESS, payload });
        } catch (error) {
            dispatch({ type: GET_ALL_CONTACT_PERSONS_FAILURE, payload: error.message });
        }
    };
};

export const GetActiveContactPersons = () => {
    return async (dispatch) => {
        dispatch({ type: GET_ACTIVE_CONTACT_PERSONS_REQUEST });
        try {
            const response = await contactPersonService.GetActiveContactPersons();
            const payload = response.data?.ResultSet || [];
            dispatch({ type: GET_ACTIVE_CONTACT_PERSONS_SUCCESS, payload });
        } catch (error) {
            dispatch({ type: GET_ACTIVE_CONTACT_PERSONS_FAILURE, payload: error.message });
        }
    };
};

export const AddContactPerson = (name, department, email, phone) => {
    return async (dispatch) => {
        dispatch({ type: ADD_CONTACT_PERSON_REQUEST });
        try {
            await contactPersonService.AddContactPerson(name, department, email, phone);
            dispatch({ type: ADD_CONTACT_PERSON_SUCCESS });
        } catch (error) {
            dispatch({ type: ADD_CONTACT_PERSON_FAILURE, payload: error.message });
        }
    };
};

export const UpdateContactPerson = (id, name, department, email, phone) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_CONTACT_PERSON_REQUEST });
        try {
            await contactPersonService.UpdateContactPerson(id, name, department, email, phone);
            dispatch({ type: UPDATE_CONTACT_PERSON_SUCCESS });
        } catch (error) {
            dispatch({ type: UPDATE_CONTACT_PERSON_FAILURE, payload: error.message });
        }
    };
};

export const UpdateContactPersonStatus = (id, status) => {
    return async (dispatch) => {
        dispatch({ type: UPDATE_STATUS_REQUEST });
        try {
            await contactPersonService.UpdateContactPersonStatus(id, status);
            dispatch({ type: UPDATE_STATUS_SUCCESS });
        } catch (error) {
            dispatch({ type: UPDATE_STATUS_FAILURE, payload: error.message });
        }
    };
};

export const SearchContactPersons = (name) => {
    return async (dispatch) => {
        dispatch({ type: SEARCH_CONTACT_PERSONS_REQUEST });
        try {
            const response = await contactPersonService.SearchContactPersons(name);
            const payload = response.data?.ResultSet || [];
            dispatch({ type: SEARCH_CONTACT_PERSONS_SUCCESS, payload });
        } catch (error) {
            dispatch({ type: SEARCH_CONTACT_PERSONS_FAILURE, payload: error.message });
        }
    };
};

export const GetContactPersonById = (id) => {
    return async (dispatch) => {
        dispatch({ type: GET_CONTACT_PERSON_BY_ID_REQUEST });
        try {
            const response = await contactPersonService.GetContactPersonById(id);
            const payload = response.data?.ResultSet?.[0] || null;
            dispatch({ type: GET_CONTACT_PERSON_BY_ID_SUCCESS, payload });
        } catch (error) {
            dispatch({ type: GET_CONTACT_PERSON_BY_ID_FAILURE, payload: error.message });
        }
    };
};
