package com.staypick.staypick_back.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.staypick.staypick_back.dto.EmailLog;
import com.staypick.staypick_back.dto.EmailLogDTO;
import com.staypick.staypick_back.repository.EmailLogRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailLogService {

    private final EmailLogRepository emailLogRepository;

    public EmailLog saveEmailLog(EmailLogDTO emailLogDTO){
        EmailLog emailLog = EmailLog.builder()
            .toEmail(emailLogDTO.getToEmail())
            .subject(emailLogDTO.getSubject())
            .type(emailLogDTO.getType())
            .success(emailLogDTO.isSuccess())
            .sendAt(emailLogDTO.getSendAt() != null ? emailLogDTO.getSendAt() : LocalDateTime.now())
            .errorMessage(emailLogDTO.getErrorMessage())
            .build();
        
        return emailLogRepository.save(emailLog);
    }

    public boolean existsByToEmailAndType(String email, String type){
        return emailLogRepository.existsByToEmailAndType(email, type);
    }

}
