package com.staypick.staypick_back.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 리뷰 작성자
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // 해당 예약 (1:1 대응)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;

    private int rating;

    @Column(columnDefinition = "TEXT")
    private String content;

    // 기존 단일 이미지 URL 필드 (앞으로는 사용하지 않을 예정)
    private String imageUrl;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // 리뷰 상태 필드 (기본값: false = 게시 중 관리자 페이지 전용)
    @Column(nullable = false)
    private boolean hidden = false;

    // ✅ 리뷰 이미지들 (1:N 연관관계)
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReviewImage> images = new ArrayList<>();
}
