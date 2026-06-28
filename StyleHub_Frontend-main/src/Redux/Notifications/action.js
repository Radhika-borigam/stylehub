import api from "../../config/api";
import { notificationActions } from "./reducer";

const API_URL = "/api/notifications";

export const fetchNotifications = () => async (dispatch) => {
  dispatch(notificationActions.requestStart());
  try {
    const response = await api.get(`${API_URL}`);
    dispatch(notificationActions.fetchNotificationsSuccess(response.data));
  } catch (error) {
    dispatch(notificationActions.requestFailure(error.message));
  }
};

export const fetchNotificationsByUser = ({userId, jwt}) => async (dispatch) => {
  dispatch(notificationActions.requestStart());
  try {
    const response = await api.get(`${API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("fetch notifications", response.data);
    dispatch(notificationActions.fetchNotificationsByUserOrSalonSuccess(response.data));
  } catch (error) {
    console.log("error fetching notifications", error);
    dispatch(notificationActions.requestFailure(error.message));
  }
};

export const fetchNotificationsBySalon = ({salonId, jwt}) => async (dispatch) => {
  dispatch(notificationActions.requestStart());
  try {
    const response = await api.get(`${API_URL}/salon-owner/salon/${salonId}`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("fetch salon notifications", response.data);
    dispatch(notificationActions.fetchNotificationsByUserOrSalonSuccess(response.data));
  } catch (error) {
    dispatch(notificationActions.requestFailure(error.message));
  }
};

export const markNotificationAsRead = ({notificationId, jwt}) => async (dispatch) => {
  dispatch(notificationActions.requestStart());
  try {
    const response = await api.put(`${API_URL}/${notificationId}/read`, {}, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    console.log("mark notification as read", response.data);
    dispatch(notificationActions.markNotificationAsReadSuccess(response.data));
  } catch (error) {
    console.log("mark notification as read error - ", error);
    dispatch(notificationActions.requestFailure(error.message));
  }
};

export const deleteNotification = (notificationId) => async (dispatch) => {
  dispatch(notificationActions.requestStart());
  try {
    await api.delete(`${API_URL}/${notificationId}`);
    dispatch(notificationActions.deleteNotificationSuccess(notificationId));
  } catch (error) {
    dispatch(notificationActions.requestFailure(error.message));
  }
};

export const addNotification = (notification) => (dispatch) => {
  dispatch(notificationActions.addNotification(notification));
};
