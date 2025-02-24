package org.company.habit_tracker.service;

import org.company.habit_tracker.dto.AuthRequest;
import org.company.habit_tracker.dto.AuthResponse;

public interface AuthService {

    AuthResponse authenticateWithGoogle(String idToken);

    AuthResponse authenticatedWithEmail(AuthRequest authRequest);
}
