export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        SIGNUP: '/auth/signup',
        GOOGLE: '/auth/google'
    },
    USER: {
        ME: '/users/me',
        UPDATE: '/users',
        CHANGE_PASSWORD: '/users/reset-password',
    },
    HABITS: {
        LIST: '/habits/list',
        CREATE: '/habits',
        UPDATE: (id) => `/habits/${id}`,
        DELETE: (id) => `/habits/${id}`,
        LOG: (id) => `/habits/${id}/logs`
    },
    HABIT_LOGS: {
        LIST: `/habit-logs`,
        UPDATE_BY_HABIT: (habitId) => `/habit-logs/update/${habitId}`,
        UPDATE_BY_ID: (habitLogId) => `/habit-logs/${habitLogId}`,
        GET_COUNTS: (habitId) => `/habit-logs/status-counts/{habitId}`
    }
};
