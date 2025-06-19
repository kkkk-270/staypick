package com.staypick.staypick_back.controller;

import com.staypick.staypick_back.dto.ReservationDto;
import com.staypick.staypick_back.dto.ReservationRequest;
import com.staypick.staypick_back.entity.Reservation;
import com.staypick.staypick_back.entity.User;
import com.staypick.staypick_back.repository.UserRepository;
import com.staypick.staypick_back.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/mypage/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;
    private final UserRepository userRepository;

    // 🔹 마이페이지 예약 조회
    @GetMapping
    public List<ReservationDto> getMyReservations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userid = auth.getName();
        System.out.println("🔍 [GET] /mypage/reservations - 로그인 유저 ID: " + userid);

        User user = userRepository.findByUserid(userid)
                .orElseThrow(() -> {
                    System.out.println("❌ 유저 조회 실패: " + userid);
                    return new RuntimeException("유저 정보를 찾을 수 없습니다.");
                });

        System.out.println("✅ 유저 조회 성공: " + user.getUsername());
        return reservationService.getReservationsByUser(user);
    }

    // 🔹 예약 생성
    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        System.out.println("📩 [POST] /mypage/reservations - 예약 생성 요청 수신");

        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String userid = auth.getName();
            System.out.println("🔐 인증된 유저 ID: " + userid);

            System.out.println("📦 요청 본문 내용: " + request);

            User user = userRepository.findByUserid(userid)
                    .orElseThrow(() -> {
                        System.out.println("❌ 유저 조회 실패: " + userid);
                        return new RuntimeException("유저 정보를 찾을 수 없습니다.");
                    });

            System.out.println("✅ 유저 조회 성공: " + user.getUsername());

            Reservation saved = reservationService.createReservation(user, request);
            System.out.println("✅ 예약 저장 완료 - ID: " + saved.getId());

            return ResponseEntity.ok().body(saved.getId());

        } catch (IllegalStateException e) {
            // ✅ 중복 예약 등 비즈니스 로직 오류는 409 Conflict로 응답
            System.out.println("❗ 중복 예약 예외: " + e.getMessage());
            return ResponseEntity.status(409).body("예약 불가: " + e.getMessage());

        } catch (Exception e) {
            // ✅ 기타 예외는 500 에러
            System.out.println("❌ 예외 발생: " + e.getClass().getSimpleName());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("예약 생성 중 오류가 발생했습니다: " + e.getMessage());
        }

    }
/**
     * 중복예약방지
     */
   @GetMapping("/check-availability")
    public ResponseEntity<?> checkAvailability(@RequestParam("roomId") Long roomId,
                                            @RequestParam("checkIn") String checkIn,
                                            @RequestParam("checkOut") String checkOut) {
        boolean isAvailable = reservationService.isAvailable(roomId, checkIn, checkOut);
        return ResponseEntity.ok(isAvailable);
    }
}
