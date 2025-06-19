package com.staypick.staypick_back.dto;

import com.staypick.staypick_back.entity.Accommodation;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BizAccommodationDTO {
    private Long accId;
    private String accName;

    public static BizAccommodationDTO fromEntity(Accommodation accommodation){
        BizAccommodationDTO dto = new BizAccommodationDTO();
        dto.setAccId(accommodation.getId());
        dto.setAccName(accommodation.getName());
        return dto;
    }
}
