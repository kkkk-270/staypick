package com.staypick.staypick_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.staypick.staypick_back.entity.Room;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByAccommodationId(Long accId);
}
