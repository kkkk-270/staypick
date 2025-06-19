package com.staypick.staypick_back.service;

import org.springframework.stereotype.Service;

import com.staypick.staypick_back.dto.BizAccommodationDTO;
import com.staypick.staypick_back.entity.BizAccommodation;
import com.staypick.staypick_back.entity.User;
import com.staypick.staypick_back.repository.BizAccommodationRepository;
import com.staypick.staypick_back.repository.UserRepository;
import com.staypick.staypick_back.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BizAccommodationService {
    private final BizAccommodationRepository bizAccommodationRepository;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public BizAccommodationDTO getAccommodationForADMIN(HttpServletRequest request){
        String token = jwtUtil.extractTokenFromRequest(request);
        String userid = jwtUtil.getUserid(token);
        User user = userRepository.findByUserid(userid).orElseThrow(() -> new RuntimeException("User not found"));

        if(!"ADMIN".equals(user.getRole())){
            throw new IllegalArgumentException("Not a ADMIN");
        }

        BizAccommodation bizaccommodation = bizAccommodationRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Accommodation not found for this user"));

        return BizAccommodationDTO.fromEntity(bizaccommodation.getAccommodation());
    }

    public BizAccommodationDTO getAccommodationByUser(User user){
        return bizAccommodationRepository
               .findByUser(user)
               .map(bizAcc -> BizAccommodationDTO.fromEntity(bizAcc.getAccommodation()))
               .orElseThrow(() -> new RuntimeException("숙소 정보가 존재하지 않습니다."));
    }
}
