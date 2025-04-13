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
    }
};
