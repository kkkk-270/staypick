package com.staypick.staypick_back.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.staypick.staypick_back.dto.AccommodationDTO;
import com.staypick.staypick_back.dto.AccommodationUpdateRequest;
import com.staypick.staypick_back.dto.BizAccommodationDTO;
import com.staypick.staypick_back.dto.EmailRequest;
import com.staypick.staypick_back.dto.ReservationResponse;
import com.staypick.staypick_back.dto.RoomDiscountCreateRequest;
import com.staypick.staypick_back.dto.RoomDiscountDTO;
import com.staypick.staypick_back.dto.RoomDiscountUpdateRequest;
import com.staypick.staypick_back.dto.RoomPriceUpdateRequest;
import com.staypick.staypick_back.dto.RoomResponseDTO;
import com.staypick.staypick_back.dto.RoomStatusUpdateRequest;
import com.staypick.staypick_back.dto.RoomUpdateRequest;
import com.staypick.staypick_back.dto.SeasonDTO;
import com.staypick.staypick_back.entity.Accommodation;
import com.staypick.staypick_back.entity.RoomStatus;
import com.staypick.staypick_back.entity.User;
import com.staypick.staypick_back.repository.UserRepository;
import com.staypick.staypick_back.security.JwtUtil;
import com.staypick.staypick_back.service.AccommodationService;
import com.staypick.staypick_back.service.BizAccommodationService;
import com.staypick.staypick_back.service.ReservationService;
import com.staypick.staypick_back.service.RoomService;
import com.staypick.staypick_back.service.RoomStatusService;
import com.staypick.staypick_back.service.SeasonService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {
    
    private final UserRepository userRepository;
    private final BizAccommodationService bizAccommodationService;
    private final RoomService roomService;
    private final ReservationService reservationService;
    private final RoomStatusService statusService;
    private final SeasonService seasonService;
    private final AccommodationService accommodationService;
    private final JwtUtil jwtUtil;

    //관리자 대시보드
    @GetMapping("/dashboard")
    public ResponseEntity<String> dashboard(@AuthenticationPrincipal User adminUser){
        return ResponseEntity.ok("✅ 관리자 대시보드 접근 성공! 안녕하세요, " + adminUser.getUsername() + "님.");
    }

    //예약 내역
    @GetMapping("/reservation/{id}")
    public ResponseEntity<List<ReservationResponse>> getReservation(@PathVariable("id") Long id, HttpServletRequest request) {
        String token = jwtUtil.extractTokenFromRequest(request);
        if(token == null || !jwtUtil.validateToken(token)){
            return ResponseEntity.status(401).build();
        }

        String userid = jwtUtil.getUserid(token);
        User user = userRepository.findByUserid(userid).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if(!"ADMIN".equals(user.getRole())){
            return ResponseEntity.status(403).build();
        }

        List<ReservationResponse> reservations = reservationService.getReservationByAccId(id);
        return ResponseEntity.ok(reservations);
    }

    //예약 안내 메일 전송
    @PostMapping("/reservation/{id}/notify")
    public ResponseEntity<String> notifyGuest(
        @PathVariable("id") Long id,
        @RequestBody EmailRequest emailRequest
    ){
        reservationService.sendEmailToGuest(id, emailRequest.getEmail(), emailRequest.getMessage());
        return ResponseEntity.ok("메일 전송 완료");
    }

    //예약 상태 변경
    @PatchMapping("/reservation/{id}/cancel")   //예약 취소
    public ResponseEntity<?> cancelReservation(@PathVariable("id") Long id, @RequestHeader("Authorization") String token){
        reservationService.updateStatus(id, "cancelled");
        
        try{
            reservationService.cancelReservationAndNotify(id);
        }catch(Exception e){
            System.err.println("예약 취소 알림 메일 발송 실패: " + e.getMessage());
        }
        
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/reservation/{id}/checkin")    //체크인
    public ResponseEntity<?> checkinReservation(@PathVariable("id") Long id) {
        reservationService.updateStatus(id, "checkedin");
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reservation/update-past-status")
    public ResponseEntity<String> updatePastReservationStatus(){
        reservationService.updatePastReservations();
        return ResponseEntity.ok("예약 상태가 업데이트 되었습니다.");
    }

    //숙소 운영 상태 변경 및 불러오기
    @GetMapping("/weekly-status")
    public ResponseEntity<?> getWeeklyRoomStatus(
        @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
        @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ){
        Map<Long, Map<String, String>> statusMap = statusService.getWeeklyRoomStatus(start, end);
        return ResponseEntity.ok(statusMap);
    }

    @PostMapping("/room-status/update")
    public ResponseEntity<?> updateStatus(@RequestBody RoomStatusUpdateRequest request){
        RoomStatus updatedStatus = statusService.updateRoomStatus(
            request.getRoomId(),
            request.getDate(),
            request.getStatus()
        );
        return ResponseEntity.ok(updatedStatus);
    }


    //업주가 운영하는 숙소
    @GetMapping("/accommodation")
    public ResponseEntity<BizAccommodationDTO> getBizAccommodation(HttpServletRequest request){
        String token = jwtUtil.extractTokenFromRequest(request);
        if(token == null || !jwtUtil.validateToken(token)){
            return ResponseEntity.status(401).build();
        }

        String userid = jwtUtil.getUserid(token);
        User user = userRepository.findByUserid(userid).orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if(!"ADMIN".equals(user.getRole())){
            return ResponseEntity.status(403).build();
        }

        BizAccommodationDTO dto = bizAccommodationService.getAccommodationByUser(user);
        return ResponseEntity.ok(dto);
    }

    //숙소 정보 관리
    @GetMapping("/accommodation/{id}")
    public ResponseEntity<?> getAccommodationById(@PathVariable("id") Long id){
        try {
            Accommodation accommodation = accommodationService.findById(id);
            if(accommodation == null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
            return ResponseEntity.ok(new AccommodationDTO(accommodation));
        } catch(Exception e){
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("숙소 조회 실패: " + e.getMessage());
        }
    }

    //숙소 정보 변경
    @PutMapping("/accommodation/{id}")
    public ResponseEntity<?> updateAccommodation(@PathVariable("id") Long id, @RequestBody AccommodationUpdateRequest request){
        try{
            request.setId(id);
            Accommodation updated = accommodationService.updateAccommodation(request);
            return ResponseEntity.ok(new AccommodationDTO(updated));
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("숙소 정보 수정 실패: " + e.getMessage());
        }
    }

    //시즌 기간 저장(성수기/주말 등)
    @PostMapping("/season/save")
    public ResponseEntity<?> saveSeasonPeriods(@RequestBody List<SeasonDTO> seasonDTOs){
        if(seasonDTOs == null || seasonDTOs.isEmpty()){
            return ResponseEntity.badRequest().body("저장할 데이터가 없습니다.");
        }
        Long accId = seasonDTOs.get(0).getAccId();
        if(accId == null){
            return ResponseEntity.badRequest().body("accId가 누락되었습니다.");
        }
        seasonService.deleteSeasonsByAccId(accId);
        seasonService.saveSeasons(seasonDTOs);

        List<SeasonDTO> saved = seasonService.getSeasonsByAccId(accId);
        return ResponseEntity.ok(saved);
    }

    //시즌 기간 조회
    @GetMapping("/season")
    public List<SeasonDTO> getSeasons(@RequestParam("accId") Long accId){
        return seasonService.getSeasonsByAccId(accId);
    }

    //시즌 기간 삭제
    @DeleteMapping("/season/{id}")
    public ResponseEntity<?> deleteSeasonById(@PathVariable("id") Long id){
        seasonService.deleteSeasonById(id);
        return ResponseEntity.ok().build();
    }

    //객실 리스트 조회
    @GetMapping("/room/list")
    public ResponseEntity<List<RoomResponseDTO>> getRoomsByAccommodation(@RequestParam("accId") Long accId){
        List<RoomResponseDTO> rooms = roomService.getRoomsByAccommodationId(accId);
        return ResponseEntity.ok(rooms);
    }

    //객실 기본 요금 수정
    @PutMapping("/room/price")
    public ResponseEntity<?> updateRoomPrice(@RequestBody RoomPriceUpdateRequest requestDto){
        roomService.updateRoomPrice(requestDto);
        return ResponseEntity.ok("요금이 성공적으로 수정되었습니다.");
    }

    //객실 정보 수정
    @PutMapping("/room/modify")
    public ResponseEntity<String> updateRoomInfo(@RequestBody RoomUpdateRequest request){
        try {
            roomService.updateRoomInfo(request);
            return ResponseEntity.ok("수정 완료");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body("수정 실패: " + e.getMessage());
        } 
    }

    //객실 할인 목록 조회
    @GetMapping("/room/discount/list")
    public ResponseEntity<List<RoomDiscountDTO>> getRoomDiscount(@RequestParam("accId") Long accId){
        return ResponseEntity.ok(roomService.getRoomDiscountsByAccommodationId(accId));
    }

    //객실 할인 추가
    @PostMapping("/room/discount")
    public ResponseEntity<?> addRoomDiscount(@RequestBody RoomDiscountCreateRequest request){
        try{
            RoomDiscountDTO savedDiscount = roomService.addRoomDiscount(request);
            return ResponseEntity.ok(savedDiscount);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("객실 할인 정보 추가 실패: " + e.getMessage());
        }
    }

    //객실 할인 수정
    @PutMapping("room/discount")
    public ResponseEntity<?> updateRoomDiscount(@RequestBody RoomDiscountUpdateRequest request){
        try{
            roomService.updateRoomDiscount(request);
            return ResponseEntity.ok("할인가 수정 성공");
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("할인가 수정 실패: " + e.getMessage());
        }
    }

    //객실 할인 삭제
    @DeleteMapping("/room/discount/{id}")
    public ResponseEntity<?> deleteRoomDiscount(@PathVariable("id") Long id){
        try{
            roomService.deleteRoomDiscount(id);
            return ResponseEntity.ok("객실 할인 정보가 삭제되었습니다.");
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("객실 할인 정보 삭제 실패: " + e.getMessage());
        }
    }

    
}
