import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../util/firebase.js";
import api from "../util/api.js";
import { storageService } from "../services/storageService.js";

export const useEmailAuth = (mode, setUser) => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleEmailAuth = async (email, password, confirmPassword) => {
        setError("");
        try {
            if (mode === "signup" && password !== confirmPassword) {
                setError("Passwords do not match");
                return;
            }

            const endpoint = mode === "signin" ? "/auth/login" : "/auth/signup";
            const response = await api.post(endpoint, { email, password });

            if (response.status === 200) {
                await auth.signOut();
                storageService.clearAll();

                if (mode === "signup") {
                    alert("Sign up successfully!");
                    return;
                }

                const { accessToken, refreshToken } = response.data;
                storageService.setAccessToken(accessToken);

                const isDevelopment = process.env.NODE_ENV === "development";
                let cookie = `refreshToken=${refreshToken}; path=/;`;
                if (!isDevelopment) cookie += " secure;";
                document.cookie = cookie;

                const userMe = (await api.get("/users/me")).data;
                storageService.setUser(userMe);
                setUser(userMe);
                navigate("/me");
            }
        } catch (err) {
            console.error("Email Auth Error:", err);
            if (err.response?.status === 401) {
                setError("Invalid email or password");
            } else {
                setError("Internet connection error");
            }
        }
    };

    return { handleEmailAuth, error, setError };
};
