package com.staypick.staypick_back.dto;

import lombok.Data;

@Data
public class FindUserIdRequest {
    private String username;
    private String email;
}
