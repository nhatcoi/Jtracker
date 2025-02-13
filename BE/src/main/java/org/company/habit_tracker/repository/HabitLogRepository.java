package org.company.habit_tracker.repository;

import org.company.habit_tracker.entity.Habit;
import org.company.habit_tracker.entity.HabitLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface HabitLogRepository extends JpaRepository<HabitLog, UUID> {

    @Query("SELECT COUNT(h) FROM HabitLog h WHERE h.habit.user.id = :userId AND h.habit.id = :habitId AND h.statusLog = 'COMPLETED'")
    Integer getTotalCompleted(UUID userId, UUID habitId);

    @Query("SELECT COUNT(h) FROM HabitLog h WHERE h.habit.user.id = :userId AND h.habit.id = :habitId AND h.statusLog = 'FAILED'")
    Integer getDayFail(UUID userId, UUID habitId);

    @Query("SELECT COUNT(h) FROM HabitLog h WHERE h.habit.user.id = :userId AND h.habit.id = :habitId AND h.statusLog = 'SKIPPED'")
    Integer getDaySkipped(UUID userId, UUID habitId);


    @Query("SELECT COUNT(h) > 0 FROM HabitLog h WHERE h.habit.id = :habitId " +
            "AND :today BETWEEN h.periodStart AND h.periodEnd")
    boolean existsByHabitAndPeriod(@Param("habitId") UUID habitId, @Param("today") LocalDate today);

    @Query("SELECT h FROM HabitLog h WHERE h.habit.id = :habitId " +
            "AND :previousDay BETWEEN h.periodStart AND h.periodEnd")
    HabitLog findByHabitAndPeriod(@Param("habitId") UUID habitId, @Param("previousDay") LocalDate previousDay);

    @Query("SELECT SUM(h.achieved) FROM HabitLog h WHERE h.habit.id = :habitId")
    Object getTotalAchieved(UUID habitId);

    @Query("SELECT h.achieved FROM HabitLog h WHERE h.id = :habitLogId")
    Object getAchievedPeriod(UUID habitLogId);

    @Query("SELECT h FROM HabitLog h WHERE h.habit.user.id = :userId AND " +
            "(h.periodStart <= :today AND h.periodEnd >= :today)")
    Optional<HabitLog> findByHabitIdToday(@Param("userId") UUID userId, @Param("today") LocalDate today);


    @Query("SELECT h FROM HabitLog h WHERE h.habit.id = :habitId AND " +
            "(h.periodStart <= :today AND h.periodEnd >= :today)")
    HabitLog findHabitLogPeriod(@Param("habitId") UUID habitId, @Param("today") LocalDate today);

    @Query("SELECT h FROM HabitLog h WHERE h.habit.user.id =:userId AND h.habit.id = :habitId ORDER BY h.createdAt DESC")
    List<HabitLog> findByUserIdAndHabitId(@Param("userId")UUID userId,@Param("habitId") UUID habitId);
}
