package org.company.habit_tracker.controller;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.company.habit_tracker.dto.TokenRequest;
import org.company.habit_tracker.dto.AuthRequest;
import org.company.habit_tracker.dto.AuthResponse;
import org.company.habit_tracker.entity.User;
import org.company.habit_tracker.service.AuthService;
import org.company.habit_tracker.service.JwtTokenService;
import org.company.habit_tracker.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserService userService;
    private final AuthService authService;
    private final JwtTokenService jwtTokenService;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginWithEmail(@RequestBody AuthRequest authRequest) {
        try {
            return ResponseEntity.ok(authService.authenticatedWithEmail(authRequest));
        } catch (RuntimeException e) {
            log.error("Login failed for email: {}", authRequest.getEmail(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid email or password"));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<?> authenticateWithGoogle(@RequestBody TokenRequest request) {
        return ResponseEntity.ok(authService.authenticateWithGoogle(request.getIdToken()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletRequest request) {
        String refreshToken = extractRefreshToken(request);
        if (refreshToken == null) {
            return unauthorizedResponse("Refresh token not found");
        }

        User user = jwtTokenService.findByRefreshToken(refreshToken);
        if (user == null) {
            return unauthorizedResponse("Invalid refresh token");
        }

        String newAccessToken = jwtTokenService.refreshAccessToken(refreshToken);
        return ResponseEntity.ok(new AuthResponse(newAccessToken, refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String refreshToken = extractRefreshToken(request);
        if (refreshToken == null) {
            return unauthorizedResponse("Refresh token not found");
        }

        jwtTokenService.deleteRefreshToken(refreshToken);
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }


    private String extractRefreshToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private ResponseEntity<Map<String, String>> unauthorizedResponse(String message) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", message));
    }
}
