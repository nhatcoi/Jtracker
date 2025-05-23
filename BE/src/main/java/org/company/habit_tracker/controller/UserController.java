package org.company.habit_tracker.controller;

import lombok.RequiredArgsConstructor;
import org.company.habit_tracker.dto.PasswordDTO;
import org.company.habit_tracker.dto.UserRequest;
import org.company.habit_tracker.dto.UserResponse;
import org.company.habit_tracker.entity.User;
import org.company.habit_tracker.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

import static org.company.habit_tracker.jwt.JwtUtil.getAuthenticatedUserId;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getUserById() {
        UUID userId = getAuthenticatedUserId();
        return ResponseEntity.ok(userService.getUserById(userId));
    }

    @PutMapping("")
    public ResponseEntity<?> updateUser(@RequestBody UserRequest userRequest) {
        UUID userId = getAuthenticatedUserId();
        return ResponseEntity.ok(userService.updateUser(userId, userRequest));
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> updateUser(@RequestBody PasswordDTO request) {
        UUID userId = getAuthenticatedUserId();
        userService.updatePassword(userId, request);
        return ResponseEntity.ok("Password updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
