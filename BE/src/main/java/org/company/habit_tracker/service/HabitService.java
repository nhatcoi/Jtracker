package org.company.habit_tracker.service;

import org.company.habit_tracker.dto.HabitRequest;
import org.company.habit_tracker.dto.HabitResponse;
import org.springframework.data.domain.Page;

import java.util.UUID;

public interface HabitService {
    HabitResponse createHabit(UUID userId, HabitRequest request);
    HabitResponse updateHabit(UUID habitId, HabitRequest request);
    void deleteHabit(UUID habitId);
    HabitResponse getHabit(UUID habitId);
    Page<HabitResponse> getHabitsByAdmin(String frequency, int page, int size);
    Page<HabitResponse> getHabitsByUser(UUID userId,
                                        String frequency,
                                        String status,
                                        Boolean active,
                                        int page, int size);
}