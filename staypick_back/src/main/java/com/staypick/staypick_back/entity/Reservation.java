package com.staypick.staypick_back.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 예약 번호 (UUID 기반)
    private String reservationCode;

    // 예약한 사용자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 숙소
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accommodation_id")
    private Accommodation accommodation;

    // 객실
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    private String roomName;

    private LocalDate checkIn;

    private LocalDate checkOut;

    private String status; // 예약완료, 취소됨 등

    private LocalDateTime createdAt;

    private String guestName;        // 이용자 이름

    private String guestPhone;       // 이용자 연락처

    private int personnel;           // 예약 인원 수

    private String visitMethod;      // 방문 수단

    private int totalPrice;

    private String paymentMethod;

    // 순환참조 방지용: 리뷰가 Reservation을 1:1 참조할 때 역참조 방지
    @OneToOne(mappedBy = "reservation", fetch = FetchType.LAZY)
    @JsonIgnore
    private Review review;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();

        if (this.reservationCode == null) {
            this.reservationCode = UUID.randomUUID().toString();
        }
    }
}