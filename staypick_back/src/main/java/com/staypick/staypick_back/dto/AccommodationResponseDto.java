package com.staypick.staypick_back.dto;

import com.staypick.staypick_back.entity.Accommodation;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AccommodationResponseDto {
    private Long id;
    private String name;
    private String address;
    private String tel;
    private String type;
    private String thumbnail;
    private Integer price;
    private String detaillocation;

    public static AccommodationResponseDto from(Accommodation entity) {
        return AccommodationResponseDto.builder()
                .id(entity.getId())
                .name(entity.getName())
                .address(entity.getAddress())
                .tel(entity.getTel())
                .type(entity.getType())
                .thumbnail(entity.getThumbnail())
                .price(entity.getPrice() != null ? entity.getPrice() : 100000)
                .detaillocation(entity.getDetaillocation())
                .build();
    }
}
