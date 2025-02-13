package org.company.habit_tracker.enums;


public enum FrequencyEnum {
    DAILY("daily"),
    WEEKLY("weekly"),
    MONTHLY("monthly");

    private final String value;

    FrequencyEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }

    public static FrequencyEnum fromString(String value) {
        for (FrequencyEnum frequency : FrequencyEnum.values()) {
            if (frequency.value.equalsIgnoreCase(value)) {
                return frequency;
            }
        }
        throw new IllegalArgumentException("Unknown frequency: " + value);
    }
}