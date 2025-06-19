package com.staypick.staypick_back.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor 
public class ReviewRequest {
    private Long reservationId;
    private int rating;
    private String content;
}
