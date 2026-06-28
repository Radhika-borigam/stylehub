package com.badam.paymentservice.service;



import com.badam.paymentservice.domain.PaymentMethod;
import com.badam.paymentservice.entity.PaymentOrder;
import com.badam.paymentservice.exception.UserException;
import com.badam.paymentservice.payload.dto.BookingDTO;
import com.badam.paymentservice.payload.dto.UserDTO;
import com.badam.paymentservice.payload.response.PaymentLinkResponse;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;
import com.stripe.exception.StripeException;


public interface PaymentService {

    PaymentLinkResponse createOrder(UserDTO user,
                                    BookingDTO booking, PaymentMethod paymentMethod) throws RazorpayException, UserException, StripeException;

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    PaymentOrder getPaymentOrderByPaymentId(String paymentId) throws Exception;

    Boolean ProceedPaymentOrder (PaymentOrder paymentOrder,
                                 String paymentId, String paymentLinkId) throws RazorpayException;

    PaymentLink createRazorpayPaymentLink(UserDTO user,
                                          Long Amount,
                                          Long orderId) throws RazorpayException;

    String createStripePaymentLink(UserDTO user, Long Amount,
                                            Long orderId) throws StripeException;

    PaymentOrder failPaymentOrder(Long orderId) throws Exception;
}
