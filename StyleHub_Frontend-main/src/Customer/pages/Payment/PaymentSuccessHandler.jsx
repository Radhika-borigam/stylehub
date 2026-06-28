import { Backdrop, Button, CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { paymentScuccess, paymentFailed } from "../../../Redux/Payment/action";

const PaymentSuccessHandler = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { id } = useParams();
    const { loading, success } = useSelector(store => store.payment);
    const navigate = useNavigate();

    const getQueryParam = (key) => {
        const params = new URLSearchParams(location.search);
        return params.get(key);
    };
    const paymentId = getQueryParam("razorpay_payment_id");
    const paymentLinkId = getQueryParam("razorpay_payment_link_id");

    useEffect(() => {
        const jwt = localStorage.getItem("jwt") || "";
        if (paymentId) {
            dispatch(
                paymentScuccess({
                    paymentId,
                    paymentLinkId: paymentLinkId || "",
                    jwt,
                })
            );
        } else if (id) {
            dispatch(
                paymentFailed({
                    orderId: id,
                    jwt,
                })
            );
        }
    }, [paymentId, id, dispatch]);

    return (
        <div className="min-h-[90vh] flex justify-center items-center bg-[#FAFAFC]">
            {loading ? (
                <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
                    <CircularProgress color="inherit" />
                </Backdrop>
            ) : success ? (
                <div className="bg-emerald-600 text-white p-8 w-[95%] sm:w-[450px] border rounded-3xl shadow-xl flex flex-col gap-6 items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                        ✓
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Congratulations!</h1>
                    <p className="text-emerald-50 text-base font-medium">Your Booking was confirmed successfully!</p>
                    <div className="flex gap-4 mt-2">
                        <Button onClick={() => navigate("/")} color="inherit" variant="outlined" sx={{ borderRadius: "9999px" }}>
                            Go To Home
                        </Button>
                        <Button onClick={() => navigate("/bookings")} color="inherit" variant="contained" sx={{ bgcolor: "white", color: "#059669", borderRadius: "9999px", "&:hover": { bgcolor: "emerald.50" } }}>
                            View Bookings
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="bg-rose-600 text-white p-8 w-[95%] sm:w-[450px] border rounded-3xl shadow-xl flex flex-col gap-6 items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                        ✕
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">Payment Failed</h1>
                    <p className="text-rose-50 text-base font-medium">Something went wrong with the transaction or payment was cancelled.</p>
                    <div className="flex gap-4 mt-2">
                        <Button onClick={() => navigate("/")} color="inherit" variant="outlined" sx={{ borderRadius: "9999px" }}>
                            Go To Home
                        </Button>
                        <Button onClick={() => navigate("/bookings")} color="inherit" variant="contained" sx={{ bgcolor: "white", color: "#e11d48", borderRadius: "9999px", "&:hover": { bgcolor: "rose.50" } }}>
                            Go to Bookings
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentSuccessHandler;
