package com.staypick.staypick_back.dto;

import com.staypick.staypick_back.entity.Room;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponseDTO {
    private Long id;
    private Long accId;
    private String roomName;
    private Integer roomNumber;
    private String roomType;
    private Integer personnel;
    private String extra;
    private Integer price;
    private Integer weekendPrice;
    private Integer peakPrice;
    private Integer discountPrice;
    private String image;
    private String checkin;   // ✅ 추가
    private String checkout;  // ✅ 추가

    public RoomResponseDTO(Room room) {
        this.id = room.getId();
        this.accId = room.getAccommodation().getId();
        this.roomName = room.getName();
        this.roomNumber = room.getRoomNumber();
        this.roomType = room.getRoomType();
        this.personnel = room.getPersonnel();
        this.extra = room.getExtra();
        this.price = room.getPrice();
        this.weekendPrice = room.getWeekendPrice();
        this.peakPrice = room.getPeakPrice();
        this.discountPrice = room.getDiscountPrice();
        this.image = room.getImage();
        this.checkin = room.getCheckin();     // ✅ 매핑 추가
        this.checkout = room.getCheckout();   // ✅ 매핑 추가
    }
}
