import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
    slots: [],
    booking: null,
    loading: false,
    error: null,
    report: null,
  },
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createBookingSuccess: (state, action) => {
      state.loading = false;
      state.booking = action.payload;
    },
    fetchBookingsSuccess: (state, action) => {
      state.loading = false;
      state.bookings = action.payload;
    },
    fetchBookingByIdSuccess: (state, action) => {
      state.loading = false;
      state.booking = action.payload;
    },
    updateBookingStatusSuccess: (state, action) => {
      state.loading = false;
      state.bookings = state.bookings.map((item) =>
        item.id === action.payload.id ? action.payload : item
      );
    },
    getSalonReportSuccess: (state, action) => {
      state.loading = false;
      state.report = action.payload;
    },
    fetchBookedSlotsSuccess: (state, action) => {
      state.loading = false;
      state.slots = action.payload;
    },
    requestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const bookingActions = bookingSlice.actions;
export default bookingSlice.reducer;
