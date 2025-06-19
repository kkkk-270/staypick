package com.staypick.staypick_back.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DiscountWithRoomSeasonDTO {
    private Long id;
    private Long roomId;
    private String roomName;
    private Integer price;
    private Integer weekendPrice;
    private Integer peakPrice;

    private String periodName;
    private LocalDate startDate;
    private LocalDate endDate;
    private String discountType;
    private Integer discountValue;

    private String seasonType;
}
