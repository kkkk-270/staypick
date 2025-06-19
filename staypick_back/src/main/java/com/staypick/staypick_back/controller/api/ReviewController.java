package com.staypick.staypick_back.controller.api;

import com.staypick.staypick_back.dto.ReviewRequest;
import com.staypick.staypick_back.dto.ReviewResponse;
import com.staypick.staypick_back.dto.ReviewSummaryDto;
import com.staypick.staypick_back.entity.User;
import com.staypick.staypick_back.repository.UserRepository;
import com.staypick.staypick_back.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserRepository userRepository;

    /**
     * 리뷰 작성 (이미지 포함)
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createReview(
            @RequestPart("data") ReviewRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            // 🔐 현재 로그인 유저 정보 추출
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userid = auth.getName();

            User user = userRepository.findByUserid(userid)
                    .orElseThrow(() -> new RuntimeException("유저 정보를 찾을 수 없습니다."));

            // 💾 리뷰 저장
            reviewService.createReview(user, request, images);

            return ResponseEntity.ok("✅ 리뷰가 등록되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("❌ 리뷰 등록 실패: " + e.getMessage());
        }
    }

    /**
     * 리뷰 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable("id") Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userid = auth.getName();

        reviewService.deleteReview(id, userid);
        return ResponseEntity.ok().build();
    }

    /**
     * 내 리뷰 목록 조회
     */
    @GetMapping("/mine")
    public ResponseEntity<List<ReviewResponse>> getMyReviews() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userid = auth.getName();

        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> new RuntimeException("유저 정보를 찾을 수 없습니다."));

        return ResponseEntity.ok(reviewService.getMyReviews(user.getId()));
    }

    /**
     * 숙소별 리뷰 조회
     */
    @GetMapping("/accommodation/{id}")
    public ResponseEntity<List<ReviewResponse>> getReviewsByAccommodation(@PathVariable("id") Long id) {
        return ResponseEntity.ok(reviewService.getReviewsByAccommodation(id));
    }

    /**
     * 리뷰 요약 조회 (평균 별점 및 개수)
     */
    @GetMapping("/summary/{accommodationId}")
    public ReviewSummaryDto getReviewSummary(@PathVariable("accommodationId") Long accommodationId) {
        return reviewService.getReviewSummary(accommodationId);
    }

    /**
     * 예약 ID로 리뷰 존재 여부 확인
     */
    @GetMapping("/reservation/{id}/exists")
    public ResponseEntity<Boolean> hasReview(@PathVariable("id") Long id) {
        return ResponseEntity.ok(reviewService.hasReviewForReservation(id));
    }
    
}
