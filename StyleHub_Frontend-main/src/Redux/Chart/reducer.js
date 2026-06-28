import { createSlice } from "@reduxjs/toolkit";

const chartSlice = createSlice({
  name: "chart",
  initialState: {
    earnings: {
      loading: false,
      data: null,
      error: null,
    },
    bookings: {
      loading: false,
      data: null,
      error: null,
    },
  },
  reducers: {
    fetchEarningsRequest: (state) => {
      state.earnings.loading = true;
      state.earnings.data = null;
      state.earnings.error = null;
    },
    fetchEarningsSuccess: (state, action) => {
      state.earnings.loading = false;
      state.earnings.data = action.payload;
      state.earnings.error = null;
    },
    fetchEarningsFailure: (state, action) => {
      state.earnings.loading = false;
      state.earnings.data = null;
      state.earnings.error = action.payload;
    },
    fetchBookingsRequest: (state) => {
      state.bookings.loading = true;
      state.bookings.data = null;
      state.bookings.error = null;
    },
    fetchBookingsSuccess: (state, action) => {
      state.bookings.loading = false;
      state.bookings.data = action.payload;
      state.bookings.error = null;
    },
    fetchBookingsFailure: (state, action) => {
      state.bookings.loading = false;
      state.bookings.data = null;
      state.bookings.error = action.payload;
    }
  }
});

export const chartActions = chartSlice.actions;
export const chartReducer = chartSlice.reducer;
export default chartSlice.reducer;