package com.staypick.staypick_back.dto;

import java.util.List;

import lombok.Data;

@Data
public class RoomUpdateRequest {
    private String originalGroupType;
    private String newRoomType;
    private List<Long> roomIds;
    private List<Integer> roomNumbers;
    private Integer personnel;
    private String extra;
}
