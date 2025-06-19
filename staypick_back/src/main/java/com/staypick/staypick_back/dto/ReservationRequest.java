package com.staypick.staypick_back.dto;

import lombok.Data;

@Data
public class ReservationRequest {
    private Long accommodationId;  // 숙소 ID
    private Long roomId; 
    private String roomType;       // 객실명
    private String checkIn;        // 체크인 (yyyy-MM-dd)
    private String checkOut;       // 체크아웃
    private String guestName;      // 이용자 이름
    private String guestPhone;     // 이용자 연락처
    private int personnel;         // 인원수
    private String visitMethod;    // 방문 수단
    private int totalPrice;        // 결제금액
}
