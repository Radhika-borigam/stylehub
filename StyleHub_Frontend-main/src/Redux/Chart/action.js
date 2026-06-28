import api from "../../config/api";
import { chartActions } from "./reducer";

const API_BASE_URL = "/api/bookings/chart";

export const fetchEarnings = (token) => async (dispatch) => {
  dispatch(chartActions.fetchEarningsRequest());
  try {
    const response = await api.get(`${API_BASE_URL}/earnings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("earning chart response: ", response.data);
    dispatch(chartActions.fetchEarningsSuccess(response.data));
  } catch (error) {
    console.log("error fetching earnings chart response: ", error);
    dispatch(chartActions.fetchEarningsFailure(error.response?.data || error.message));
  }
};

export const fetchBookings = (token) => async (dispatch) => {
  dispatch(chartActions.fetchBookingsRequest());
  try {
    const response = await api.get(`${API_BASE_URL}/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    dispatch(chartActions.fetchBookingsSuccess(response.data));
  } catch (error) {
    dispatch(chartActions.fetchBookingsFailure(error.response?.data || error.message));
  }
};
