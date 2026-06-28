import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Auth/reducer";
import serviceOfferingReducer from "./Salon Services/reducer";
import salonReducer from "./Salon/reducer";
import bookingReducer from "./Booking/reducer";
import categoryReducer from "./Category/reducer";
import reviewReducer from "./Review/reducer";
import notificationReducer from "./Notifications/reducer";
import chartReducer from "./Chart/reducer";
import paymentReducer from "./Payment/reducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    service: serviceOfferingReducer,
    salon: salonReducer,
    booking: bookingReducer,
    category: categoryReducer,
    review: reviewReducer,
    notification: notificationReducer,
    chart: chartReducer,
    payment: paymentReducer,
  },
  // DevTools is automatically enabled in configureStore
});