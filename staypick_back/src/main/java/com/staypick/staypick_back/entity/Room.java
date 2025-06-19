package com.staypick.staypick_back.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "room_number")
    private Integer roomNumber;

    private Integer price;

    @Column(name = "weekend_price")
    private Integer weekendPrice;

    @Column(name = "peak_price")
    private Integer peakPrice;

    @Column(name = "room_type")
    private String roomType; // 예: "양실", "스위트", "패밀리룸"
    
    private String image;         // 객실 이미지
    private Integer personnel;    // 수용 인원
    private String checkin;       // 체크인 시간
    private String checkout;      // 체크아웃 시간
    private String extra;         // 추가 설명
    private Integer discountPrice; // 할인 가격

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "acc_id", nullable = false)
    private Accommodation accommodation;
}
