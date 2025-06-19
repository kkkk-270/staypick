package com.staypick.staypick_back.controller.api;

import com.staypick.staypick_back.dto.ReservationDto;
import com.staypick.staypick_back.security.JwtUtil;
import com.staypick.staypick_back.service.ReservationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationApiController {

    private final ReservationService reservationService;
    private final JwtUtil jwtUtil;

    // ✅ 예약 취소
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelReservation(@PathVariable("id") Long id, HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        String userId = jwtUtil.getUserIdFromToken(token);

        reservationService.cancelReservation(id, userId);
        return ResponseEntity.ok("예약이 취소되었습니다.");
    }
    @GetMapping("/{id}")
    public ResponseEntity<ReservationDto> getReservation(@PathVariable("id") Long id) {
        return ResponseEntity.ok(reservationService.getReservationDetail(id));
    }
}
