package org.company.habit_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitResponse {
    private UUID id;
    private UUID userId;
    private String name;
    private String description;
    private String frequency;
    private Integer goal;
    private String habitType;
    private LocalDateTime createdAt;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Integer achievedPeriod;
    private Boolean active;
    private Time reminder;
}