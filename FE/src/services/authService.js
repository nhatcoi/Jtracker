import { auth } from '../util/firebase.js';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { authApi } from '../api/authApi.js';
import { userApi } from '../api/userApi.js';
import { storageService } from './storageService';

class AuthService {
    async login({ email, password }) {
        const response = await authApi.login(email, password);
        return response;
    }

    async signup({ email, password }) {
        const response = await authApi.signup({ email, password });
        return response;
    }

    async googleAuth(idToken) {
        try {
            const authData = await authApi.googleAuth(idToken);
            this.setSession(authData);
            const userData = await userApi.getMe();
            storageService.setUser(userData);
            return userData;
        } catch (error) {
            console.error('Google auth error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const accessToken = storageService.getAccessToken();
            if (accessToken) {
                await authApi.logout();
            }
            this.clearSession();
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Error during logout:', error);
            throw error;
        }
    }

    clearSession() {
        storageService.clearAll();
    }

    setSession(authData) {
        storageService.setAccessToken(authData.accessToken);
        const isDevelopment = process.env.NODE_ENV === 'development';
        let cookieString = `refreshToken=${authData.refreshToken}; path=/;`;
        if (!isDevelopment) {
            cookieString += ' secure;';
        }
        document.cookie = cookieString;
    }

    isAuthenticated() {
        return !!storageService.getAccessToken();
    }
}

export const authService = new AuthService();
