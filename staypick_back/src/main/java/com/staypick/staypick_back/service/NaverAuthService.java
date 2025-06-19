package com.staypick.staypick_back.service;

import java.util.Map;
import java.util.HashMap;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.staypick.staypick_back.util.NaverProperties;

@Service
public class NaverAuthService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final NaverProperties naverProperties;

    public NaverAuthService(NaverProperties naverProperties){
        this.naverProperties = naverProperties;
    }

    // accessToken이 있으면 바로 조회, 없으면 code/state로 발급 후 조회
    public Map<String, Object> getNaverUserInfo(String code, String state, String accessToken) {
        if (accessToken == null || accessToken.isBlank()) {
            accessToken = getAccessTokenFromNaver(code, state);
        }

        return getUserInfoFromNaver(accessToken);
    }

    // access token 발급
    private String getAccessTokenFromNaver(String code, String state) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", naverProperties.getClientId());
        params.add("client_secret", naverProperties.getClientSecret());
        params.add("code", code);
        params.add("state", state);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            "https://nid.naver.com/oauth2.0/token",
            HttpMethod.POST,
            request,
            new ParameterizedTypeReference<>() {}
        );

        Map<String, Object> responseBody = response.getBody();
        String token = (String) responseBody.get("access_token");

        if (token == null) {
            System.err.println("❌ 액세스 토큰 발급 실패: " + responseBody);
            throw new RuntimeException("네이버 액세스 토큰 발급 실패");
        }

        return token;
    }

    // 사용자 정보 조회
    private Map<String, Object> getUserInfoFromNaver(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers);

        ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
            "https://openapi.naver.com/v1/nid/me",
            HttpMethod.GET,
            request,
            new ParameterizedTypeReference<>() {}
        );

        Map<String, Object> body = response.getBody();
        System.out.println("📦 네이버 사용자 응답: " + body);

        if (body == null || !"00".equals(body.get("resultcode"))) {
            throw new RuntimeException("네이버 사용자 정보 조회 실패");
        }

        @SuppressWarnings("unchecked")
        Map<String, Object> raw = (Map<String, Object>) body.get("response");

        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("userid", "naver_" + raw.get("id"));
        userInfo.put("username", raw.get("name"));
        userInfo.put("email", raw.get("email"));

        return userInfo;
    }
}
