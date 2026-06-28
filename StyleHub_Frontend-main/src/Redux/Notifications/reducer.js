import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    loading: false,
    error: null,
    unreadCount: 0,
  },
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess: (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
    },
    fetchNotificationsByUserOrSalonSuccess: (state, action) => {
      state.loading = false;
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.read && !n.isRead).length;
    },
    addNotification: (state, action) => {
      const exists = state.notifications.some((n) => n.id === action.payload.id);
      if (!exists) {
        state.notifications = [action.payload, ...state.notifications];
        state.unreadCount += 1;
      }
    },
    createNotificationSuccess: (state, action) => {
      state.loading = false;
      state.notifications.push(action.payload);
    },
    markNotificationAsReadSuccess: (state, action) => {
      state.loading = false;
      state.notifications = state.notifications.map((notification) =>
        notification.id === action.payload.id ? action.payload : notification
      );
      state.unreadCount = Math.max(0, state.unreadCount - 1);
    },
    deleteNotificationSuccess: (state, action) => {
      state.loading = false;
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    requestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const notificationActions = notificationSlice.actions;
export default notificationSlice.reducer;