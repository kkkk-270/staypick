package com.staypick.staypick_back.security;

import java.nio.charset.StandardCharsets;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
public RestTemplate restTemplate() {
    RestTemplate restTemplate = new RestTemplate();

    // UTF-8 인코딩 및 JSON 대응 설정
    MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter();
    jsonConverter.setDefaultCharset(StandardCharsets.UTF_8);
    jsonConverter.setSupportedMediaTypes(List.of(MediaType.APPLICATION_JSON));

    restTemplate.setMessageConverters(List.of(jsonConverter));

    return restTemplate;
}
}
