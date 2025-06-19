package com.staypick.staypick_back.repository;

import com.staypick.staypick_back.entity.Reservation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 🔹 마이페이지 - 로그인한 사용자의 예약 목록 조회 시 room, accommodation 함께 로딩
    @EntityGraph(attributePaths = {"room", "accommodation"})
    List<Reservation> findByUserId(Long userid);

    // 🔹 관리자 - 숙소별 예약 목록 조회
    List<Reservation> findByAccommodationIdOrderByCheckInAscCheckOutAscRoomIdAsc(Long accommodationId);

    // 🔹 예약 중복 방지용 - 같은 객실, 같은 날짜에 예약이 있는지 확인
    @Query("SELECT COUNT(r) FROM Reservation r " +
           "WHERE r.room.id = :roomId " +
           "AND r.status = '예약완료' " +
           "AND r.checkIn < :checkOut " +
           "AND r.checkOut > :checkIn")
    int countOverlappingReservations(@Param("roomId") Long roomId,
                                     @Param("checkIn") LocalDate checkIn,
                                     @Param("checkOut") LocalDate checkOut);
}
