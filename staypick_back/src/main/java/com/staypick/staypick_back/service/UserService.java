package com.staypick.staypick_back.service;

import com.staypick.staypick_back.entity.User;
import com.staypick.staypick_back.repository.UserRepository;
import com.staypick.staypick_back.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // ✅ 아이디 중복 확인
    public boolean isIdAvailable(String userid) {
        return !userRepository.existsByUserid(userid);
    }

    // ✅ 일반 회원가입
    public User register(HttpServletRequest request,
                         String username,
                         LocalDateTime birth,
                         String userid,
                         String rawPassword,
                         String email,
                         String tel) {

        if (userRepository.findByUserid(userid).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 아이디입니다.");
        }

        String encodedPassword = passwordEncoder.encode(rawPassword);
        String userip = request.getRemoteAddr();

        User user = User.builder()
                .username(username)
                .birth(birth)
                .userid(userid)
                .password(encodedPassword)
                .email(email)
                .tel(tel)
                .userip(userip)
                .provider("local")
                .role("USER")
                .build();

        if (user.getRole() == null) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    // ✅ 소셜 회원가입 (공통)
    public User registerSnsUser(HttpServletRequest request,
                                String username,
                                LocalDateTime birth,
                                String userid,
                                String email,
                                String tel,
                                String provider) {

        if (userRepository.findByUseridAndProvider(userid, provider).isPresent()) {
            throw new IllegalArgumentException("이미 가입된 사용자입니다.");
        }

        String userip = request.getRemoteAddr();

        User user = User.builder()
                .username(username)
                .birth(birth)
                .userid(userid)
                .email(email)
                .tel(tel)
                .userip(userip)
                .provider(provider)
                .role("USER")
                .build();

        return userRepository.save(user);
    }

    // ✅ 카카오
    public User registerKakaoUser(HttpServletRequest request,
                                  String username,
                                  LocalDateTime birth,
                                  String userid,
                                  String email,
                                  String tel) {
        return registerSnsUser(request, username, birth, userid, email, tel, "kakao");
    }

    // ✅ 네이버
    public User registerNaverUser(HttpServletRequest request,
                                  String username,
                                  LocalDateTime birth,
                                  String userid,
                                  String email,
                                  String tel) {
        return registerSnsUser(request, username, birth, userid, email, tel, "naver");
    }

    // ✅ 로그인
    public String login(String userid, String password) {
        Optional<User> optionalUser = userRepository.findByUserid(userid);

        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("존재하지 않는 사용자입니다.");
        }

        User user = optionalUser.get();

        if (user.getPassword() == null) {
            throw new IllegalArgumentException("카카오 로그인 유저입니다. 카카오 로그인을 사용해주세요.");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        return jwtUtil.generateToken(user);
    }

    //아이디 찾기
    public String findUserId(String username, String email){
        return userRepository.findByUsernameAndEmail(username, email)
                .map(User::getUserid)
                .orElse(null);
    }
}
