package com.badam.bookingservice.service;


import com.badam.bookingservice.domain.BookingStatus;
import com.badam.bookingservice.entity.Booking;
import com.badam.bookingservice.entity.PaymentOrder;
import com.badam.bookingservice.entity.SalonReport;
import com.badam.bookingservice.payload.dto.SalonDTO;
import com.badam.bookingservice.payload.dto.ServiceOfferingDTO;
import com.badam.bookingservice.payload.dto.UserDTO;
import com.badam.bookingservice.payload.request.BookingRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public interface BookingService {


    Booking createBooking(
            BookingRequest booking,
            UserDTO user,
            SalonDTO salon,
            Set<ServiceOfferingDTO> serviceOfferingSet) throws Exception;


    List<Booking> getBookingsByCustomer(Long customerId);


    List<Booking> getBookingsBySalon(Long salonId);


    Booking getBookingById(Long bookingId);

    Booking bookingSucess(PaymentOrder order);


    Booking updateBookingStatus(Long bookingId, BookingStatus status) throws Exception;

    SalonReport getSalonReport(Long salonId);

    List<Booking> getBookingsByDate(LocalDate date,Long salonId);
}
