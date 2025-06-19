package com.staypick.staypick_back.controller;

import com.staypick.staypick_back.dto.FindPasswordRequest;
import com.staypick.staypick_back.dto.FindUserIdRequest;
import com.staypick.staypick_back.dto.FindUserIdResponse;
import com.staypick.staypick_back.dto.KakaoLoginRequest;
import com.staypick.staypick_back.dto.ResetPasswordRequest;
import com.staypick.staypick_back.entity.User;
import com.staypick.staypick_back.repository.UserRepository;
import com.staypick.staypick_back.security.JwtUtil;
import com.staypick.staypick_back.service.KakaoAuthService;
import com.staypick.staypick_back.service.NaverAuthService;
import com.staypick.staypick_back.service.PasswordResetService;
import com.staypick.staypick_back.service.UserService;

import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final KakaoAuthService kakaoAuthService;
    private final NaverAuthService naverAuthService;
    private final PasswordResetService resetService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final Logger logger = LoggerFactory.getLogger(UserController.class);

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody Map<String, String> registerData, HttpServletRequest request) {
        try {
            if (!registerData.get("password").equals(registerData.get("inputRepw"))) {
                throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            }

            LocalDate birth = parseBirth(registerData.get("birth"));

            userService.register(
                    request,
                    registerData.get("username"),
                    birth != null ? birth.atStartOfDay() : null,
                    registerData.get("userid"),
                    registerData.get("password"),
                    registerData.get("email"),
                    registerData.get("tel")
            );
            return ResponseEntity.ok("회원가입 성공");
        } catch (IllegalArgumentException e) {
            logger.error("회원가입 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            logger.error("회원가입 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패");
        }
    }

    @PostMapping("/kakao-login")
    public ResponseEntity<?> kakaoLogin(@RequestBody KakaoLoginRequest request) {
        try {
            Map<String, Object> kakaoUserInfo = kakaoAuthService.getKakaoUserInfo(request.getAccessToken());
            String userid = "kakao_" + kakaoUserInfo.get("id").toString();

            Optional<User> existingUser = userRepository.findByUserid(userid);
            if (existingUser.isPresent()) {
                String token = jwtUtil.generateToken(existingUser.get());
                return ResponseEntity.ok(Map.of("token", token));
            }

            return ResponseEntity.ok(Map.of(
                    "needAdditionalInfo", true,
                    "userid", userid
            ));
        } catch (Exception e) {
            logger.error("카카오 로그인 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("카카오 로그인 실패: " + e.getMessage());
        }
    }

    @PostMapping("/kakao-register")
    public ResponseEntity<?> kakaoRegister(@RequestBody Map<String, String> registerData, HttpServletRequest request) {
        try {
            String userid = registerData.get("userid");

            if (userRepository.findByUserid(userid).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 가입된 사용자입니다.");
            }

            LocalDate birth = parseBirth(registerData.get("birth"));

            User user = userService.registerKakaoUser(
                    request,
                    registerData.get("username"),
                    birth != null ? birth.atStartOfDay() : null,
                    registerData.get("userid"),
                    registerData.get("email"),
                    registerData.get("tel")
            );

            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            logger.error("카카오 회원가입 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패");
        }
    }

    // ✅ 네이버 로그인 (Authorization Code Flow 방식)
    // 🔄 1. 프론트엔드에서 accessToken 또는 code/state 중 하나로 POST
    @PostMapping("/naver-login")
    public ResponseEntity<?> naverLogin(@RequestBody Map<String, String> request) {
        try {
            String code = request.get("code");
            String state = request.get("state");
            String accessToken = request.get("accessToken");

            Map<String, Object> naverUserInfo = naverAuthService.getNaverUserInfo(code, state, accessToken);
            String userid = naverUserInfo.get("userid").toString();

            Optional<User> existingUser = userRepository.findByUserid(userid);
            if (existingUser.isPresent()) {
                String token = jwtUtil.generateToken(existingUser.get());
                return ResponseEntity.ok(Map.of("token", token));
            }

            return ResponseEntity.ok(Map.of(
                    "needAdditionalInfo", true,
                    "userid", userid,
                    "username", naverUserInfo.get("username"),
                    "email", naverUserInfo.get("email")
            ));
        } catch (Exception e) {
            logger.error("네이버 로그인 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("네이버 로그인 실패");
        }
    }

    // 🔄 2. 네이버 리디렉션용 GET 콜백
    @GetMapping("/login/naver/callback")
    public void naverCallback(@RequestParam("code") String code,
                              @RequestParam("state") String state,
                              HttpServletResponse response) throws IOException {
        try {
            Map<String, Object> naverUserInfo = naverAuthService.getNaverUserInfo(code, state, null);
            String userid = (String) naverUserInfo.get("userid");

            Optional<User> existingUser = userRepository.findByUserid(userid);
            if (existingUser.isPresent()) {
                String token = jwtUtil.generateToken(existingUser.get());

                String redirectUrl = UriComponentsBuilder
                        .fromUriString("http://localhost:5173/oauth")
                        .queryParam("token", token)
                        .build()
                        .toUriString();

                response.sendRedirect(redirectUrl);
                return;
            }

            // 추가 정보 필요 시 프론트로 전달
            String redirectUrl = UriComponentsBuilder
                    .fromUriString("http://localhost:5173/oauth")
                    .queryParam("needAdditionalInfo", true)
                    .queryParam("userid", userid)
                    .queryParam("username", naverUserInfo.getOrDefault("username", ""))
                    .queryParam("email", naverUserInfo.getOrDefault("email", ""))
                    .build()
                    .encode()
                    .toUriString();

            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            logger.error("네이버 로그인 콜백 처리 실패", e);

            String errorMessage = URLEncoder.encode("네이버 로그인 실패", StandardCharsets.UTF_8);
            String errorRedirectUrl = "http://localhost:5173/error?message=" + errorMessage;

            response.sendRedirect(errorRedirectUrl);
        }
    }


    @PostMapping("/naver-register")
    public ResponseEntity<?> naverRegister(@RequestBody Map<String, String> registerData, HttpServletRequest request) {
        try {
            String userid = registerData.get("userid");

            if (userRepository.findByUserid(userid).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 가입된 사용자입니다.");
            }

            LocalDate birth = parseBirth(registerData.get("birth"));

            User user = userService.registerNaverUser(
                    request,
                    registerData.get("username"),
                    birth != null ? birth.atStartOfDay() : null,
                    registerData.get("userid"),
                    registerData.get("email"),
                    registerData.get("tel")
            );

            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            logger.error("네이버 회원가입 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 실패");
        }
    }

    @GetMapping("/check-id/{userid}")
    public ResponseEntity<String> checkId(@PathVariable("userid") String userid) {
        try {
            boolean isAvailable = userService.isIdAvailable(userid);
            return isAvailable
                    ? ResponseEntity.ok("OK")
                    : ResponseEntity.status(HttpStatus.CONFLICT).body("이미 존재하는 아이디입니다.");
        } catch (Exception e) {
            logger.error("아이디 중복 확인 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("아이디 중복 확인 실패");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody Map<String, String> loginData) {
        try {
            String token = userService.login(loginData.get("userid"), loginData.get("password"));
            return ResponseEntity.ok(Map.of("token", token));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", "로그인 실패"));
        }
    }

    @PostMapping("/admin-login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> request){
        String userid = request.get("userid");
        String password = request.get("password");

        Optional<User> userOptional = userRepository.findByUserid(userid);
        if(userOptional.isEmpty()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("존재하지 않는 사용자입니다.");
        }

        User user = userOptional.get();

        if(!"ADMIN".equals(user.getRole())){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("관리자 권한이 없습니다.");
        }

        if(!passwordEncoder.matches(password, user.getPassword())){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 일치하지 않습니다.");
        }

        String token = jwtUtil.generateToken(user);
        return ResponseEntity.ok(Map.of("token", token));
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            String userid = jwtUtil.extractUsername(token);
            Optional<User> userOptional = userRepository.findByUserid(userid);
            return userOptional.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/check-login")
    public ResponseEntity<String> checkLoginStatus(HttpServletRequest request) {
        try {
            String token = jwtUtil.extractTokenFromRequest(request);
            if (token == null || !jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인 필요");
            }
            return ResponseEntity.ok("로그인 상태");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("로그인 상태 확인 실패");
        }
    }
    @PutMapping("/profile")
        public ResponseEntity<?> updateMyProfile(@RequestBody Map<String, String> data, HttpServletRequest request) {
            try {
                String token = jwtUtil.extractTokenFromRequest(request);
                String userid = jwtUtil.extractUsername(token);

                Optional<User> optionalUser = userRepository.findByUserid(userid);
                if (optionalUser.isEmpty()) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
                }

                User user = optionalUser.get();

                // 수정 가능한 필드만 업데이트
                if (data.get("username") != null) user.setUsername(data.get("username"));
                if (data.get("email") != null) user.setEmail(data.get("email"));
                if (data.get("tel") != null) user.setTel(data.get("tel"));

                userRepository.save(user);
                return ResponseEntity.ok(user);
            } catch (Exception e) {
                logger.error("내 정보 수정 실패", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("내 정보 수정 실패");
            }
        }
        private LocalDate parseBirth(String birthStr) {
            if (birthStr != null && !birthStr.isEmpty()) {
                return LocalDate.parse(birthStr, DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            }
            return null;
    }
    
    @PostMapping("/find-userid")
    public ResponseEntity<?> findUserId(@RequestBody FindUserIdRequest request){
        String userid = userService.findUserId(request.getUsername(), request.getEmail());

        if(userid != null){
            return ResponseEntity.ok(new FindUserIdResponse(userid));
        }else{
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("일치하는 계정이 없습니다.");
        }
    }

    @PostMapping("/password/reset-link")
    public ResponseEntity<String> sendResetLink(@RequestBody FindPasswordRequest request){
        
        String username = request.getUsername();
        String email = request.getEmail();
        
        try{
            resetService.sendResetLink(username, email);
            return ResponseEntity.ok("비밀번호 재설정 링크를 이메일로 전송했습니다.");
        }catch(IllegalArgumentException | MessagingException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("password/reset")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request){
        try{
            resetService.resetPassword(request.getToken(), request.getNewPassword());
            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        }catch(IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
