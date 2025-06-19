package com.staypick.staypick_back.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.staypick.staypick_back.entity.BizAccommodation;
import com.staypick.staypick_back.entity.User;

public interface BizAccommodationRepository extends JpaRepository<BizAccommodation, Long> {
    Optional<BizAccommodation> findByUser(User user);
}
