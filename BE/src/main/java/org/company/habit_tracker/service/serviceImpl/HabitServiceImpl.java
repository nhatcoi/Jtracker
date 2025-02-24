package org.company.habit_tracker.service.serviceImpl;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.company.habit_tracker.dto.HabitRequest;
import org.company.habit_tracker.dto.HabitResponse;
import org.company.habit_tracker.entity.Habit;
import org.company.habit_tracker.entity.User;
import org.company.habit_tracker.enums.StatusEnum;
import org.company.habit_tracker.repository.HabitRepository;
import org.company.habit_tracker.repository.UserRepository;
import org.company.habit_tracker.service.HabitService;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class HabitServiceImpl implements HabitService {
    private final HabitRepository habitRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    @Transactional
    public HabitResponse createHabit(UUID userId, HabitRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        Habit habit = modelMapper.map(request, Habit.class);
        habit.setHabitType(Optional.of(request.getHabitType().toUpperCase()).orElse("NOT_SET"));
        habit.setUser(user);
        habit.setStatus(StatusEnum.PROGRESS.name());
        habit.setStartDate(Optional.ofNullable(request.getStartDate()).orElse(LocalDate.now()));
        habit.setEndDate(request.getEndDate());
        habit.setAchievedPeriod(0);
        habit.setActive(true);

        Habit savedHabit = habitRepository.save(habit);
        return convertToResponse(savedHabit);
    }

    @Override
    @Transactional
    public HabitResponse updateHabit(UUID habitId, HabitRequest request) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new EntityNotFoundException("Habit not found with id: " + habitId));
        modelMapper.map(request, habit);
        Habit updatedHabit = habitRepository.save(habit);
        return convertToResponse(updatedHabit);
    }


    private HabitResponse convertToResponse(Habit habit) {
        HabitResponse response = modelMapper.map(habit, HabitResponse.class);
        response.setUserId(habit.getUser().getId());
        return response;
    }

    @Override
    public void deleteHabit(UUID habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));
        habitRepository.delete(habit);
    }

    @Override
    public HabitResponse getHabit(UUID habitId) {
        Habit habit = habitRepository.findById(habitId)
                .orElseThrow(() -> new RuntimeException("Habit not found"));
        return convertToResponse(habit);
    }

    @Override
    public Page<HabitResponse> getHabitsByAdmin(String frequency, int page, int size) {
        Page<Habit> habits = habitRepository.findHabitsByAdmin(frequency, PageRequest.of(page, size));
        return habits.map(this::convertToResponse);
    }


    @Override
    public Page<HabitResponse> getHabitsByUser(UUID userId, String frequency, String status, Boolean active, int page, int size) {
        boolean isValidStatus = false;
        if (status != null && !status.isEmpty()) {
            try {
                StatusEnum.valueOf(status.toUpperCase());
                isValidStatus = true;
            } catch (IllegalArgumentException e) {
                isValidStatus = false;
            }
        }

        String finalStatus = isValidStatus ? status : null;

        Page<Habit> habits = habitRepository.findHabitsByUser(userId, frequency, finalStatus, active, PageRequest.of(page, size));
        return habits.map(habit -> HabitResponse.builder()
                .id(habit.getId())
                .userId(null)
                .name(habit.getName())
                .description(habit.getDescription())
                .frequency(habit.getFrequency())
                .goal(habit.getGoal())
                .habitType(habit.getHabitType())
                .createdAt(habit.getCreatedAt())
                .startDate(habit.getStartDate())
                .endDate(habit.getEndDate())
                .status(habit.getStatus())
                .achievedPeriod(habit.getAchievedPeriod())
                .reminder(habit.getReminder())
                .active(habit.getActive())
                .build());
    }

}
