package com.staypick.staypick_back.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.staypick.staypick_back.entity.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByToken(String token);

    @Modifying
    @Transactional
    @Query(value = "DELETE FROM pw_reset_token WHERE username = :username AND email = :email", nativeQuery = true)
    void deleteByUsernameAndEmail(@Param("username") String username, @Param("email") String email);
}
