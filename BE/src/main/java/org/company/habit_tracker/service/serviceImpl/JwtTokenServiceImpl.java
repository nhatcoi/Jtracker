package org.company.habit_tracker.service.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.company.habit_tracker.jwt.JwtUtil;
import org.company.habit_tracker.entity.JwtToken;
import org.company.habit_tracker.entity.User;
import org.company.habit_tracker.repository.JwtTokenRepository;
import org.company.habit_tracker.service.JwtTokenService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class JwtTokenServiceImpl implements JwtTokenService {
    private final JwtTokenRepository jwtTokenRepository;
    private final JwtUtil jwtUtil;

    @Override
    public String createRefreshToken(User user) {
        JwtToken jwtToken = JwtToken.builder()
                .user(user)
                .refreshToken(
                        jwtUtil.generateToken(user)
                )
                .expiresAt(LocalDateTime.now().plusDays(7)) // Refresh token
                .createdAt(LocalDateTime.now())
                .build();
        jwtTokenRepository.save(jwtToken);
        return jwtToken.getRefreshToken();
    }

    @Override
    public String refreshAccessToken(String refreshToken) {
        JwtToken token = jwtTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Refresh token expired");
        }
        return jwtUtil.generateAccessToken(token.getUser());
    }

    @Override
    public void deleteRefreshToken(String refreshToken) {
        jwtTokenRepository.deleteByRefreshToken(refreshToken);
    }

    @Override
    public User findByRefreshToken(String refreshToken) {
        JwtToken token = jwtTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));
        return token.getUser();
    }

}
