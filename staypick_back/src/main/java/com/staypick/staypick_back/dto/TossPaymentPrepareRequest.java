// TossPaymentPrepareRequest.java
package com.staypick.staypick_back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TossPaymentPrepareRequest {
    private int amount;
    private String orderId;
    private String orderName;
    private String customerName;
    private String customerEmail;
    private String successUrl;
    private String failUrl;

    private String method = "card";  // 기본값을 명시적으로 "card"로 설정
}
