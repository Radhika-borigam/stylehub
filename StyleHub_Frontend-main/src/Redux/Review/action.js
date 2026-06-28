import api from "../../config/api";
import { reviewActions } from "./reducer";

export const fetchReviews = ({ salonId, jwt }) => async (dispatch) => {
  dispatch(reviewActions.requestStart());
  try {
    const response = await api.get(`/api/reviews/salon/${salonId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("fetch review: ", response.data);
    dispatch(reviewActions.fetchReviewsSuccess(response.data));
  } catch (error) {
    console.log("error fetching review: ", error);
    dispatch(reviewActions.requestFailure(error.message));
  }
};

export const createReview = ({ salonId, reviewData, jwt }) => async (dispatch) => {
  dispatch(reviewActions.requestStart());
  try {
    const response = await api.post(
      `/api/reviews/salon/${salonId}`,
      reviewData,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    console.log("created review: ", response.data);
    dispatch(reviewActions.createReviewSuccess(response.data));
  } catch (error) {
    console.log("error creating review: ", error);
    dispatch(reviewActions.requestFailure(error.message));
  }
};

export const updateReview = ({reviewId, reviewData, jwt}) => async (dispatch) => {
  dispatch(reviewActions.requestStart());
  try {
    const response = await api.patch(`/api/reviews/${reviewId}`, reviewData, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    dispatch(reviewActions.updateReviewSuccess(response.data));
  } catch (error) {
    dispatch(reviewActions.requestFailure(error.message));
  }
};

export const deleteReview = ({reviewId, jwt}) => async (dispatch) => {
  dispatch(reviewActions.requestStart());
  try {
    await api.delete(`/api/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    console.log("deleted review: ", reviewId);
    dispatch(reviewActions.deleteReviewSuccess(reviewId));
  } catch (error) {
    console.log("error deleting review: ", error);
    dispatch(reviewActions.requestFailure(error.message));
  }
};
