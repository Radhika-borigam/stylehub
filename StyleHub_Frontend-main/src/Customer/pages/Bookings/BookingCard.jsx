import React from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { updateBookingStatus } from "../../../Redux/Booking/action";

const BookingCard = ({ booking }) => {
  const dispatch = useDispatch();

  const handleCancelBooking = () => {
    // const status=booking.status==="CANCELLED"?"PENDING":"CANCELLED"
    dispatch(
      updateBookingStatus({
        bookingId: booking.id,
        status: "CANCELLED",
        jwt: localStorage.getItem("jwt"),
      })
    );
  };
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 md:flex items-center justify-between gap-6">
      <div className="flex-1 space-y-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-slate-800">{booking.salon.name}</h1>
          <p className="text-xs text-slate-400 font-semibold tracking-wide uppercase">{booking.salon.city}</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {booking.services.map((service) => (
            <span key={service.id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 text-primary-color border border-violet-100">
              {service.name}
            </span>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-50 space-y-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <span>Date & Time</span>
            <ArrowRightAltIcon className="text-slate-400" />
            <span className="text-primary-color">{booking.startTime?.split("T")[0]}</span>
          </div>
          <p className="text-xs text-slate-500">
            {booking.startTime?.split("T")[1]?.substring(0, 5)} - {booking.endTime?.split("T")[1]?.substring(0, 5)}
          </p>
        </div>
      </div>
      
      <div className="mt-4 md:mt-0 flex md:flex-col items-center justify-between md:justify-center gap-4 w-full md:w-32">
        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
          <img className="h-full w-full object-cover" src={booking.salon.images?.[0]} alt={booking.salon.name} />
        </div>
        <div className="text-right md:text-center">
          <p className="text-lg font-extrabold text-slate-800">₹{booking.totalPrice}</p>
          <span className={`inline-block px-2.5 py-0.5 mt-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${booking.status === 'CANCELLED' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
            {booking.status}
          </span>
        </div>
        {booking.status !== "CANCELLED" && (
          <Button
            onClick={handleCancelBooking}
            color="error"
            fullWidth
            size="small"
            variant="outlined"
            sx={{ borderRadius: '8px' }}
          >
            Cancel Booking
          </Button>
        )}
      </div>
    </div>
  );
};

export default BookingCard;
