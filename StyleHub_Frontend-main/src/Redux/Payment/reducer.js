import { createSlice } from "@reduxjs/toolkit";

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    success: null,
    error: null,
  },
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.success = null;
      state.error = null;
    },
    proceedPaymentSuccess: (state, action) => {
      state.loading = false;
      state.success = action.payload;
    },
    proceedPaymentFailure: (state, action) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    }
  }
});

export const paymentActions = paymentSlice.actions;
export default paymentSlice.reducer;