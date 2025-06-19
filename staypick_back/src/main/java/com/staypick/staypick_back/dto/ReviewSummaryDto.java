package com.staypick.staypick_back.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewSummaryDto {
    private Long accommodationId;
    private double averageRating;
    private int reviewCount;
}
