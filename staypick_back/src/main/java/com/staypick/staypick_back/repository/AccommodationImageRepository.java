package com.staypick.staypick_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.staypick.staypick_back.entity.AccommodationImage;

public interface AccommodationImageRepository extends JpaRepository<AccommodationImage, Long> {
    List<AccommodationImage> findByAccommodationIdOrderByOrderIndexAsc(Long accommodationId);
}