package org.company.habit_tracker.service.serviceImpl;

import lombok.RequiredArgsConstructor;
import org.company.habit_tracker.entity.Habit;
import org.company.habit_tracker.entity.HabitLog;
import org.company.habit_tracker.enums.FrequencyEnum;
import org.company.habit_tracker.enums.StatusEnum;
import org.company.habit_tracker.repository.HabitLogRepository;
import org.company.habit_tracker.repository.HabitRepository;
import org.company.habit_tracker.service.HabitLogService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
@RequiredArgsConstructor
public class HabitLogServiceImpl implements HabitLogService {
    private final HabitLogRepository habitLogRepository;
    private final ModelMapper modelMapper;
    private final HabitRepository habitRepository;

    @Override
    public Map<String, Integer> getStatusCounts(UUID userId, UUID habitId) {
        List<HabitLog> habitLogs = habitLogRepository.findByUserIdAndHabitId(userId, habitId);
        int completed = 0;
        int failed = 0;
        int currentStreak = 0;
        boolean check = false;

        for (int i = 0; i < habitLogs.size(); i++) {
            String status = habitLogs.get(i).getStatusLog();
            if (i == 0 && status.equals(StatusEnum.COMPLETED.name())) {
                check = true;
            }

            if (i == 1 && failed == 0 && status.equals(StatusEnum.COMPLETED.name())) {
                check = true;
            }

            if (status.equals(StatusEnum.COMPLETED.name())) {
                if (check) {
                    currentStreak++;
                }
                completed++;
            }

            if (status.equals(StatusEnum.FAILED.name())) {
                check = false;
                failed++;
            }
        }
        Map<String, Integer> statusMap = new HashMap<>();
        statusMap.put("completed", completed);
        statusMap.put("failed", failed);
        statusMap.put("currentStreak", currentStreak);

        return statusMap;
    }

    @Override
    public HabitLog updateHabitLogByHabitId(UUID habitId, HabitLog habitLog) {
        HabitLog habitLogUpdated = habitLogRepository.findHabitLogPeriod(habitId, LocalDate.now());

        modelMapper.map(habitLog, habitLogUpdated);

        habitLogUpdated.getHabit().setAchievedPeriod(habitLog.getAchieved());
        habitLogRepository.save(habitLogUpdated);

        habitLogUpdated.getHabit().setUser(null); // Avoid exposing sensitive data
        return habitLogUpdated;
    }

    @Override
    public HabitLog updateHabitLog(UUID habitLogId, HabitLog habitLog) {
        HabitLog habitLogUpdated = habitLogRepository.findById(habitLogId)
                .orElseThrow(() -> new RuntimeException("Habit log not found"));

        modelMapper.map(habitLog, habitLogUpdated);
        habitLogUpdated.getHabit().setAchievedPeriod(habitLog.getAchieved());
        habitLogRepository.save(habitLogUpdated);
        habitLogUpdated.getHabit().setUser(null);
        return habitLogUpdated;
    }

    @Override
    public List<HabitLog> getHabitLogsToday(UUID userId) {
        List<HabitLog> habitLogs = habitLogRepository.findByHabitIdToday(userId, LocalDate.now());
        for (HabitLog habitLog : habitLogs) {
            habitLog.getHabit().setUser(null); // Avoid exposing sensitive data
        }
        return habitLogs;
    }

    @Override
    public HabitLog getHabitLogPeriod(UUID habitId) {
        HabitLog habitLog = habitLogRepository.findHabitLogPeriod(habitId, LocalDate.now());
        Optional<Habit> habit;
        if(habitLog == null) {
            habit = habitRepository.findById(habitId);
            if (habit.isPresent()) {
                return createHabitLog(habit.get(), habit.get().getStartDate());
            } else {
                throw new RuntimeException("Habit not found");
            }
        }
        habitLog.getHabit().setUser(null);
        return habitLog;
    }

    private HabitLog createHabitLog(Habit habit, LocalDate startDate) {
        HabitLog log = new HabitLog();
        log.setHabit(habit);
        log.setPeriodStart(startDate);
        log.setPeriodEnd(calculatePeriodEnd(habit, startDate));
        log.setStatusLog(StatusEnum.PROGRESS.name());
        log.setAchieved(0);
        log.getHabit().setUser(null);
        return log;
    }

    private LocalDate calculatePeriodEnd(Habit habit, LocalDate startDate) {
        if (habit.getFrequency() == null) {
            return null;
        }

        if (habit.getHabitType().equals("BAD")) {
            return startDate;
        }

        return switch (FrequencyEnum.fromString(habit.getFrequency())) {
            case DAILY -> startDate;
            case WEEKLY -> startDate.with(TemporalAdjusters.next(DayOfWeek.MONDAY)).minusDays(1);
            case MONTHLY -> startDate.with(TemporalAdjusters.firstDayOfNextMonth()).minusDays(1);
            default -> null;
        };
    }
}
