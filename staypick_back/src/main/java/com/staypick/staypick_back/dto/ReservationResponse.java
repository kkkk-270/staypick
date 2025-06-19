package com.staypick.staypick_back.dto;

import com.staypick.staypick_back.entity.Reservation;

import lombok.Data;

@Data
public class ReservationResponse {
    private Long id;
    private Long accommodationId;
    private Long roomId;
    private Long userId;
    private String roomName;
    private int roomNumber;
    private String roomCheckIn;
    private String roomCheckOut;
    private String checkIn;
    private String checkOut;
    private String status;
    private String guestName;
    private String guestPhone;
    private String guestEmail;
    private String createdAt;
    private int personnel;
    private int totalPrice;
    private String paymentMethod;
    private String accommodationName;
    private String thumbnail;

    public static ReservationResponse from(Reservation r){
        ReservationResponse dto = new ReservationResponse();
        dto.setId(r.getId());
        dto.setGuestName(r.getGuestName());
        dto.setGuestPhone(r.getGuestPhone());
        dto.setPersonnel(r.getPersonnel());
        dto.setCheckIn(r.getCheckIn().toString());
        dto.setCheckOut(r.getCheckOut().toString());
        dto.setStatus(r.getStatus());
        dto.setCreatedAt(r.getCreatedAt().toString());
        dto.setTotalPrice(r.getTotalPrice());
        dto.setPaymentMethod(r.getPaymentMethod());

        if(r.getUser() != null){
            dto.setUserId(r.getUser().getId());
            dto.setGuestEmail(r.getUser().getEmail());
        }

        if(r.getRoom() != null){
            dto.setRoomId(r.getRoom().getId());
            dto.setRoomName(r.getRoom().getName());
            dto.setRoomNumber(r.getRoom().getRoomNumber());
            dto.setRoomCheckIn(r.getRoom().getCheckin());
            dto.setRoomCheckOut(r.getRoom().getCheckout());
        }

        if(r.getAccommodation() != null){
            dto.setAccommodationId(r.getAccommodation().getId());
            dto.setAccommodationName(r.getAccommodation().getName());
            dto.setThumbnail(r.getAccommodation().getThumbnail());
        }

        return dto;
    }
}