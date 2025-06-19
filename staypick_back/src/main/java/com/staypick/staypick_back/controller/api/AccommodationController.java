package com.staypick.staypick_back.controller.api;

import com.staypick.staypick_back.dto.AccommodationResponseDto;
import com.staypick.staypick_back.dto.ServiceDto;
import com.staypick.staypick_back.entity.Accommodation;
import com.staypick.staypick_back.entity.AccommodationImage;
import com.staypick.staypick_back.repository.AccommodationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/accommodations")
@RequiredArgsConstructor
public class AccommodationController {

    private final AccommodationRepository accommodationRepository;

    @GetMapping
    public ResponseEntity<Page<AccommodationResponseDto>> getAccommodations(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "region", required = false) String region,
            @RequestParam(name = "sort", required = false) String sort
    ) {
        try {
            List<Accommodation> all = (type != null && !type.isEmpty() && !type.equals("전체"))
                    ? accommodationRepository.findByTypeContaining(type)
                    : accommodationRepository.findAll();

            if (region != null && !region.isEmpty() && !region.equals("전체")) {
                String keyword = region.trim();
                all = all.stream()
                        .filter(a -> a.getAddress() != null && a.getAddress().contains(keyword))
                        .collect(Collectors.toList());
            }

            if ("price-asc".equals(sort)) {
                all.sort((a, b) -> {
                    Integer priceA = Optional.ofNullable(a.getPrice()).orElse(100000);
                    Integer priceB = Optional.ofNullable(b.getPrice()).orElse(100000);
                    return priceA.compareTo(priceB);
                });
            } 

            int start = page * size;
            int end = Math.min(start + size, all.size());
            List<AccommodationResponseDto> paged = all.subList(start, end).stream()
                    .map(AccommodationResponseDto::from)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(new PageImpl<>(paged, PageRequest.of(page, size), all.size()));
        } catch (Exception e) {
            log.error("❌ 숙소 리스트 조회 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccommodationResponseDto> getAccommodationById(@PathVariable("id") Long id) {
        return accommodationRepository.findById(id)
                .map(accommodation -> ResponseEntity.ok(AccommodationResponseDto.from(accommodation)))
                .orElseGet(() -> {
                    log.warn("❗ 숙소 ID={} 존재하지 않음", id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                });
    }

    @GetMapping("/{id}/images")
public ResponseEntity<List<String>> getAccommodationImages(@PathVariable("id") Long id) {
    return accommodationRepository.findById(id)
            .map(accommodation -> {
                List<String> imageUrls = accommodation.getImages().stream()
                        .map(AccommodationImage::getImageUrl)
                        .toList();
                return ResponseEntity.ok(imageUrls);
            })
            .orElseGet(() -> {
                log.warn("❗ 숙소 ID={}로 이미지 조회 실패", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            });
}
    @GetMapping("/{id}/services")
    public ResponseEntity<List<ServiceDto>> getAccommodationServices(@PathVariable("id") Long id) {
        return accommodationRepository.findById(id)
                .map(acc -> {
                    List<ServiceDto> services = new ArrayList<>();
                    if (Boolean.TRUE.equals(acc.getHasPark())) services.add(new ServiceDto("주차 가능", "free_park.png"));
                    if (Boolean.TRUE.equals(acc.getHasCooking())) services.add(new ServiceDto("취사 가능", "cooking.png"));
                    if (Boolean.TRUE.equals(acc.getHasPickup())) services.add(new ServiceDto("픽업 가능", "pickup.png"));
                    if (Boolean.TRUE.equals(acc.getHasRestaurant())) services.add(new ServiceDto("레스토랑", "restaurant.png"));
                    if (Boolean.TRUE.equals(acc.getHasSauna())) services.add(new ServiceDto("사우나", "sauna.png"));
                    if (Boolean.TRUE.equals(acc.getHasBarbecue())) services.add(new ServiceDto("바비큐", "barbecue.png"));
                    if (Boolean.TRUE.equals(acc.getHasFitness())) services.add(new ServiceDto("피트니스", "fitness.png"));
                    if (Boolean.TRUE.equals(acc.getHasPc())) services.add(new ServiceDto("PC방", "pc.png"));
                    if (Boolean.TRUE.equals(acc.getHasShower())) services.add(new ServiceDto("샤워 시설", "shower.png"));
                    return ResponseEntity.ok(services);
                })
                .orElseGet(() -> {
                    log.warn("❗ 숙소 ID={}로 서비스 조회 실패", id);
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
                });
    }
}
