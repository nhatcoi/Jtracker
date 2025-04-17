import api from '../util/api';
import { API_ENDPOINTS } from './endpoints';
import {storageService} from "src/services/storageService.js";

export const userApi = {
    async getMe() {
        const response = await api.get(API_ENDPOINTS.USER.ME);
        storageService.setUser(response.data);
        return response.data;
    },

    async updateProfile(userData) {
        const response = await api.put(API_ENDPOINTS.USER.UPDATE, userData);
        storageService.setUser(response.data);
        return response.data;
    },

    async changePassword(oldPassword, newPassword) {
        const response = await api.put(API_ENDPOINTS.USER.CHANGE_PASSWORD, {
            oldPassword,
            newPassword
        });
        return response.data;
    }

};
