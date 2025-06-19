package com.staypick.staypick_back.dto;

import lombok.Data;

@Data
public class ReservationCreateRequest {
    private Long roomId;
    private Long accommodationId;
    private String checkIn;
    private String checkOut;
    private String guestName;
    private String guestPhone;
    private int personnel;
    private String visitMethod;
    private int totalPrice;
}
