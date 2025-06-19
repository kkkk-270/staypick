package com.staypick.staypick_back.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.staypick.staypick_back.entity.Accommodation;
import com.staypick.staypick_back.entity.Season;

public interface SeasonRepository extends JpaRepository<Season, Long> {
    List<Season> findByAccommodationId(Long accId);

    void deleteByAccommodation(Accommodation acc);
}
