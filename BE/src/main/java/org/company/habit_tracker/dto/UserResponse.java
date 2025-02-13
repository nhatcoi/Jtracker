package org.company.habit_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.company.habit_tracker.entity.Role;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String firstname;
    private String lastname;
    private String email;
    private String provider;
    private String providerId;
    private Boolean emailVerified;
    private String avatar;
    private Set<Role> roles;
}
