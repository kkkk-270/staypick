package com.staypick.staypick_back.dto;

import lombok.Data;

@Data
public class FindPasswordRequest {
    private String userid;
    private String username;
    private String email;
}
