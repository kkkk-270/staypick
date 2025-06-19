package com.staypick.staypick_back.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.staypick.staypick_back.entity.PasswordResetToken;
import com.staypick.staypick_back.entity.User;
import com.staypick.staypick_back.repository.PasswordResetTokenRepository;
import com.staypick.staypick_back.repository.UserRepository;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final PasswordResetTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void sendResetLink(String username, String email) throws MessagingException{
        Optional<User> userOpt = userRepository.findByUsernameAndEmail(username, email);
        if(userOpt.isEmpty()){
            throw new IllegalArgumentException("일치하는 사용자 정보를 찾을 수 없습니다.");
        }

        tokenRepository.deleteByUsernameAndEmail(username, email);

        String token = UUID.randomUUID().toString();
        LocalDateTime expiration = LocalDateTime.now().plusMinutes(10);

        PasswordResetToken resetToken = PasswordResetToken.builder()
            .token(token)
            .username(username)
            .email(email)
            .expirationDate(expiration)
            .build();
        
        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        String content = """
                <h3>[StayPick] 비밀번호 재설정 요청</h3>
                <p>아래 링크를 클릭하여 비밀번호를 재설정해주세요. 링크는 10분간 유효합니다.</p>
                <a href="%s">%s</a>
                """.formatted(resetLink, resetLink);
        
        emailService.sendEmail(email, "[Staypick] 비밀번호 재설정 링크", content);
    }

    @Transactional
    public void resetPassword(String token, String newPassword){
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("유효하지 않은 토큰입니다."));
        
        if(resetToken.getExpirationDate().isBefore((LocalDateTime.now()))){
            tokenRepository.deleteByToken(token);
            throw new IllegalArgumentException("토큰이 만료되었습니다.");
        }

        User user = userRepository.findByUsernameAndEmail(resetToken.getUsername(), resetToken.getEmail()).orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.deleteByToken(token);   //재사용 방지
    }
}
