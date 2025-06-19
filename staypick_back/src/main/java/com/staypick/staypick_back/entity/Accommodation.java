package com.staypick.staypick_back.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "accommodations")
@Data
public class Accommodation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String thumbnail;
    private String address;
    private String tel;
    private Double lat;
    private Double lng;

    @Column(name = "room_type")
    private String roomType; // 객실 정보

    private String type; // 호텔/모텔, 게스트하우스/한옥 등 구분

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

    private Integer price;

    @Column(name = "detaillocation")
    private String detaillocation;

    @Transient
    private Double averageRating;

    @Transient
    private Integer reviewCount;

    // ✅ 양방향 매핑: Room 리스트
    @OneToMany(mappedBy = "accommodation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Room> rooms = new ArrayList<>();


    @OneToMany(mappedBy = "accommodation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AccommodationImage> images = new ArrayList<>();

    // ✅ 편의 메서드
    public void addRoom(Room room) {
        rooms.add(room);
        room.setAccommodation(this);
    }

    public void removeRoom(Room room) {
        rooms.remove(room);
        room.setAccommodation(null);
    }
}
