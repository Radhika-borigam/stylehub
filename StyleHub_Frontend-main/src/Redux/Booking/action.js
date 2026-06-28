import api from "../../config/api";
import { bookingActions } from "./reducer";

const API_BASE_URL = "/api/bookings";

export const createBooking = ({jwt, salonId, bookingData}) => async (dispatch) => {
  dispatch(bookingActions.requestStart());
  try {
    const { data } = await api.post(
      API_BASE_URL,
      bookingData,
      {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { salonId, paymentMethod: "RAZORPAY" },
      }
    );
    window.location.href = data.payment_link_url;
    console.log(" create booking ", data);
    dispatch(bookingActions.createBookingSuccess(data));
  } catch (error) {
    console.log("error creating booking ", error);
    dispatch(bookingActions.requestFailure(error.response?.data?.message || error.message));
  }
};

export const fetchCustomerBookings = (jwt) => async (dispatch) => {
  dispatch(bookingActions.requestStart());
  try {
    const { data } = await api.get(`${API_BASE_URL}/customer`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("customer bookings ", data);
    dispatch(bookingActions.fetchBookingsSuccess(data));
  } catch (error) {
    console.log("error ", error);
    dispatch(bookingActions.requestFailure(error.message));
  }
};

export const fetchSalonBookings = ({jwt}) => async (dispatch) => {
  dispatch(bookingActions.requestStart());
  try {
    const { data } = await api.get(`${API_BASE_URL}/salon`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("salon bookings ", data);
    dispatch(bookingActions.fetchBookingsSuccess(data));
  } catch (error) {
    console.log("error fetching salon bookings ", error);
    dispatch(bookingActions.requestFailure(error.message));
  }
};

export const fetchBookingById = (bookingId) => async (dispatch) => {
  dispatch(bookingActions.requestStart());
  try {
    const { data } = await api.get(`${API_BASE_URL}/${bookingId}`);
    dispatch(bookingActions.fetchBookingByIdSuccess(data));
  } catch (error) {
    dispatch(bookingActions.requestFailure(error.message));
  }
};

export const updateBookingStatus = ({bookingId, status, jwt}) => async (dispatch) => {
  dispatch(bookingActions.requestStart());
  try {
    const { data } = await api.put(`${API_BASE_URL}/${bookingId}/status`, null, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { status },
    });
    console.log("update booking status ", data);
    dispatch(bookingActions.updateBookingStatusSuccess(data));
  } catch (error) {
    console.log("error updating booking status ", error);
    dispatch(bookingActions.requestFailure(error.message));
  }
};

export const getSalonReport = (jwt) => async (dispatch) => {
  dispatch(bookingActions.requestStart());
  try {
    const response = await api.get('/api/bookings/report', {
      headers: {
        'Authorization': `Bearer ${jwt}`
      }
    });
    dispatch(bookingActions.getSalonReportSuccess(response.data));
    console.log("bookings report ", response.data);
  } catch (error) {
    console.log("error ", error);
    dispatch(bookingActions.requestFailure(error.response ? error.response.data : error.message));
  }
};

export const fetchBookedSlots = ({salonId, date, jwt}) => async (dispatch) => {
  dispatch(bookingActions.requestStart());
  try {
    const response = await api.get(
      `${API_BASE_URL}/slots/salon/${salonId}/date/${date}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log("fetch booked slots: ", response.data);
    dispatch(bookingActions.fetchBookedSlotsSuccess(response.data));
  } catch (error) {
    console.log("fetch booked slots error - : ", error);
    dispatch(bookingActions.requestFailure(error.message));
  }
};
