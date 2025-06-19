package com.staypick.staypick_back.dto;

import com.staypick.staypick_back.entity.Room;

import lombok.Data;

@Data
public class RoomDTO {
    private Long id;
    private String name;
    private Integer roomNumber;
    private Integer price;
    private Integer weekendPrice;
    private Integer peakPrice;
    private Integer holidayPrice;
    private String image;
    private String checkin;
    private String checkout;
    private Integer personnel;
    private String extra;
    private Integer discountPrice;
    private Long accommodationId;
    private String roomType; 

    public RoomDTO(Room room){
        this.id = room.getId();
        this.name = room.getName();
        this.roomNumber = room.getRoomNumber();
        this.price = room.getPrice();
        this.weekendPrice = room.getWeekendPrice();
        this.peakPrice = room.getPeakPrice();
        this.holidayPrice = room.getWeekendPrice();
         this.image = room.getImage();
        this.checkin = room.getCheckin();
        this.checkout = room.getCheckout();
        this.personnel = room.getPersonnel();
        this.extra = room.getExtra();
        this.discountPrice = room.getDiscountPrice();
        this.roomType = room.getRoomType(); 
        this.accommodationId = room.getAccommodation().getId();
    }
}
