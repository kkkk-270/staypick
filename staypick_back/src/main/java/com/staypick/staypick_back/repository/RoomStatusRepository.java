package com.staypick.staypick_back.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.staypick.staypick_back.entity.RoomStatus;

public interface RoomStatusRepository extends JpaRepository<RoomStatus, Long> {
    Optional<RoomStatus> findByRoomIdAndDate(Long roomId, LocalDate date);
    List<RoomStatus> findByDateBetween(LocalDate start, LocalDate end);
    List<RoomStatus> findAllByRoomIdAndDateBetween(Long roomId, LocalDate startDate, LocalDate endDate);
}
