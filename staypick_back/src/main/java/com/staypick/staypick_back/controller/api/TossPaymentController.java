package com.staypick.staypick_back.controller.api;

import com.staypick.staypick_back.dto.TossPaymentConfirmRequest;
import com.staypick.staypick_back.dto.TossPaymentPrepareRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@RestController
@RequestMapping("/api/toss")
@RequiredArgsConstructor
public class TossPaymentController {

    @Value("${toss.secret.key}")
    private String secretKey;

    private final RestTemplate restTemplate;

    @PostMapping("/prepare-payment")
    public ResponseEntity<Map<String, Object>> preparePayment(@RequestBody TossPaymentPrepareRequest request) {
        String orderId = UUID.randomUUID().toString();
        String orderName = sanitizeOrderName(request.getOrderName());

        Map<String, Object> payload = new HashMap<>();
        payload.put("amount", request.getAmount());
        payload.put("orderId", orderId);
        payload.put("orderName", orderName);
        payload.put("customerName", request.getCustomerName());
        payload.put("customerEmail", request.getCustomerEmail());
        payload.put("successUrl", request.getSuccessUrl());
        payload.put("failUrl", request.getFailUrl());
        payload.put("method", request.getMethod() != null ? request.getMethod() : "card"); // null 방지

        // Optional 필드 추가 (Toss에 따라 영향 줄 수 있음)
        payload.put("customerName", "테스트유저");
        payload.put("customerEmail", "test@staypick.com");

        HttpHeaders headers = createTossHeaders();

        log.info("🟨 결제 요청 시작");
        log.info("orderId = {}", orderId);
        log.info("orderName = {}", orderName);
        log.info("amount = {}", request.getAmount());
        log.info("payload = {}", payload);
        log.info("headers = {}", headers);

        try {
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                "https://api.tosspayments.com/v1/payments",
                HttpMethod.POST,
                entity,
                Map.class 
            );

            log.info("✅ Toss 응답 상태: {}", response.getStatusCode());
            log.info("✅ Toss 응답 바디: {}", response.getBody());
            log.info("✅ Toss 응답 헤더: {}", response.getHeaders());
                Map<String, Object> body = response.getBody();
                Map<String, Object> checkout = (Map<String, Object>) body.get("checkout");
                String paymentUrl = checkout != null ? (String) checkout.get("url") : null;
            return ResponseEntity.ok(Map.of(
                "paymentUrl", paymentUrl
            ));
        } catch (HttpStatusCodeException e) {
            log.error("❌ Toss 오류 상태코드: {}", e.getStatusCode());
            log.error("❌ Toss 응답 바디: {}", e.getResponseBodyAsString());
            log.error("❌ Toss 응답 헤더: {}", e.getResponseHeaders());
            return errorResponse("결제 준비 중 오류 발생", e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("❌ 예외 발생: {}", e.getMessage(), e);
            return errorResponse("결제 준비 중 서버 오류 발생", e.getMessage());
        }
    }

   @PostMapping("/confirm")
public ResponseEntity<Map<String, Object>> confirmPayment(@RequestBody TossPaymentConfirmRequest request) {
    Map<String, Object> payload = Map.of(
        "paymentKey", request.getPaymentKey(),
        "orderId", request.getOrderId(),
        "amount", Integer.parseInt(request.getAmount())
    );

    try {
        ResponseEntity<Map> response = restTemplate.postForEntity(
            "https://api.tosspayments.com/v1/payments/confirm",
            new HttpEntity<>(payload, createTossHeaders()),
            Map.class
        );

        log.info("✅ [Toss 결제 승인] 응답: {}", response.getBody());

        return ResponseEntity.ok(Map.of(
            "result", "success",
            "response", response.getBody()
        ));
    } catch (HttpStatusCodeException e) {
        log.error("❌ Toss 승인 실패 상태코드: {}", e.getStatusCode());
        log.error("❌ Toss 승인 실패 응답 바디: {}", e.getResponseBodyAsString());
        return errorResponse("결제 승인 실패", e.getResponseBodyAsString());
    } catch (Exception e) {
        log.error("❌ 승인 중 예외 발생: {}", e.getMessage(), e);
        return errorResponse("결제 승인 중 서버 오류 발생", e.getMessage());
    }
}

    private HttpHeaders createTossHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBasicAuth(secretKey, ""); // Toss는 ID에만 시크릿 키를 사용하고 PW는 비워둠
        return headers;
    }

    private String sanitizeOrderName(String name) {
        if (name == null || name.isBlank()) return "스테이픽 숙소 예약 1박";

        String cleaned = name.replaceAll("[^가-힣a-zA-Z0-9\\s]", "")
                             .replaceAll("\\s+", " ")
                             .trim();

        byte[] bytes = cleaned.getBytes(StandardCharsets.UTF_8);
        if (bytes.length <= 90) return cleaned;

        int byteLength = 0;
        StringBuilder result = new StringBuilder();
        for (char c : cleaned.toCharArray()) {
            byteLength += String.valueOf(c).getBytes(StandardCharsets.UTF_8).length;
            if (byteLength > 90) break;
            result.append(c);
        }
        return result.toString();
    }

    private ResponseEntity<Map<String, Object>> errorResponse(String msg, String detail) {
        log.error("❌ {}: {}", msg, detail);
        return ResponseEntity.status(500).body(Map.of("error", msg, "detail", detail));
    }
}
