export const STORAGE_KEYS = {
    USER: 'user',
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken'
};

export const storageService = {
    getUser() {
        const userData = localStorage.getItem(STORAGE_KEYS.USER);
        return userData ? JSON.parse(userData) : null;
    },

    setUser(user) {
        if (user) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        } else {
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
    },

    getAccessToken() {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    setAccessToken(token) {
        if (token) {
            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
        } else {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
        }
    },

    clearAll() {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    }
};
