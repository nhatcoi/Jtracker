package org.company.habit_tracker.service;

import org.company.habit_tracker.entity.User;

public interface JwtTokenService {

    String createRefreshToken(User user);

    String refreshAccessToken(String refreshToken);

    void deleteRefreshToken(String refreshToken);

    User findByRefreshToken(String refreshToken);
}