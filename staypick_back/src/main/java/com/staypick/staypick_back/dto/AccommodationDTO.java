package com.staypick.staypick_back.dto;

import java.util.List;
import java.util.stream.Collectors;

import com.staypick.staypick_back.entity.Accommodation;

import lombok.Data;

@Data
public class AccommodationDTO {
    private Long id;
    private String name;
    private String address;
    private String tel;
    private Double lat;
    private Double lng;
    private String type;
    private String checkin;
    private String checkout;
    private String refund;

    private Boolean hasPark;
    private Boolean hasCooking;
    private Boolean hasPickup;
    private Boolean hasRestaurant;
    private Boolean hasSauna;
    private Boolean hasBarbecue;
    private Boolean hasFitness;
    private Boolean hasPc;
    private Boolean hasShower;

    // ✅ Room 리스트 포함
    private List<RoomDTO> rooms;

    public AccommodationDTO(Accommodation accommodation) {
        this.id = accommodation.getId();
        this.name = accommodation.getName();
        this.address = accommodation.getAddress();
        this.tel = accommodation.getTel();
        this.lat = accommodation.getLat();
        this.lng = accommodation.getLng();
        this.type = accommodation.getType();
        this.checkin = accommodation.getCheckin();
        this.checkout = accommodation.getCheckout();
        this.refund = accommodation.getRefund();

        this.hasPark = accommodation.getHasPark();
        this.hasCooking = accommodation.getHasCooking();
        this.hasPickup = accommodation.getHasPickup();
        this.hasRestaurant = accommodation.getHasRestaurant();
        this.hasSauna = accommodation.getHasSauna();
        this.hasBarbecue = accommodation.getHasBarbecue();
        this.hasFitness = accommodation.getHasFitness();
        this.hasPc = accommodation.getHasPc();
        this.hasShower = accommodation.getHasShower();

        // ✅ Room -> RoomDto 변환
        this.rooms = accommodation.getRooms().stream()
                .map(RoomDTO::new)
                .collect(Collectors.toList());
    }
}
