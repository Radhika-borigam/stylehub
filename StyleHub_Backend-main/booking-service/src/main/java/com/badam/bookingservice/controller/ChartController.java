package com.badam.bookingservice.controller;


import com.badam.bookingservice.entity.Booking;
import com.badam.bookingservice.payload.dto.SalonDTO;
import com.badam.bookingservice.service.BookingService;
import com.badam.bookingservice.service.clients.SalonFeignClient;
import com.badam.bookingservice.service.impl.BookingChartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings/chart")
public class ChartController {

    private final BookingChartService bookingChartService;
    private final BookingService bookingService;
    private final SalonFeignClient salonService;

    @GetMapping("/earnings")
    public ResponseEntity<List<Map<String, Object>>> getEarningsChartData(
            @RequestHeader("X-User-Email") String email) throws Exception {

        SalonDTO salon = salonService.getSalonByOwner(email).getBody();
        List<Booking> bookings=bookingService.getBookingsBySalon(salon.getId());

        // Generate chart data
        List<Map<String, Object>> chartData = bookingChartService
                .generateEarningsChartData(bookings);

        return ResponseEntity.ok(chartData);

    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Map<String, Object>>> getBookingsChartData(
            @RequestHeader("X-User-Email") String email) throws Exception {

        SalonDTO salon = salonService.getSalonByOwner(email).getBody();
        List<Booking> bookings=bookingService.getBookingsBySalon(salon.getId());
        // Generate chart data
        List<Map<String, Object>> chartData = bookingChartService.generateBookingCountChartData(bookings);

        return ResponseEntity.ok(chartData);

    }
}
