import axios from "axios";
import api, { API_BASE_URL as AUTH_API_BASE_URL } from "../../config/api";
import { salonActions } from "./reducer";

const API_BASE_URL = "/api/salons";

export const createSalon = (reqData) => async (dispatch) => {
  dispatch(salonActions.requestStart());
  try {
    const response = await axios.post(`${AUTH_API_BASE_URL}/auth/signup`, reqData.ownerDetails);
    console.log("response ", response.data);
    localStorage.setItem("jwt", response.data.data.jwt);

    const { data } = await api.post(API_BASE_URL, reqData.salonDetails, {
      headers: { Authorization: `Bearer ${response.data.data.jwt}` },
    });

    reqData.navigate("/salon-dashboard");
    console.log("salon created successfully", data);
    dispatch(salonActions.createSalonSuccess(data));
  } catch (error) {
    console.log("error creating salon", error);
    dispatch(salonActions.requestFailure(error.message));
  }
};

export const updateSalon = (salonId, salon) => async (dispatch) => {
  dispatch(salonActions.requestStart());
  try {
    const { data } = await api.put(`${API_BASE_URL}/${salonId}`, salon, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      }
    });
    dispatch(salonActions.updateSalonSuccess(data));
  } catch (error) {
    dispatch(salonActions.requestFailure(error.message));
  }
};

export const fetchSalons = () => async (dispatch) => {
  dispatch(salonActions.requestStart());
  try {
    const { data } = await api.get(API_BASE_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      }
    });
    console.log("all salons ", data);
    dispatch(salonActions.fetchSalonsSuccess(data));
  } catch (error) {
    console.log("error fetching salons", error);
    dispatch(salonActions.requestFailure(error.message));
  }
};

export const fetchSalonById = (salonId) => async (dispatch) => {
  dispatch(salonActions.requestStart());
  try {
    const { data } = await api.get(`${API_BASE_URL}/${salonId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      }
    });
    dispatch(salonActions.fetchSalonByOwnerOrIdSuccess(data));
  } catch (error) {
    dispatch(salonActions.requestFailure(error.message));
  }
};

export const fetchSalonByOwner = (jwt) => async (dispatch) => {
  dispatch(salonActions.requestStart());
  try {
    const { data } = await api.get(`${API_BASE_URL}/owner`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("salon by owner - ", data);
    dispatch(salonActions.fetchSalonByOwnerOrIdSuccess(data));
  } catch (error) {
    console.log("error fetching salon by owner - ", error);
    dispatch(salonActions.requestFailure(error.message));
  }
};

export const searchSalon = ({jwt, city}) => async (dispatch) => {
  dispatch(salonActions.requestStart());
  try {
    const { data } = await api.get(`${API_BASE_URL}/search`, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { city: city },
    });
    console.log("Search salon - ", data);
    dispatch(salonActions.searchSalonsSuccess(data));
  } catch (error) {
    console.log("error fetching salon by owner - ", error);
    dispatch(salonActions.requestFailure(error.message));
  }
};
