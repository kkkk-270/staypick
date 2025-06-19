package com.staypick.staypick_back.controller;

import com.staypick.staypick_back.dto.InquiryResponse;
import com.staypick.staypick_back.service.InquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/inquiries")
@RequiredArgsConstructor
public class AdminInquiryController {

    private final InquiryService inquiryService;

    @GetMapping
    public ResponseEntity<List<InquiryResponse>> getAllInquiries() {
        List<InquiryResponse> inquiries = inquiryService.getAllInquiries();
        return ResponseEntity.ok(inquiries);
    }

    @PatchMapping("/{id}/reply")
    public ResponseEntity<String> addReply(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        inquiryService.addCommentToInquiry(id, payload.get("comment"));
        return ResponseEntity.ok("답변 저장 완료");
    }
    
}
