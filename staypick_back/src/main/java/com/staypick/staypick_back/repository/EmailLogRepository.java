package com.staypick.staypick_back.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.staypick.staypick_back.dto.EmailLog;

@Repository
public interface EmailLogRepository extends JpaRepository<EmailLog, Long> {
    boolean existsByToEmailAndType(String toEmail, String type);
}
