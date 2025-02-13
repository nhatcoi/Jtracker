package org.company.habit_tracker.repository;

import org.company.habit_tracker.entity.Habit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HabitRepository extends JpaRepository<Habit, UUID> {
    @Query("SELECT h FROM Habit h WHERE h.user.id = :userId " +
            "AND (:frequency IS NULL OR :frequency = '' OR h.frequency = :frequency) " +
            "AND (:status IS NULL OR :status = '' OR h.status = :status) " +
            "AND (:active IS NULL OR h.active = :active) " +
            "ORDER BY h.createdAt DESC")
    Page<Habit> findHabitsByUser(@Param("userId") UUID userId,
                                 @Param("frequency") String frequency,
                                 @Param("status") String status,
                                 @Param("active") Boolean active,
                                 Pageable pageable);

    @Query("SELECT h FROM Habit h WHERE (:frequency IS NULL OR :frequency = '' OR h.frequency = :frequency)")
    Page<Habit> findHabitsByAdmin(@Param("frequency") String frequency,
                                  Pageable pageable);

    @Query("SELECT h FROM Habit h WHERE h.status = :fre AND h.frequency = :daily")
    List<Habit> findByStatusAndFrequency(String fre, String daily);
}
