package com.staypick.staypick_back.controller;

import com.staypick.staypick_back.dto.ReviewResponse;
import com.staypick.staypick_back.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final ReviewService reviewService;

    // 관리자: 전체 리뷰 목록 조회
    @GetMapping
    public ResponseEntity<List<ReviewResponse>> getAllReviews() {
        List<ReviewResponse> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    // 관리자: 리뷰 상태 토글 (예: 숨김/활성)
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleReviewStatus(@PathVariable("id") Long id) {
        reviewService.toggleReviewStatus(id);
        return ResponseEntity.ok().build();
    }

    // 관리자: 리뷰 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable("id") Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok().build();
    }
}
