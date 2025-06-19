package com.staypick.staypick_back.dto;

import lombok.Data;

@Data
public class InquiryRequest {
    private String title;
    private String content;
    private String inquiryType; // 예: 가격, 시설 등
    private Long accommodationId; // ← 이 필드가 없으면 위 오류 발생
}
