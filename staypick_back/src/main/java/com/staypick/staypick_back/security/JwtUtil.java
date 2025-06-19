package com.staypick.staypick_back.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.staypick.staypick_back.entity.User;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import jakarta.servlet.http.HttpServletRequest;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration-time}")
    private long expirationTime;

    // SigningKey 생성
    private SecretKey getSigningKey() {
        byte[] keyBytes = secretKey.getBytes(StandardCharsets.UTF_8);
        return new SecretKeySpec(keyBytes, "HmacSHA512");
    }

    // 토큰 생성 (User 객체 기반)
    public String generateToken(User user) {
        boolean needAdditionalInfo = user.getEmail() == null || user.getBirth() == null || user.getTel() == null;
        return Jwts.builder()
                .subject(user.getUserid())  // subject: userid
                .claim("username", user.getUsername())
                .claim("role", user.getRole())
                .claim("needAdditionalInfo", needAdditionalInfo)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    // 토큰 생성 (필드 값 직접 지정)
    public String generateToken(String userid, String username, String role) {
        User tempUser = new User();
        tempUser.setUserid(userid);
        tempUser.setUsername(username);
        tempUser.setRole(role);
        return generateToken(tempUser);
    }

    // 토큰에서 사용자 ID 추출
    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // 토큰에서 역할(role) 추출
    public String extractRole(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("role", String.class);
    }

    // alias
    public String getUserIdFromToken(String token) {
        return extractUsername(token);
    }

    public String getUserid(String token) {
        return extractUsername(token);
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("JWT 검증 실패: " + e.getMessage());
            return false;
        }
    }

    // HTTP 요청에서 JWT 토큰 추출
    public String extractTokenFromRequest(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.substring(7);  // "Bearer " 이후 토큰
        }
        return null;
    }
    // HttpServletRequest로부터 토큰을 받아 userid를 추출하는 메서드
    public String getUserIdFromRequest(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        if (token != null && validateToken(token)) {
            return extractUsername(token);  // = subject = userid
        }
        throw new RuntimeException("유효하지 않은 토큰입니다.");
    }
    // Refresh Token 생성 (7일 유효)
    public String generateRefreshToken(String userid) {
        return Jwts.builder()
                .subject(userid)
                .expiration(new Date(System.currentTimeMillis() + 7 * 24 * 60 * 60 * 1000)) // 7일
                .signWith(getSigningKey())
                .compact();
    }
}
