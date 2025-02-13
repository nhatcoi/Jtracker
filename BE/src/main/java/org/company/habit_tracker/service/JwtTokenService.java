package org.company.habit_tracker.service;

import lombok.RequiredArgsConstructor;
import org.company.habit_tracker.jwt.JwtUtil;
import org.company.habit_tracker.entity.JwtToken;
import org.company.habit_tracker.entity.User;
import org.company.habit_tracker.repository.JwtTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class JwtTokenService {
    private final JwtTokenRepository jwtTokenRepository;
    private final JwtUtil jwtUtil;

    public String createRefreshToken(User user) {
        JwtToken jwtToken = JwtToken.builder()
                .user(user)
                .refreshToken(
                        jwtUtil.generateToken(user)
                )
                .expiresAt(LocalDateTime.now().plusDays(7)) // Refresh token sống lâu hơn
                .createdAt(LocalDateTime.now())
                .build();
        jwtTokenRepository.save(jwtToken);
        return jwtToken.getRefreshToken();
    }

    public String refreshAccessToken(String refreshToken) {
        JwtToken token = jwtTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token expired");
        }
        return jwtUtil.generateAccessToken(token.getUser());
    }

    public void deleteRefreshToken(String refreshToken) {
        jwtTokenRepository.deleteByRefreshToken(refreshToken);
    }

    public User findByRefreshToken(String refreshToken) {
        JwtToken token = jwtTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        return token.getUser();
    }

}
