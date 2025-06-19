package com.staypick.staypick_back.dto;

import com.staypick.staypick_back.entity.Inquiry;
import lombok.Data;

@Data
public class InquiryResponse {
    private Long id;
    private String userId;
    private Long accommodationId;
    private String accommodationName;
    private String title;
    private String content;
     private String inquiryType;
    private String status;
    private String comment;
    private String createdAt;

    public static InquiryResponse from(Inquiry inquiry) {
    InquiryResponse dto = new InquiryResponse();
    dto.setId(inquiry.getId());

    if (inquiry.getUser() != null) {
        dto.setUserId(inquiry.getUser().getUserid());
    } else {
        dto.setUserId("알 수 없음");
    }

    if (inquiry.getAccommodation() != null) {
        dto.setAccommodationId(inquiry.getAccommodation().getId());
        dto.setAccommodationName(inquiry.getAccommodation().getName());
    } else {
        dto.setAccommodationId(null);
        dto.setAccommodationName("숙소 없음");
    }

    dto.setTitle(inquiry.getTitle());
    dto.setContent(inquiry.getContent());
    dto.setInquiryType(inquiry.getInquiryType());
    dto.setStatus(inquiry.getStatus());
    dto.setComment(inquiry.getComment());
    dto.setCreatedAt(inquiry.getCreatedAt().toString());

    return dto;
}
}
