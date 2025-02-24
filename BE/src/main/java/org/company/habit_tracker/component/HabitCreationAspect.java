package org.company.habit_tracker.component;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.company.habit_tracker.dto.HabitResponse;
import org.company.habit_tracker.entity.Habit;
import org.company.habit_tracker.entity.HabitLog;
import org.company.habit_tracker.entity.Reminder;
import org.company.habit_tracker.enums.FrequencyEnum;
import org.company.habit_tracker.enums.StatusEnum;
import org.company.habit_tracker.enums.TypeEnum;
import org.company.habit_tracker.repository.HabitLogRepository;
import org.company.habit_tracker.repository.HabitRepository;
import org.company.habit_tracker.repository.ReminderRepository;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

@Aspect
@Component
@RequiredArgsConstructor
public class HabitCreationAspect {

    private final HabitLogRepository habitLogRepository;
    private final HabitRepository habitRepository;
    private final ReminderRepository reminderRepository;

    @AfterReturning(
            pointcut = "execution(* org.company.habit_tracker.service.serviceImpl.HabitService.createHabit(..))",
            returning = "response"
    )
    public void afterHabitCreation(HabitResponse response) {
        Habit habit = habitRepository.findById(response.getId())
                .orElseThrow(() -> new EntityNotFoundException("Habit not found with id: " + response.getId()));

        HabitLog log = createHabitLog(habit, response.getStartDate());
        habitLogRepository.save(log);

        if (habit.getReminder() != null) {
            setReminder(habit);
        }
    }

    @AfterReturning(
            pointcut = "execution(* org.company.habit_tracker.service.serviceImpl.HabitService.updateHabit(..))",
            returning = "response"
    )
    public void afterHabitUpdate(HabitResponse response) {
        Habit habit = habitRepository.findById(response.getId())
                .orElseThrow(() -> new EntityNotFoundException("Habit not found with id: " + response.getId()));

        if (habit.getReminder() != null) {
            setReminder(habit);
        }
    }

    private HabitLog createHabitLog(Habit habit, LocalDate startDate) {
        HabitLog log = new HabitLog();
        log.setHabit(habit);
        log.setPeriodStart(startDate);
        log.setPeriodEnd(calculatePeriodEnd(habit, startDate));
        log.setStatusLog(StatusEnum.PROGRESS.name());
        log.setAchieved(0);
        return log;
    }

    private LocalDate calculatePeriodEnd(Habit habit, LocalDate startDate) {
        if (habit.getFrequency() == null) {
            return null;
        }

        if (habit.getHabitType().equals(TypeEnum.BAD.name())) {
            return startDate;
        }

        return switch (FrequencyEnum.fromString(habit.getFrequency())) {
            case DAILY -> startDate;
            case WEEKLY -> startDate.with(TemporalAdjusters.next(DayOfWeek.MONDAY)).minusDays(1);
            case MONTHLY -> startDate.with(TemporalAdjusters.firstDayOfNextMonth()).minusDays(1);
            default -> null;
        };
    }

    private void setReminder(Habit habit) {
        Reminder reminder = reminderRepository.findReminderByHabitId(habit.getId());
        if(reminder == null) {
            reminder = new Reminder();
            reminder.setHabit(habit);
            reminder.setReminderTime(habit.getReminder());
            reminder.setType(Reminder.ReminderType.EMAIL);
            reminderRepository.save(reminder);
        }
        reminder.setReminderTime(habit.getReminder());
        reminderRepository.save(reminder);
    }
}