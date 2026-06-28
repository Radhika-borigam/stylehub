import api from "../../config/api";
import { serviceActions } from "./reducer";

const API_BASE_URL = "/api/service-offering";

export const createServiceAction = ({ service, jwt }) => async (dispatch) => {
  dispatch(serviceActions.requestStart());
  try {
    const { data } = await api.post(`${API_BASE_URL}/salon-owner`, service, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("service created", data);
    dispatch(serviceActions.createServiceSuccess(data));
  } catch (error) {
    console.log("error creating service", error);
    dispatch(serviceActions.requestFailure(error.message));
  }
};

export const updateService = ({id, service}) => async (dispatch) => {
  dispatch(serviceActions.requestStart());
  try {
    const { data } = await api.patch(`${API_BASE_URL}/salon-owner/${id}`, service, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    dispatch(serviceActions.updateServiceSuccess(data));
    console.log("service updated", data);
  } catch (error) {
    console.log("error updating service", error);
    dispatch(serviceActions.requestFailure(error.message || error));
  }
};

export const fetchServicesBySalonId = ({ salonId, jwt, categoryId }) => async (dispatch) => {
  dispatch(serviceActions.requestStart());
  try {
    const { data } = await api.get(`${API_BASE_URL}/salon/${salonId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { categoryId },
    });
    console.log("all services ", data);
    dispatch(serviceActions.fetchServicesSuccess(data));
  } catch (error) {
    console.log("fetch all services ", error);
    dispatch(serviceActions.requestFailure(error.message));
  }
};

export const fetchServiceById = (serviceId) => async (dispatch) => {
  dispatch(serviceActions.requestStart());
  try {
    const { data } = await api.get(`${API_BASE_URL}/${serviceId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("jwt")}` },
    });
    dispatch(serviceActions.fetchServiceByIdSuccess(data));
    console.log("service by id ", data);
  } catch (error) {
    dispatch(serviceActions.requestFailure(error.message || error));
  }
};
