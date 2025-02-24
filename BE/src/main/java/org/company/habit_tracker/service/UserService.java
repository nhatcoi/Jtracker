package org.company.habit_tracker.service;
import org.company.habit_tracker.dto.AuthRequest;
import org.company.habit_tracker.dto.PasswordDTO;
import org.company.habit_tracker.dto.UserRequest;
import org.company.habit_tracker.dto.UserResponse;
import org.company.habit_tracker.entity.User;

import java.util.List;
import java.util.UUID;

public interface UserService {

    List<User> getAllUsers();

    UserResponse getUserById(UUID id);

    UserResponse createUser(AuthRequest userRequest);

    User findByEmail(String email);

    boolean checkPassword(String rawPassword, String encodedPassword);

    UserResponse updateUser(UUID id, UserRequest userRequest);

    void deleteUser(UUID id);

    User createUserFromGoogle(User newUser);

    void updatePassword(UUID userId, PasswordDTO request);
}
