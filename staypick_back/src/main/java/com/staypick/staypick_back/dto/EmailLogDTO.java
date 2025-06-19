package com.staypick.staypick_back.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmailLogDTO {
    private Long id;
    private String toEmail;
    private String subject;
    private String type;
    private boolean success;
    private LocalDateTime sendAt;
    private String errorMessage;
}
