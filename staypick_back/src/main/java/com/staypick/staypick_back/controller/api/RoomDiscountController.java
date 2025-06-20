package com.staypick.staypick_back.controller.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.staypick.staypick_back.dto.RoomDiscountDTO;
import com.staypick.staypick_back.service.RoomDiscountService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoomDiscountController {

    private final RoomDiscountService discountService;

    @GetMapping("/coupons")
    public List<RoomDiscountDTO> getCoupons(){
        return discountService.getAllRoomDiscounts();
    }
}
