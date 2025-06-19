package com.staypick.staypick_back.controller.api;

import com.staypick.staypick_back.dto.RoomResponseDTO;
import com.staypick.staypick_back.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accommodations")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    // 숙소 ID로 객실 리스트 반환
    @GetMapping("/{id}/rooms")
    public List<RoomResponseDTO> getRoomsByAccommodation(@PathVariable("id") Long id) {
        return roomService.getRoomsByAccommodationId(id);
    }
}
