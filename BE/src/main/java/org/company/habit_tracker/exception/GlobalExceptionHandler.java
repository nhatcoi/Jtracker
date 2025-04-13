package org.company.habit_tracker.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<?> handleResponseStatusException(ResponseStatusException ex) {
        if (ex.getStatusCode() == HttpStatus.UNAUTHORIZED) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("User is not authenticated");
        }

        return ResponseEntity
                .status(ex.getStatusCode())
                .body(ex.getReason());
    }

}
