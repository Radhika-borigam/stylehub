import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    category: null,
    loading: false,
    error: null,
    updated: false,
  },
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
      state.updated = false;
    },
    createCategorySuccess: (state, action) => {
      state.loading = false;
      state.categories.push(action.payload);
    },
    fetchCategoriesSuccess: (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    },
    fetchCategoryByIdSuccess: (state, action) => {
      state.loading = false;
      state.category = action.payload;
    },
    updateCategorySuccess: (state, action) => {
      state.loading = false;
      state.categories = state.categories.map((item) =>
        action.payload.id === item.id ? action.payload : item
      );
      state.category = action.payload;
      state.updated = true;
    },
    deleteCategorySuccess: (state, action) => {
      state.loading = false;
      state.categories = state.categories.filter((cat) => cat.id !== action.payload);
    },
    requestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.updated = false;
    }
  }
});

export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;
