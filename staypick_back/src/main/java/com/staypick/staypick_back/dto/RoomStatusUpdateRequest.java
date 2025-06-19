package com.staypick.staypick_back.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class RoomStatusUpdateRequest {
    private Long roomId;
    private LocalDate date;
    private String status;
}
