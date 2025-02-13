import api from "./api";

const refreshAccessToken = async () => {
    try {
        const response = await api.post(
            "/auth/refresh",
            {},
            { withCredentials: true }
        );
        return response.data.accessToken;
    } catch (error) {
        console.error("Lỗi khi refresh access token:", error);
        return null;
    }
};

export default refreshAccessToken;
