package org.company.habit_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitRequest {
    private String name;
    private String description;
    private String frequency;
    private Integer goal;
    private String habitType;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private Integer achievedPeriod;
    private Boolean active;
    private Time reminder;
}
