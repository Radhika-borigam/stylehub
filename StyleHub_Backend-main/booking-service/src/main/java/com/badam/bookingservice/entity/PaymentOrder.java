package com.badam.bookingservice.entity;

import com.badam.bookingservice.domain.PaymentMethod;
import com.badam.bookingservice.domain.PaymentOrderStatus;
import lombok.Data;

@Data
public class PaymentOrder {
    private Long id;

    private Long amount;

    private PaymentOrderStatus status;

    private PaymentMethod paymentMethod;

    private String paymentLinkId;

    private Long userId;

    private Long bookingId;
}
