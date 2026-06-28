import { createSlice } from "@reduxjs/toolkit";

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    requestStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchReviewsSuccess: (state, action) => {
      state.loading = false;
      state.reviews = action.payload;
    },
    createReviewSuccess: (state, action) => {
      state.loading = false;
      state.reviews.push(action.payload);
    },
    updateReviewSuccess: (state, action) => {
      state.loading = false;
      state.reviews = state.reviews.map((review) =>
        review.id === action.payload.id ? action.payload : review
      );
    },
    deleteReviewSuccess: (state, action) => {
      state.loading = false;
      state.reviews = state.reviews.filter((review) => review.id !== action.payload);
    },
    requestFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  }
});

export const reviewActions = reviewSlice.actions;
export default reviewSlice.reducer;