import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../util/firebase.js";
import {userApi} from "src/api/userApi.js";
import {authApi} from "src/api/authApi.js";

export const useGoogleAuth = (setUser) => {
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken(true);

            await authApi.googleAuth(idToken);
            const userMe = (await userApi.getMe());
            setUser(userMe);
            navigate("/me");
        } catch (err) {
            console.error("Google Auth Error:", err);
            if (err.response?.status === 401) {
                setError("Error with Google authentication");
            } else {
                setError("Internet connection error");
            }
        }
    };

    return { handleGoogleAuth, error, setError };
};
