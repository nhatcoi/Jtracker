import api from '../util/api';
import { API_ENDPOINTS } from './endpoints';
import { storageService } from '../services/storageService';
import { signOut as firebaseSignOut } from 'firebase/auth';

export const authApi = {
    async login(email, password) {
        const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
        await this.setToken(response.data);
        return response.data;
    },

    async googleAuth(idToken) {
        const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE, { idToken });
        this.setToken(response.data);
        return response.data;
    },

    setToken({accessToken, refreshToken}) {
        storageService.setAccessToken(accessToken);
        const isDevelopment = process.env.NODE_ENV === "development";
        let cookie = `refreshToken=${refreshToken}; path=/;`;
        if (!isDevelopment) cookie += " secure;";
        document.cookie = cookie;
    },

    async logout() {
        try {
            const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
            storageService.clearAll();
            return response;
        } catch (err) {
            console.error("API logout error", err);
            return null;
        }
    },

    async refreshToken() {
        const response = await api.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN);
        console.log("response.data.accessToken", response.data.accessToken);
        storageService.setAccessToken(response.data.accessToken);
        return response.data;
    },

    async signup(userData) {
        const response = await api.post(API_ENDPOINTS.AUTH.SIGNUP, userData);
        return response.data;
    }
};
