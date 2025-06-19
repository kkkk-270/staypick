package com.staypick.staypick_back.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.staypick.staypick_back.dto.EmailLog;
import com.staypick.staypick_back.dto.EmailLogDTO;
import com.staypick.staypick_back.service.EmailLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/email-log")
@RequiredArgsConstructor
public class EmailLogContorller {
    
    private final EmailLogService emailLogService;

    @PostMapping
    public ResponseEntity<EmailLog> createEmailLog(@RequestBody EmailLogDTO dto){
        EmailLog savedLog = emailLogService.saveEmailLog(dto);
        return ResponseEntity.ok(savedLog);
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkIfEmailLogExists(
        @RequestParam("email") String email,
        @RequestParam("type") String type
    ){
        boolean exists = emailLogService.existsByToEmailAndType(email, type);
        return ResponseEntity.ok(exists);
    }
}
