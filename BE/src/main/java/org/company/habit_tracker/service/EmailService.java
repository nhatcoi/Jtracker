package org.company.habit_tracker.service;

import jakarta.mail.MessagingException;

public interface EmailService {
    void sendReminder(String to, String subject, String body) throws MessagingException;
}
