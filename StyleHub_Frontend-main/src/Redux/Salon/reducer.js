import { createSlice } from "@reduxjs/toolkit";

const salonSlice = createSlice({
  name: "salon",
  initialState: {
    salons: [],
    salon: null,
    searchSalons: [],
    loading: false,
    error: null,
  },
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createSalonSuccess: (state, action) => {
      state.loading = false;
      state.salon = action.payload;
    },
    updateSalonSuccess: (state, action) => {
      state.loading = false;
      state.salon = action.payload;
    },
    searchSalonsSuccess: (state, action) => {
      state.loading = false;
      state.searchSalons = action.payload;
    },
    fetchSalonsSuccess: (state, action) => {
      state.loading = false;
      state.salons = action.payload;
    },
    fetchSalonByOwnerOrIdSuccess: (state, action) => {
      state.loading = false;
      state.salon = action.payload;
    },
    requestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const salonActions = salonSlice.actions;
export default salonSlice.reducer;
