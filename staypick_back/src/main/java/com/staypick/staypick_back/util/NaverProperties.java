package com.staypick.staypick_back.util;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;
import lombok.ToString;

@Data
@ToString(exclude = "clientSecret")
@Configuration
@ConfigurationProperties(prefix = "naver")
public class NaverProperties {
    private String clientId;
    private String clientSecret;
}
