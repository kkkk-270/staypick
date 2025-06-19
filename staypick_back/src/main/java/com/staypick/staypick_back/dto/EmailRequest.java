package com.staypick.staypick_back.dto;

import lombok.Data;

@Data
public class EmailRequest {
    private String email;
    private String message;
}
