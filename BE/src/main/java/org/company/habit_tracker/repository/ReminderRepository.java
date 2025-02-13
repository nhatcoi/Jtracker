package org.company.habit_tracker.repository;

import org.company.habit_tracker.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, UUID> {
    @Query("SELECT r FROM Reminder r WHERE r.reminderTime BETWEEN :before AND :after")
    List<Reminder> findByReminderTimeBetween(@Param("before") LocalTime now, @Param("after") LocalTime after);


    @Query("SELECT r FROM Reminder r WHERE r.habit.id = :id")
    Reminder findReminderByHabitId(UUID id);
}
