package com.badam.paymentservice.controller;

import com.badam.paymentservice.domain.PaymentMethod;
import com.badam.paymentservice.exception.UserException;
import com.badam.paymentservice.entity.PaymentOrder;
import com.badam.paymentservice.payload.dto.BookingDTO;
import com.badam.paymentservice.payload.dto.UserDTO;
import com.badam.paymentservice.payload.response.PaymentLinkResponse;
import com.badam.paymentservice.service.PaymentService;
import com.badam.paymentservice.service.clients.UserFeignClient;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final UserFeignClient userService;


    @PostMapping("/create")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink(
            @RequestHeader("X-User-Email") String email,
            @RequestBody BookingDTO booking,
            @RequestParam PaymentMethod paymentMethod) throws UserException,
            RazorpayException, StripeException {

            UserDTO user = userService.getUserByEmail(email).getBody();

            PaymentLinkResponse paymentLinkResponse = paymentService
                    .createOrder(user, booking, paymentMethod);

            return ResponseEntity.ok(paymentLinkResponse);
    }

    @GetMapping("/{paymentOrderId}")
    public ResponseEntity<PaymentOrder> getPaymentOrderById(
            @PathVariable Long paymentOrderId) {
        try {
            PaymentOrder paymentOrder = paymentService.getPaymentOrderById(paymentOrderId);
            return ResponseEntity.ok(paymentOrder);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/proceed")
    public ResponseEntity<Boolean> proceedPayment(
            @RequestParam String paymentId,
            @RequestParam String paymentLinkId) throws Exception {

            PaymentOrder paymentOrder = paymentService.
                    getPaymentOrderByPaymentId(paymentLinkId);
            Boolean success = paymentService.ProceedPaymentOrder(
                    paymentOrder,
                    paymentId, paymentLinkId);
            return ResponseEntity.ok(success);

    }

    @PatchMapping("/{paymentOrderId}/fail")
    public ResponseEntity<PaymentOrder> failPayment(
            @PathVariable Long paymentOrderId) throws Exception {
        PaymentOrder paymentOrder = paymentService.failPaymentOrder(paymentOrderId);
        return ResponseEntity.ok(paymentOrder);
    }
}
