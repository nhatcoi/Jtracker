package org.company.habit_tracker.service;

import org.company.habit_tracker.entity.HabitLog;
import java.util.Map;
import java.util.UUID;

public interface HabitLogService {
    Map<String, Integer> getStatusCounts(UUID userId, UUID habitId);
    HabitLog updateHabitLogByHabitId(UUID habitId, HabitLog habitLog);
    HabitLog updateHabitLog(UUID habitLogId, HabitLog habitLog);
    HabitLog getHabitLogsToday(UUID userId);
    HabitLog getHabitLogPeriod(UUID habitId);
}
