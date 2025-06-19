package com.staypick.staypick_back.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.staypick.staypick_back.dto.SeasonDTO;
import com.staypick.staypick_back.entity.Accommodation;
import com.staypick.staypick_back.entity.Season;
import com.staypick.staypick_back.repository.AccommodationRepository;
import com.staypick.staypick_back.repository.SeasonRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SeasonService {

    private final SeasonRepository seasonRepository;
    private final AccommodationRepository accommodationRepository;

    public void saveSeasons(List<SeasonDTO> seasonDTOs){
        for(SeasonDTO dto : seasonDTOs){
            Accommodation acc = accommodationRepository.findById(dto.getAccId())
                                                       .orElseThrow(() -> new RuntimeException("숙소를 찾을 수 없습니다."));
            Season season = Season.builder()
                                  .accommodation(acc)
                                  .startDate(dto.getStartDate())
                                  .endDate(dto.getEndDate())
                                  .type(dto.getType())
                                  .build();
            seasonRepository.save(season);
        }
    }

    public List<SeasonDTO> getSeasonsByAccId(Long accId){
        return seasonRepository.findByAccommodationId(accId)
                               .stream().map(SeasonDTO::new)
                               .collect(Collectors.toList());
    }

    @Transactional
    public void deleteSeasonsByAccId(Long accId){
        Accommodation acc = accommodationRepository.findById(accId).orElseThrow(() -> new RuntimeException("숙소를 찾을 수 없습니다."));
        seasonRepository.deleteByAccommodation(acc);
    }

    @Transactional
    public void deleteSeasonById(Long id){
        seasonRepository.deleteById(id);
    }
    
}
