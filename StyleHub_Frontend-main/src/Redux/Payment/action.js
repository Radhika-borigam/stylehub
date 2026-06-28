import api from "../../config/api";
import { paymentActions } from "./reducer";

export const paymentScuccess =
  ({ paymentId, paymentLinkId, jwt }) =>
  async (dispatch) => {
    dispatch(paymentActions.requestStart());
    try {
      const response = await api.patch("/api/payments/proceed", null, {
        headers: { Authorization: `Bearer ${jwt}` },
        params: { paymentId, paymentLinkId },
      });
      dispatch(paymentActions.proceedPaymentSuccess(response.data));
      console.log("Payment", response.data);
    } catch (error) {
      console.log("Payment failed", error);
      dispatch(
        paymentActions.proceedPaymentFailure(
          error.response ? error.response.data : error.message
        )
      );
    }
  };

export const paymentFailed =
  ({ orderId, jwt }) =>
  async (dispatch) => {
    dispatch(paymentActions.requestStart());
    try {
      const response = await api.patch(`/api/payments/${orderId}/fail`, null, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      dispatch(paymentActions.proceedPaymentFailure("Payment failed or cancelled"));
      console.log("Payment marked as failed", response.data);
    } catch (error) {
      console.log("Failed to mark payment as failed", error);
      dispatch(
        paymentActions.proceedPaymentFailure(
          error.response ? error.response.data : error.message
        )
      );
    }
  };
