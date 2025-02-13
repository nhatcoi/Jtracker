import axios from 'axios';
import refreshAccessToken from "./token";

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

function waitForToken(maxWaitTime = 5000, intervalTime = 100) {
    return new Promise((resolve, reject) => {
        let elapsed = 0;
        const interval = setInterval(() => {
            const token = sessionStorage.getItem("accessToken");
            if (token) {
                clearInterval(interval);
                resolve(token);
            }
            elapsed += intervalTime;
            if (elapsed >= maxWaitTime) {
                clearInterval(interval);
                reject(new Error("Token không có giá trị sau 5 giây"));
            }
        }, intervalTime);
    });
}

api.interceptors.request.use(
    async (config) => {
        let token = sessionStorage.getItem("accessToken");

        if (!token) {
            try {
                token = await waitForToken();
            } catch (error) {
                console.error("Server error, Token not ready", error);
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 403) {
            console.log("Access token hết hạn, đang refresh...");
            const newAccessToken = await refreshAccessToken();

            if (newAccessToken) {
                sessionStorage.setItem("accessToken", newAccessToken);
                error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return api.request(error.config);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
