package com.staypick.staypick_back.dto;

import java.time.LocalDate;

import com.staypick.staypick_back.entity.Season;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class SeasonDTO {
    private Long id;
    private Long accId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String type;

    public SeasonDTO(Season season){
        this.id = season.getId();
        this.accId = season.getAccommodation().getId();
        this.startDate = season.getStartDate();
        this.endDate = season.getEndDate();
        this.type = season.getType();
    }
}
