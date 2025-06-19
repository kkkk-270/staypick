package com.staypick.staypick_back.controller.api;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.staypick.staypick_back.dto.AccommodationImageDto;
import com.staypick.staypick_back.repository.AccommodationImageRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/accommodation")

public class AccmmodationImageController {
 private final AccommodationImageRepository imageRepository;

    @GetMapping("/{id}/images")
    public List<AccommodationImageDto> getImages(@PathVariable("id") Long id) {
        return imageRepository.findByAccommodationIdOrderByOrderIndexAsc(id)
            .stream()
            .map(img -> new AccommodationImageDto(img.getImageUrl(), img.getOrderIndex()))
            .collect(Collectors.toList());
    }
}