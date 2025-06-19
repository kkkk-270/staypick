package com.staypick.staypick_back.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TossPaymentConfirmRequest {
    private String paymentKey;
    private String orderId;
    private String amount;
}