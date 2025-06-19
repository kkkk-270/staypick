package com.staypick.staypick_back.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

   @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            // 인증 없이 접근 허용
            .requestMatchers("/api/auth/**", "/upload/**", "/login/naver/callback").permitAll()
            .requestMatchers(HttpMethod.GET, "/upload/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/api/accommodations/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/data/**").permitAll()
            .requestMatchers(HttpMethod.GET, "/admin/data/**").permitAll()
            
            // ✅ 중복 예약 체크 API는 로그인 없이도 허용
            .requestMatchers(HttpMethod.GET, "/api/mypage/reservations/check-availability").permitAll()

            // 프론트 라우팅 허용
            .requestMatchers("/", "/mypage", "/mypage/**", "/detail/**", "/hotellist", "/login", "/register", "/board").permitAll()

            // 인증 필요한 경로
            .requestMatchers("/api/admin/**").hasAuthority("ROLE_ADMIN")
            .requestMatchers("/api/mypage/**").authenticated()
            .requestMatchers("/admin/**").hasAuthority("ROLE_ADMIN")

            // 나머지는 모두 허용
            .anyRequest().permitAll()
        )
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

    // CORS 설정 (프론트와 통신 허용)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173")); // 프론트 주소
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // 비밀번호 암호화
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
