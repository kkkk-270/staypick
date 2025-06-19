package com.staypick.staypick_back.dto;

import lombok.Data;

@Data
public class AccommodationUpdateRequest {
    private Long id;
    private String name;
    private String address;
    private String tel;
    private String checkin;
    private String checkout;
    private String refund;
    private String type;
    private String detaillocation;
    private Boolean hasPark;
    private Boolean hasCooking;
    private Boolean hasPickup;
    private Boolean hasRestaurant;
    private Boolean hasSauna;
    private Boolean hasBarbecue;
    private Boolean hasFitness;
    private Boolean hasPc;
    private Boolean hasShower;
}
