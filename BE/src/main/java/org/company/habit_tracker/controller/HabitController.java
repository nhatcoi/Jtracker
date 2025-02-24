package org.company.habit_tracker.controller;

import lombok.RequiredArgsConstructor;
import org.company.habit_tracker.dto.HabitRequest;
import org.company.habit_tracker.dto.HabitResponse;
import org.company.habit_tracker.service.HabitService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

import static org.company.habit_tracker.jwt.JwtUtil.getAuthenticatedUserId;

@RestController
@RequestMapping("/api/habits")
@RequiredArgsConstructor
public class HabitController {
    private final HabitService habitService;



    @PostMapping
    public ResponseEntity<HabitResponse> createHabit(@RequestBody HabitRequest habit) {
        return ResponseEntity.status(201).body(habitService.createHabit(getAuthenticatedUserId(), habit));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HabitResponse> updateHabit(@PathVariable UUID id, @RequestBody HabitRequest habit) {
        return ResponseEntity.ok(habitService.updateHabit(id, habit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabit(@PathVariable UUID id) {
        habitService.deleteHabit(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<HabitResponse> getHabit(@PathVariable UUID id) {
        return ResponseEntity.ok(habitService.getHabit(id));
    }

    @GetMapping("/list-admin")
    public ResponseEntity<Page<HabitResponse>> getHabitsAdmin(
            @RequestParam(value = "frequency", required = false) String frequency,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(habitService.getHabitsByAdmin(frequency, page, size));
    }

    @GetMapping("/list")
    public ResponseEntity<Page<HabitResponse>> getHabits(
            @RequestParam(value = "frequency", required = false) String frequency,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "active", required = false) Boolean active,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        return ResponseEntity.ok(habitService.getHabitsByUser(getAuthenticatedUserId(), frequency, status, active, page, size));
    }
}
