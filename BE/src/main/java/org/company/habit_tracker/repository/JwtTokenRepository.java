package org.company.habit_tracker.repository;

import jakarta.transaction.Transactional;
import org.company.habit_tracker.entity.JwtToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface JwtTokenRepository extends JpaRepository<JwtToken, UUID> {
    Optional<JwtToken> findByRefreshToken(String refreshToken);

    @Modifying
    @Transactional
    @Query("DELETE FROM JwtToken t WHERE t.refreshToken = :refreshToken")
    void deleteByRefreshToken(String refreshToken);
}
