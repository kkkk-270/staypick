package com.staypick.staypick_back.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor

public class AccommodationImageDto {
    private String imageUrl;
    private int orderIndex;
}