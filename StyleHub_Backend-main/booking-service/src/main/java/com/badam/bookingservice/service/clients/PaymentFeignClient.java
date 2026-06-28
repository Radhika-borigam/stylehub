package com.badam.bookingservice.service.clients;

import com.badam.bookingservice.domain.PaymentMethod;
import com.badam.bookingservice.entity.Booking;
import com.badam.bookingservice.exception.UserException;
import com.badam.bookingservice.payload.response.PaymentLinkResponse;
import com.razorpay.RazorpayException;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("PAYMENT-SERVICE")
public interface PaymentFeignClient {

    @PostMapping("/api/payments/create")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @RequestHeader("X-User-Email") String email,
            @RequestBody Booking booking,
            @RequestParam PaymentMethod paymentMethod) throws UserException,
            RazorpayException;
}
