package org.company.habit_tracker.component;

import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.company.habit_tracker.entity.Habit;
import org.company.habit_tracker.entity.Reminder;
import org.company.habit_tracker.enums.StatusEnum;
import org.company.habit_tracker.enums.TypeEnum;
import org.company.habit_tracker.repository.ReminderRepository;
import org.company.habit_tracker.service.EmailService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class HabitReminderScheduler {
    private final EmailService emailService;
    private final ReminderRepository reminderRepository;

//    @Scheduled(cron = "0 * * * * ?")
    @Scheduled(cron = "0 * * * * ?", zone = "Asia/Ho_Chi_Minh")
    public void scheduleReminders() {
        LocalTime now = LocalTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalTime after = now.plusMinutes(10);

        List<Reminder> reminders = reminderRepository.findByReminderTimeBetween(now, after);

        if (reminders.isEmpty()) {
            log.info("No reminders to send at this time.");
            return;
        }

        reminders.forEach(reminder -> {
            Habit habit = reminder.getHabit();
            if(habit.getStatus().equals(StatusEnum.PROGRESS.name())
                    && habit.getHabitType().equals(TypeEnum.GOOD.name())
                    && habit.getActive()
                    && habit.getAchievedPeriod() < habit.getGoal()
            ) {
                String emailTo = habit.getUser().getEmail();
                String subject = "📌 Reminder from JTracker: " + habit.getName();
                String body = buildEmailContent(habit, reminder);
                log.info("Sending reminder email to {}", emailTo);
                try {
                    emailService.sendReminder(emailTo, subject, body);
                } catch (MessagingException e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    private String buildEmailContent(Habit habit, Reminder reminder) {
        String lastName = habit.getUser().getLastname() != null ? habit.getUser().getLastname() : " ";

        return """
            <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2 style="color: #2E86C1;">🔔 JTracker Reminder</h2>
                <p>Dear <b>%s</b>,</p>
                <p>This is a gentle reminder to complete your habit:</p>
                <ul>
                    <li><b>Habit Name:</b> %s</li>
                    <li><b>Description:</b> %s</li>
                    <li><b>Reminder Time:</b> %s</li>
                </ul>
                <p>Stay consistent and keep up the great work! 🚀</p>
                <hr>
                <p style="font-size: 12px; color: gray;">This is an automated message from <b>JTracker</b>. Please do not reply.</p>
            </body>
            </html>
        """.formatted(
                habit.getUser().getFirstname() + " " + lastName,
                habit.getName(),
                habit.getDescription(),
                reminder.getReminderTime()
        );
    }
}
