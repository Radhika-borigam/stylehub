export const getPriceTotal=(bookings)=>{
    if (!bookings) return 0;
    return bookings.reduce((acc, booking)=>{
        if (booking.status === "CONFIRMED") {
            return booking.totalPrice + acc;
        }
        return acc;
    }, 0)
}