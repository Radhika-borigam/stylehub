import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    error: null,
    customers: [],
    jwt: localStorage.getItem("jwt") || null,
  },
  reducers: {
    requestStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.jwt = action.payload?.data?.jwt || action.payload?.jwt;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.jwt = action.payload?.data?.jwt || action.payload?.jwt;
    },
    getUserSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
    },
    getAllCustomersSuccess: (state, action) => {
      state.isLoading = false;
      state.customers = action.payload;
    },
    requestFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.jwt = null;
      state.user = null;
      state.customers = [];
    }
  }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
