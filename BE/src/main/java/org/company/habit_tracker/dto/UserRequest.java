package org.company.habit_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserRequest{
    private String firstname;
    private String lastname;
    private String email;
    private String provider;
    private String providerId;
    private String emailVerified;
    private String avatar;
    private Boolean active;
}
