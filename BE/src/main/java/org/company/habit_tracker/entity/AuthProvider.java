package org.company.habit_tracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "auth_providers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthProvider {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AuthProviderType provider;

    @Column(name = "provider_id", nullable = false, unique = true)
    private String providerId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum AuthProviderType {
        GOOGLE, FACEBOOK
    }
}