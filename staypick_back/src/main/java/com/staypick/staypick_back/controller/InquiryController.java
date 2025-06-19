package com.staypick.staypick_back.controller;

import com.staypick.staypick_back.dto.InquiryRequest;
import com.staypick.staypick_back.dto.InquiryResponse;
import com.staypick.staypick_back.security.JwtUtil;
import com.staypick.staypick_back.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryService inquiryService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<String> create(HttpServletRequest request,
                                         @RequestBody InquiryRequest dto) {
        String userId = jwtUtil.getUserIdFromRequest(request);
        if (userId == null || userId.isEmpty()) {
            // 로그 찍기 or 예외 던지기
            throw new IllegalArgumentException("사용자 인증 정보가 없습니다.");
        }
        inquiryService.createInquiry(userId, dto);
        return ResponseEntity.ok("문의 등록 완료");
    }

    @GetMapping
    public ResponseEntity<List<InquiryResponse>> getMyInquiries(HttpServletRequest request) {
        String userId = jwtUtil.getUserIdFromRequest(request);
        List<InquiryResponse> inquiries = inquiryService.getInquiriesByUser(userId);
        return ResponseEntity.ok(inquiries);
    }
    
}
