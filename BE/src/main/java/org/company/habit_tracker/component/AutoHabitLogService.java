package org.company.habit_tracker.component;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.company.habit_tracker.entity.Habit;
import org.company.habit_tracker.entity.HabitLog;
import org.company.habit_tracker.enums.FrequencyEnum;
import org.company.habit_tracker.enums.StatusEnum;
import org.company.habit_tracker.repository.HabitLogRepository;
import org.company.habit_tracker.repository.HabitRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AutoHabitLogService {

    private final HabitRepository habitRepository;
    private final HabitLogRepository habitLogRepository;

    // Run at 00:00:00
    @Scheduled(cron = "0 0 0 * * *", zone = "Asia/Ho_Chi_Minh")
    @Transactional
    public void generateDailyHabitLogs() {
        LocalDate today = LocalDate.now();

        String daily = FrequencyEnum.DAILY.getValue();
        String progress = StatusEnum.PROGRESS.name();

        List<Habit> habits = habitRepository.findByStatusAndFrequency(progress, daily);

        habits.forEach(habit -> {
            HabitLog log = new HabitLog();
            log.setHabit(habit);
            log.setCreatedAt(LocalDateTime.now());
            log.setPeriodStart(today);
            log.setPeriodEnd(today);
            log.setStatusLog(StatusEnum.PROGRESS.name());
            log.setAchieved(0);
            log.getHabit().setAchievedPeriod(0);
            habitLogRepository.save(log);

            LocalDate previousDay = today.minusDays(1);
            HabitLog previousLog = habitLogRepository.findByHabitAndPeriod(habit.getId(), previousDay);
            if (previousLog != null) {
                if (previousLog.getAchieved() < habit.getGoal()) {
                    previousLog.setStatusLog(StatusEnum.FAILED.name());
                    habitLogRepository.save(previousLog);
                } else {
                    previousLog.setStatusLog(StatusEnum.COMPLETED.name());
                    habitLogRepository.save(previousLog);
                }
            }

        });

    }

    // Run at 00:00:00 on the first day of the week
    @Scheduled(cron = "0 0 0 * * MON", zone = "Asia/Ho_Chi_Minh")
    public void generateWeeklyHabitLogs() {
        LocalDate startOfWeek = LocalDate.now().with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        List<Habit> habits = habitRepository.findByStatusAndFrequency(StatusEnum.PROGRESS.name(), FrequencyEnum.WEEKLY.name());

        habits.forEach(habit -> {
            boolean exists = habitLogRepository.existsByHabitAndPeriod(habit.getId(), startOfWeek);
            if (!exists) {
                HabitLog log = new HabitLog();
                log.setHabit(habit);
                log.setPeriodStart(startOfWeek);
                log.setPeriodEnd(endOfWeek);
                habitLogRepository.save(log);
            }
        });
    }

    // Run at 00:00:00 on the first day of the month
    @Scheduled(cron = "0 0 0 1 * *", zone = "Asia/Ho_Chi_Minh")
    public void generateMonthlyHabitLogs() {
        LocalDate startOfMonth = LocalDate.now().with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endOfMonth = startOfMonth.with(TemporalAdjusters.lastDayOfMonth());

        List<Habit> habits = habitRepository.findByStatusAndFrequency(StatusEnum.PROGRESS.name(), FrequencyEnum.MONTHLY.name());

        habits.forEach(habit -> {
            boolean exists = habitLogRepository.existsByHabitAndPeriod(habit.getId(), startOfMonth);
            if (!exists) {
                HabitLog log = new HabitLog();
                log.setHabit(habit);
                log.setPeriodStart(startOfMonth);
                log.setPeriodEnd(endOfMonth);
                habitLogRepository.save(log);
            }
        });
    }
}
