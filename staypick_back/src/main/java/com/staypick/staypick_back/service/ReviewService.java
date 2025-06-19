package com.staypick.staypick_back.service;

import com.staypick.staypick_back.dto.ReviewRequest;
import com.staypick.staypick_back.dto.ReviewResponse;
import com.staypick.staypick_back.dto.ReviewSummaryDto;
import com.staypick.staypick_back.entity.*;
import com.staypick.staypick_back.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ReviewImageRepository reviewImageRepository;

    public void createReview(User user, ReviewRequest request, List<MultipartFile> images) {
        Reservation reservation = reservationRepository.findById(request.getReservationId())
                .orElseThrow(() -> new IllegalArgumentException("예약 정보가 없습니다."));

        if (reviewRepository.findByReservationId(reservation.getId()).isPresent()) {
            throw new IllegalStateException("이미 리뷰가 작성된 예약입니다.");
        }

        Review review = Review.builder()
                .user(user)
                .reservation(reservation)
                .rating(request.getRating())
                .content(request.getContent())
                .build();

        if (images != null && !images.isEmpty()) {
            List<ReviewImage> imageEntities = new ArrayList<>();
            for (int i = 0; i < images.size(); i++) {
                MultipartFile image = images.get(i);
                if (!image.isEmpty()) {
                    try {
                        String filename = "review_" + UUID.randomUUID() + ".jpg";
                        Path uploadPath = Paths.get("upload/reviews").toAbsolutePath();
                        Files.createDirectories(uploadPath);
                        Path savePath = uploadPath.resolve(filename);
                        image.transferTo(savePath.toFile());

                        String imageUrl = "/upload/reviews/" + filename;

                        if (i == 0) {
                            review.setImageUrl(imageUrl);
                        }

                        ReviewImage imageEntity = ReviewImage.builder()
                                .review(review)
                                .imageUrl(imageUrl)
                                .build();
                        imageEntities.add(imageEntity);

                    } catch (IOException e) {
                        throw new RuntimeException("이미지 업로드 실패", e);
                    }
                }
            }
            review.setImages(imageEntities);
        }

        reviewRepository.save(review);
    }

    public void deleteReview(Long reviewId, String userid) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("리뷰가 존재하지 않습니다."));

        if (!review.getUser().getUserid().equals(userid)) {
            throw new AccessDeniedException("리뷰 삭제 권한이 없습니다.");
        }

        reviewRepository.delete(review);
    }

    public List<ReviewResponse> getMyReviews(Long userId) {
        return reviewRepository.findByUserIdWithJoin(userId).stream()
                .map(this::toDto)
                .toList();
    }

    public List<ReviewResponse> getReviewsByAccommodation(Long accommodationId) {
        return reviewRepository.findByAccommodationIdWithJoin(accommodationId).stream()
                .map(this::toDto)
                .toList();
    }

    public boolean hasReviewForReservation(Long reservationId) {
        return reviewRepository.findByReservationId(reservationId).isPresent();
    }

    private ReviewResponse toDto(Review review) {
        Reservation reservation = review.getReservation();
        List<String> imageUrls = review.getImages() != null
                ? review.getImages().stream().map(ReviewImage::getImageUrl).toList()
                : new ArrayList<>();

        return ReviewResponse.builder()
                .id(review.getId())
                .username(review.getUser().getUsername())
                .accommodationName(reservation.getAccommodation().getName())
                .roomName(reservation.getRoom() != null ? reservation.getRoom().getName() : null)
                .checkIn(reservation.getCheckIn() != null ? reservation.getCheckIn().toString() : null)    // ✅ 추가
                .checkOut(reservation.getCheckOut() != null ? reservation.getCheckOut().toString() : null)  // ✅ 추가
                .rating(review.getRating())
                .content(review.getContent())
                .imageUrl(review.getImageUrl())
                .imageUrls(imageUrls)
                .createdAt(review.getCreatedAt())
                .build();
    }

    public ReviewSummaryDto getReviewSummary(Long accommodationId) {
        Double avg = reviewRepository.findAverageRatingByAccommodationId(accommodationId);
        int count = reviewRepository.countByAccommodationId(accommodationId);

        return ReviewSummaryDto.builder()
                .accommodationId(accommodationId)
                .averageRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0)
                .reviewCount(count)
                .build();
    }
    // 관리자: 전체 리뷰 조회
public List<ReviewResponse> getAllReviews() {
    return reviewRepository.findAllWithJoin().stream()
            .map(this::toDto)
            .toList();
}

// 관리자: 리뷰 삭제
public void deleteReview(Long reviewId) {
    Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new IllegalArgumentException("리뷰가 존재하지 않습니다."));
    reviewRepository.delete(review);
}

// 관리자: 리뷰 숨김/보임 상태 토글 (필요 시)
public void toggleReviewStatus(Long reviewId) {
    Review review = reviewRepository.findById(reviewId)
            .orElseThrow(() -> new IllegalArgumentException("리뷰가 존재하지 않습니다."));
    review.setHidden(!review.isHidden()); // 엔티티에 hidden 필드 추가해서 가져옴
    reviewRepository.save(review);
}
}
