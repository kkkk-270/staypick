package com.staypick.staypick_back.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ReviewResponse {

    private Long id;
    private String username;
    private String accommodationName;
    private String roomName;

    private String checkIn;     //  추가
    private String checkOut;    //  추가

    private int rating;
    private String content;

    private String imageUrl; // 단일 이미지 (대표용)
    private List<String> imageUrls; // 여러 이미지
    private LocalDateTime createdAt;
}
