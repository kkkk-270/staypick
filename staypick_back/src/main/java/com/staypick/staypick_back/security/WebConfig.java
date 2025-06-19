package com.staypick.staypick_back.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // React SPA 라우팅 설정
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addViewController("/{spring:[\\w\\-]+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/**/{spring:[\\w\\-]+}")
                .setViewName("forward:/index.html");
       
    }

    // 정적 자원 핸들링
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        //  /assets 경로 처리 추가
        registry.addResourceHandler("/assets/**")
                .addResourceLocations("classpath:/static/assets/");

        // admin/data 경로의 정적 JSON 파일 핸들링
        registry.addResourceHandler("/admin/data/**")
                .addResourceLocations("classpath:/static/admin/data/");

        // 리뷰 이미지 (로컬 파일 시스템)
        registry.addResourceHandler("/upload/reviews/**")
                .addResourceLocations("file:upload/reviews/");

        // 기타 업로드 리소스
        registry.addResourceHandler("/upload/**")
                .addResourceLocations("classpath:/static/upload/");
    }
}