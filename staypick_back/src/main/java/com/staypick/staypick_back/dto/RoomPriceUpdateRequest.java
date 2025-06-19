package com.staypick.staypick_back.dto;

import lombok.Data;

@Data
public class RoomPriceUpdateRequest {
    private Long roomId;
    private Integer basePrice;
    private Integer weekendPrice;
    private Integer peakPrice;
    private Integer holidayPrice;
}
