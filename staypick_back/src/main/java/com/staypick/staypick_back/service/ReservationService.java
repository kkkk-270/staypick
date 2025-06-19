package com.staypick.staypick_back.service;

import com.staypick.staypick_back.dto.EmailLogDTO;
import com.staypick.staypick_back.dto.ReservationDto;
import com.staypick.staypick_back.dto.ReservationRequest;
import com.staypick.staypick_back.dto.ReservationResponse;
import com.staypick.staypick_back.entity.Accommodation;
import com.staypick.staypick_back.entity.Reservation;
import com.staypick.staypick_back.entity.Room;
import com.staypick.staypick_back.entity.User;
import com.staypick.staypick_back.repository.AccommodationRepository;
import com.staypick.staypick_back.repository.ReservationRepository;
import com.staypick.staypick_back.repository.RoomRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final AccommodationRepository accommodationRepository;
    private final RoomRepository roomRepository;

    private final EmailService emailService;
    private final EmailLogService emailLogService;
    public final JavaMailSender mailSender;

    // [1] 마이페이지 예약 조회
    public List<ReservationDto> getReservationsByUser(User user) {
        System.out.println("📅 마이페이지 예약 조회: userId=" + user.getId());
        return reservationRepository.findByUserId(user.getId()).stream()
                .map(ReservationDto::from)
                .toList();
    }

    // [2] 예약 생성
    @Transactional
public Reservation createReservation(User user, ReservationRequest request) {
    System.out.println(" 예약 생성 서비스 호출");
    System.out.println(" 숙소 ID: " + request.getAccommodationId());

    Accommodation accommodation = accommodationRepository.findById(request.getAccommodationId())
            .orElseThrow(() -> new IllegalArgumentException("해당 숙소를 찾을 수 없습니다."));

    Room room = roomRepository.findById(request.getRoomId())
            .orElseThrow(() -> new IllegalArgumentException("해당 객실을 찾을 수 없습니다."));

    //  중복 예약 여부 검사
    int conflictCount = reservationRepository.countOverlappingReservations(
            room.getId(),
            LocalDate.parse(request.getCheckIn()),
            LocalDate.parse(request.getCheckOut())
    );

    if (conflictCount > 0) {
        throw new IllegalStateException("해당 객실은 이미 해당 기간에 예약이 존재합니다.");
    }

    //  정상 예약 생성
    Reservation reservation = Reservation.builder()
            .user(user)
            .accommodation(accommodation)
            .room(room)
            .roomName(room.getName())
            .checkIn(LocalDate.parse(request.getCheckIn()))
            .checkOut(LocalDate.parse(request.getCheckOut()))
            .status("예약완료")
            .guestName(request.getGuestName())
            .guestPhone(request.getGuestPhone())
            .personnel(request.getPersonnel())
            .visitMethod(request.getVisitMethod())
            .totalPrice(request.getTotalPrice())
            .build();

    System.out.println(" 예약 데이터 저장 중 ");
    return reservationRepository.save(reservation);
}


    // [3] 예약 취소
    @Transactional
    public void cancelReservation(Long reservationId, String userId) {
        System.out.println(" 예약 취소 시도: reservationId=" + reservationId + ", userId=" + userId);

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));

        if (!reservation.getUser().getUserid().equals(userId)) {
            throw new AccessDeniedException("본인의 예약만 취소할 수 있습니다.");
        }

        if ("취소됨".equals(reservation.getStatus())) {
            throw new IllegalStateException("이미 취소된 예약입니다.");
        }

        reservation.setStatus("취소됨");
        reservationRepository.save(reservation);
        System.out.println("✅ 예약 취소 완료: " + reservationId);
    }

    // [4] 예약 상세 조회
    public ReservationDto getReservationDetail(Long id) {
        System.out.println("🔍 예약 상세 조회: id=" + id);
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 예약이 존재하지 않습니다."));
        return ReservationDto.from(reservation);
    }
    //예약중복방지
    public boolean isAvailable(Long roomId, String checkIn, String checkOut) {
    return reservationRepository.countOverlappingReservations(
            roomId,
            LocalDate.parse(checkIn),
            LocalDate.parse(checkOut)
    ) == 0;
    }

    // [5] 관리자 페이지 - 숙소별 예약 내역 조회
    public List<ReservationResponse> getReservationByAccId(Long accommodationId) {
        List<Reservation> reservations = reservationRepository.findByAccommodationIdOrderByCheckInAscCheckOutAscRoomIdAsc(accommodationId);
        return reservations.stream().map(ReservationResponse::from).collect(Collectors.toList());
    }

    // [6] 관리자 페이지 - 예약 상태 변경
    @Transactional
    public void updateStatus(Long id, String status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 예약이 존재하지 않습니다."));
        reservation.setStatus(status);
        reservationRepository.save(reservation);
    }

    // [7] 관리자 페이지 - 지난 예약 자동 상태 변경
@Scheduled(cron = "0 0 11 * * *") // 매일 오전 11시 실행
public void updatePastReservations() {
    List<Reservation> reservations = reservationRepository.findAll();
    LocalDateTime now = LocalDateTime.now();

    for (Reservation res : reservations) {
        // ✅ [1] room 정보가 없을 경우 건너뜀 (NullPointer 방지)
        if (res.getRoom() == null) {
            System.out.println("⚠️ 객실 정보가 없는 예약 (예약 ID: " + res.getId() + ") → 처리 건너뜀");
            continue;
        }

        // ✅ [2] 체크아웃 시간 문자열이 null일 경우 기본값으로 대체
        String checkOutTimeStr = res.getRoom().getCheckout();
        if (checkOutTimeStr == null || checkOutTimeStr.isBlank()) {
            System.out.println("⚠️ checkout 시간 누락 (room ID: " + res.getRoom().getId() + ") → 기본값 11:00 적용");
            checkOutTimeStr = "11:00";
        }

        LocalTime checkOutTime;
        try {
            checkOutTime = LocalTime.parse(checkOutTimeStr);
        } catch (Exception e) {
            System.out.println("❗ checkout 시간 파싱 오류: " + checkOutTimeStr + " → 기본값 11:00 적용");
            checkOutTime = LocalTime.of(11, 0);
        }

        LocalDateTime checkOutDateTime = LocalDateTime.of(res.getCheckOut(), checkOutTime);

        // ✅ [3] 현재 시각 기준으로 체크아웃이 지났고, 아직 상태가 past가 아니면 업데이트
        if (checkOutDateTime.isBefore(now) && !"past".equals(res.getStatus())) {
            res.setStatus("past");
            reservationRepository.save(res);
            System.out.println("✅ 예약 상태 업데이트 완료 (예약 ID: " + res.getId() + ")");
        }
    }
}

    // [8] 관리자 페이지 - 예약 알림 메일 발송
    public void sendEmailToGuest(Long reservationId, String recipientEmail, String message) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(recipientEmail);
        mailMessage.setSubject("[예약 안내] 관련 안내사항입니다.");
        mailMessage.setText(message);
        mailSender.send(mailMessage);
    }

    // [9] 예약 취소 후 이메일 알림 + 로그 저장
    public void cancelReservationAndNotify(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("예약을 찾을 수 없습니다."));
        reservation.setStatus("cancelled");
        reservationRepository.save(reservation);

        String toEmail = reservation.getUser().getEmail();
        String subject = "[예약취소안내] " + reservation.getGuestName() + "님의 예약이 취소되었습니다.";
        String content = reservation.getGuestName() + "님, 예약이 성공적으로 취소되었습니다.\n"
                + "예약 날짜: " + reservation.getCheckIn() + " ~ " + reservation.getCheckOut()
                + "\n객실명: " + reservation.getRoom().getName() + " (" + reservation.getRoom().getRoomNumber() + ")"
                + "\n이용해주셔서 감사합니다.";

        try {
            emailService.sendEmail(toEmail, subject, content);
            EmailLogDTO log = EmailLogDTO.builder()
                    .toEmail(toEmail)
                    .subject(subject)
                    .type("예약취소")
                    .success(true)
                    .sendAt(LocalDateTime.now())
                    .build();
            emailLogService.saveEmailLog(log);
        } catch (Exception e) {
            EmailLogDTO log = EmailLogDTO.builder()
                    .toEmail(toEmail)
                    .subject(subject)
                    .type("예약취소")
                    .success(false)
                    .sendAt(LocalDateTime.now())
                    .errorMessage(e.getMessage())
                    .build();
            emailLogService.saveEmailLog(log);
        }
    }
}