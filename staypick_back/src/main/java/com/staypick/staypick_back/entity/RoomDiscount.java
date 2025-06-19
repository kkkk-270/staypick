package com.staypick.staypick_back.entity;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "room_discount")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomDiscount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(name = "discount_type")
    private String discountType; // "PRICE" or "PERCENT"

    @Column(name = "discount_value")
    private Integer discountValue;

    @Column(name = "period_name")
    private String periodName;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}
