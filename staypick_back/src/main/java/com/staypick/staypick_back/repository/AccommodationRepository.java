package com.staypick.staypick_back.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.staypick.staypick_back.entity.Accommodation;

@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, Long> {
    Optional<Accommodation> findByName(String name);
    List<Accommodation> findByTypeContaining(String type);
    Page<Accommodation> findByTypeContaining(String type, Pageable pageable);
    Page<Accommodation> findAll(Pageable pageable);
}
