package com.staypick.staypick_back.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.staypick.staypick_back.dto.RoomDiscountDTO;
import com.staypick.staypick_back.entity.RoomDiscount;
import com.staypick.staypick_back.repository.RoomDiscountRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomDiscountService {

    private final RoomDiscountRepository discountRepository;

    public List<RoomDiscountDTO> getAllRoomDiscounts(){
        List<RoomDiscount> discounts = discountRepository.findAll();

        return discounts.stream().map(discount -> RoomDiscountDTO.builder()
                .id(discount.getId())
                .roomId(discount.getRoom().getId())
                .accName(discount.getRoom().getAccommodation().getName())
                .discountType(discount.getDiscountType())
                .discountValue(discount.getDiscountValue())
                .periodName(discount.getPeriodName())
                .startDate(discount.getStartDate())
                .endDate(discount.getEndDate())
                .build()
        ).collect(Collectors.toList());
                
    }
}
