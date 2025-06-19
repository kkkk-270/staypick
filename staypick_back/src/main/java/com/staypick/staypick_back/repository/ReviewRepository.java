package com.staypick.staypick_back.repository;

import com.staypick.staypick_back.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    Optional<Review> findByReservationId(Long reservationId);

    // ✅ 연관 엔티티 모두 fetch join으로 로딩
    @Query("SELECT r FROM Review r " +
           "JOIN FETCH r.user u " +
           "JOIN FETCH r.reservation res " +
           "JOIN FETCH res.accommodation " +
           "WHERE u.id = :userId")
    List<Review> findByUserIdWithJoin(@Param("userId") Long userId);

    @Query("SELECT r FROM Review r " +
           "JOIN FETCH r.reservation res " +
           "JOIN FETCH res.accommodation acc " +
           "WHERE acc.id = :accommodationId")
    List<Review> findByAccommodationIdWithJoin(@Param("accommodationId") Long accommodationId);

       @Query("SELECT AVG(r.rating) FROM Review r " +
              "JOIN r.reservation res " +
              "JOIN res.accommodation acc " +
              "WHERE acc.id = :accommodationId")
       Double findAverageRatingByAccommodationId(@Param("accommodationId") Long accommodationId);

       @Query("SELECT COUNT(r) FROM Review r " +
              "JOIN r.reservation res " +
              "JOIN res.accommodation acc " +
              "WHERE acc.id = :accommodationId")
       int countByAccommodationId(@Param("accommodationId") Long accommodationId);

       @Query("SELECT r FROM Review r " +
              "JOIN FETCH r.user u " +
              "JOIN FETCH r.reservation res " +
              "JOIN FETCH res.accommodation acc " +
              "LEFT JOIN FETCH res.room room " +
              "LEFT JOIN FETCH r.images imgs")
       List<Review> findAllWithJoin();

}
