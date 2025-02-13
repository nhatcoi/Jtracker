package org.company.habit_tracker.service;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.company.habit_tracker.dto.AuthRequest;
import org.company.habit_tracker.dto.AuthResponse;
import org.company.habit_tracker.entity.User;
import org.company.habit_tracker.jwt.JwtUtil;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final JwtTokenService jwtTokenService;

    public AuthResponse authenticateWithGoogle(String idToken) {
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);

            String email = decodedToken.getEmail();
            String name = decodedToken.getName();
            String avatar = decodedToken.getPicture();
            String provider = "GOOGLE";
            String providerId = decodedToken.getUid();
            log.info("Authenticated Firebase User: Email={}, Name={}", email, name);
            User user = userService.findByEmail(email);
            if (user == null) {
                User newUser = User.builder()
                        .firstname(name)
                        .lastname("")
                        .email(email)
                        .provider(provider)
                        .providerId(providerId)
                        .emailVerified(false)
                        .avatar(avatar)
                        .active(true)
                        .build();
                user = userService.createUserFromGoogle(newUser);
            }

            String accessToken = jwtUtil.generateAccessToken(user);
            String refreshToken = jwtTokenService.createRefreshToken(user);
            return new AuthResponse(accessToken, refreshToken);

        } catch (FirebaseAuthException e) {
            log.error("Firebase Token verification failed", e);
            throw new RuntimeException("Invalid Firebase ID Token");
        }
    }

    public AuthResponse authenticatedWithEmail(AuthRequest authRequest) {
        User user = userService.findByEmail(authRequest.getEmail());
        if (user != null && userService.checkPassword(authRequest.getPassword(), user.getPassword())) {
            String accessToken = jwtUtil.generateAccessToken(user);
            String refreshToken = jwtTokenService.createRefreshToken(user);
            return new AuthResponse(accessToken, refreshToken);
        } else {
             throw new RuntimeException("Email or password is incorrect");
        }
    }
}
