package org.company.habit_tracker.service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.company.habit_tracker.dto.AuthRequest;
import org.company.habit_tracker.dto.PasswordDTO;
import org.company.habit_tracker.dto.UserRequest;
import org.company.habit_tracker.dto.UserResponse;
import org.company.habit_tracker.entity.Role;
import org.company.habit_tracker.entity.User;
import org.company.habit_tracker.repository.RoleRepository;
import org.company.habit_tracker.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final ModelMapper modelMapper;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public UserResponse getUserById(UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return UserResponse.builder()
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .provider(user.getProvider())
                .providerId(user.getProviderId())
                .emailVerified(user.getEmailVerified())
                .avatar(user.getAvatar())
                .roles(user.getRoles())
                .build();
    }


    public UserResponse createUser(AuthRequest userRequest) {
        User newUser = new User();
        newUser.setEmail(userRequest.getEmail());
        newUser.setPassword(encodePassword(userRequest.getPassword()));

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new EntityNotFoundException("Role 'USER' not found"));
        newUser.setRoles(Set.of(userRole));
        userRepository.save(newUser);

        return UserResponse.builder()
                .firstname(newUser.getFirstname())
                .lastname(newUser.getLastname())
                .email(newUser.getEmail())
                .provider(newUser.getProvider())
                .avatar(newUser.getAvatar())
                .roles(newUser.getRoles())
                .build();
    }

    private String encodePassword(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }


    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public UserResponse updateUser(UUID id, UserRequest userRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        modelMapper.map(userRequest, user);

        return modelMapper.map(userRepository.save(user), UserResponse.class);
    }

    public void deleteUser(UUID id) {
        userRepository.deleteById(id);
    }


    public User createUserFromGoogle(User newUser) {

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new EntityNotFoundException("Role 'USER' not found"));
        newUser.setRoles(Set.of(userRole));
        return userRepository.save(newUser);
    }

    public void updatePassword(UUID userId, PasswordDTO request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getOldPassword() == null || request.getNewPassword() == null) {
            throw new RuntimeException("Old password and new password must not be null");
        }

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        String newEncodedPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(newEncodedPassword);
        userRepository.save(user);
    }
}

