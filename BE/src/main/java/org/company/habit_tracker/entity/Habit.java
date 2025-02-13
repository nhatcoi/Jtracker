package org.company.habit_tracker.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "habits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
//@EntityListeners(HabitEntityListener.class)
public class Habit {

    @Id
    @GeneratedValue(generator = "UUID")
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Column(name = "frequency", length = 50)
    private String frequency;

    @Column(name = "goal")
    private Integer goal;

    @Column(name = "habit_type")
    private String habitType;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "status")
    private String status;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "achieved_period")
    private Integer achievedPeriod;

    @Column(name = "reminder")
    private Time reminder;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}