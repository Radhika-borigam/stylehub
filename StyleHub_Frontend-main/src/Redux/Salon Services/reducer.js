import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    services: [],
    service: null,
    loading: false,
    error: null,
  },
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createServiceSuccess: (state, action) => {
      state.loading = false;
      state.service = action.payload;
    },
    updateServiceSuccess: (state, action) => {
      state.loading = false;
      state.service = action.payload;
      state.services = state.services.map((service) =>
        service.id === action.payload.id ? action.payload : service
      );
    },
    fetchServicesSuccess: (state, action) => {
      state.loading = false;
      state.services = action.payload;
    },
    fetchServiceByIdSuccess: (state, action) => {
      state.loading = false;
      state.service = action.payload;
    },
    requestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const serviceActions = serviceSlice.actions;
export default serviceSlice.reducer;