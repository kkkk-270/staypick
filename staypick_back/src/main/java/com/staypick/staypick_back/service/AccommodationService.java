package com.staypick.staypick_back.service;

import org.springframework.stereotype.Service;

import com.staypick.staypick_back.dto.AccommodationUpdateRequest;
import com.staypick.staypick_back.entity.Accommodation;
import com.staypick.staypick_back.repository.AccommodationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    
    //ID로 숙소 조회
    public Accommodation findById(Long id){
        return accommodationRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("해당 숙소를 찾을 수 없습니다. ID: " + id));
    }

    public Accommodation updateAccommodation(AccommodationUpdateRequest dto){
        Accommodation accommodation = findById(dto.getId());

        accommodation.setName(dto.getName());
        accommodation.setAddress(dto.getAddress());
        accommodation.setTel(dto.getTel());
        accommodation.setCheckin(dto.getCheckin());
        accommodation.setCheckout(dto.getCheckout());
        accommodation.setRefund(dto.getRefund());
        accommodation.setType(dto.getType());
        accommodation.setDetaillocation(dto.getDetaillocation());
        accommodation.setHasPark(dto.getHasPark());
        accommodation.setHasCooking(dto.getHasCooking());
        accommodation.setHasPickup(dto.getHasPickup());
        accommodation.setHasRestaurant(dto.getHasRestaurant());
        accommodation.setHasSauna(dto.getHasSauna());
        accommodation.setHasBarbecue(dto.getHasBarbecue());
        accommodation.setHasFitness(dto.getHasFitness());
        accommodation.setHasPc(dto.getHasPc());
        accommodation.setHasShower(dto.getHasShower());

        return accommodationRepository.save(accommodation);
    }
}
