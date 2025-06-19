package com.staypick.staypick_back.dto;

import com.staypick.staypick_back.entity.Accommodation;
import com.staypick.staypick_back.entity.Reservation;
import lombok.Data;

@Data
public class ReservationDto {
    private Long id;
    private Long roomId;
    private String roomName;
    private String checkIn;
    private String checkOut;
    private String status;
    private String accommodationName; // 숙소 이름
    private String thumbnail;         // 숙소 썸네일

    public static ReservationDto from(Reservation r) {
        ReservationDto dto = new ReservationDto();

        dto.setId(r.getId());

        // ⚠️ Lazy 로딩 예외 방지: Room 대신 roomName 필드 활용
        dto.setRoomId(r.getRoom() != null ? r.getRoom().getId() : null);
        dto.setRoomName(r.getRoomName() != null ? r.getRoomName() : "객실 정보 없음");

        dto.setCheckIn(r.getCheckIn() != null ? r.getCheckIn().toString() : "날짜 정보 없음");
        dto.setCheckOut(r.getCheckOut() != null ? r.getCheckOut().toString() : "날짜 정보 없음");
        dto.setStatus(r.getStatus() != null ? r.getStatus() : "상태 정보 없음");

        Accommodation acc = r.getAccommodation();
        dto.setAccommodationName(acc != null ? acc.getName() : "숙소 정보 없음");
        dto.setThumbnail(acc != null ? acc.getThumbnail() : null);

        return dto;
    }
}
