package org.company.habit_tracker.controller;

import lombok.RequiredArgsConstructor;
import org.company.habit_tracker.entity.HabitLog;
import org.company.habit_tracker.service.HabitLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/habit-logs")
@RequiredArgsConstructor
public class HabitLogController {
    private final HabitLogService habitLogService;

    private UUID getAuthenticatedUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }
        return UUID.fromString(authentication.getName());
    }

    @GetMapping
    public ResponseEntity<?> getHabitLogsToday() {
        return ResponseEntity.ok(habitLogService.getHabitLogsToday(getAuthenticatedUserId()));
    }

    @GetMapping("/{habitId}")
    public ResponseEntity<?> getHabitLogByHabit(@PathVariable UUID habitId) {
        return ResponseEntity.ok(habitLogService.getHabitLogPeriod(habitId));
    }

    @PutMapping("/update/{habitId}")
    public ResponseEntity<?> updateHabitLogByHabitId(@PathVariable UUID habitId, @RequestBody HabitLog habitLog) {
        return ResponseEntity.ok(habitLogService.updateHabitLogByHabitId(habitId, habitLog));
    }

    @PutMapping("/{habitLogId}")
    public ResponseEntity<?> updateHabitLog(@PathVariable UUID habitLogId, @RequestBody HabitLog habitLog) {
        return ResponseEntity.ok(habitLogService.updateHabitLog(habitLogId, habitLog));
    }

    @GetMapping("/status-counts/{habitId}")
    public ResponseEntity<?> statusCounts(@PathVariable UUID habitId) {
        return ResponseEntity.ok(habitLogService.getStatusCounts(getAuthenticatedUserId(), habitId));
    }

}
