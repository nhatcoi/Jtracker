import api from '../util/api';
import { API_ENDPOINTS } from './endpoints';

export const habitsApi = {
    async getAll(params = {}) {
        try {
            const response = await api.get(API_ENDPOINTS.HABITS.LIST, { params });
            return response.data.content;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async create(habitData) {
        try {
            const response = await api.post(API_ENDPOINTS.HABITS.CREATE, habitData);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async update(id, habitData) {
        try {
            const response = await api.put(API_ENDPOINTS.HABITS.UPDATE(id), habitData);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async delete(id) {
        try {
            await api.delete(API_ENDPOINTS.HABITS.DELETE(id));
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    },

    async log(id, logData) {
        try {
            const response = await api.post(API_ENDPOINTS.HABITS.LOG(id), logData);
            return response.data;
        } catch (error) {
            throw new Error(error.message);
        }
    }
};
