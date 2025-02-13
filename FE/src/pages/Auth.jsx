// auth.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import TabSwitcher from "../components/auth/TabSwitcher.jsx";
import EmailAuthForm from "../components/auth/EmailAuthForm.jsx";
import GoogleAuthButton from "../components/auth/GoogleAuthButton.jsx";
import "../css/Auth.css"
import { auth, googleProvider } from "../util/firebase.js";
import { signInWithPopup } from "firebase/auth";
import apiDefault from "../util/apiDefault.js";
import api from "../util/api.js";
import logo from "../assests/logo.png";


const Auth = ({ setUser }) => {
    const [mode, setMode] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const idToken = await user.getIdToken();

            const endpoint = "/auth/google";
            const requestData = { idToken };
            const response = await apiDefault.post(endpoint, requestData, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });

            if (response.status !== 200) {
                throw new Error(
                    `Cannot ${mode === "signin" ? "sign in" : "sign up"} with Google`
                );
            }
            const data = response.data;

            sessionStorage.setItem("accessToken", data.accessToken);
            const isDevelopment = process.env.NODE_ENV === "development";
            let cookieString = `refreshToken=${data.refreshToken}; path=/;`;
            if (!isDevelopment) {
                cookieString += " secure;";
            }
            document.cookie = cookieString;
            const userMe = await api.get("/users/me");

            setUser(userMe);
            navigate("/me");
        } catch (error) {
            console.error("Error with Google auth:", error);
            if (error.response && error.response.status === 401) {
                setError("Error with Google authentication");
            } else {
                setError("An unknown error occurred");
            }
        }
    };


    const handleEmailAuth = async (e) => {
        e.preventDefault();
        try {
            if (mode === "signup" && password !== confirmPassword) {
                alert("Passwords do not match");
                throw new Error("Passwords do not match");
            }

            const endpointSignin = "/auth/login";
            const endpointSignup = "/auth/signup";

            const endpoint =
                mode === "signin"
                    ? endpointSignin
                    : endpointSignup;

            const requestData = { email, password };
            const response = await apiDefault.post(endpoint, requestData);

            if (response.status === 200) {
                if (mode === "signup") {
                    alert("Sign up successfully!");
                } else {
                    const tokenResponse = response.data;
                    sessionStorage.setItem("accessToken", tokenResponse.accessToken);
                    const isDevelopment = process.env.NODE_ENV === "development";
                    let cookieString = `refreshToken=${tokenResponse.refreshToken}; path=/;`;
                    if (!isDevelopment) {
                        cookieString += " secure;";
                    }
                    document.cookie = cookieString;
                    const userMe = await api.get("/users/me");
                    setUser(userMe);
                    navigate("/me");
                }
            } else {
                throw new Error("Error with authentication");
            }
        } catch (error) {
            console.error("Error with email auth:", error);
            if (error.status === 401 && mode === "signin") {
                setError("Email or password incorrectly");
            }
            if (error.status === 403 && mode === "signup") {
                setError("Email already exists");
            }
        }
    };

    return (
        <Container
            className="auth_box d-flex justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
        >
            <Card style={{ width: "400px" }}>
                <Card.Body>
                    <img
                        className={"logo"}
                        src={logo}
                        alt="logo"
                        style={{ width: "65px", height: "48px", display: "block", margin: "auto" }}
                    />
                    <p className="welcome text-center">Welcome to JtracKer</p>
                    <p className="underwel text-center">Sign in to your account and start building good habits with
                        JtracKer</p>

                    {error && <p className="text-danger text-center">{error}</p>}

                    <EmailAuthForm
                        mode={mode}
                        email={email}
                        password={password}
                        confirmPassword={confirmPassword}
                        setEmail={setEmail}
                        setPassword={setPassword}
                        setConfirmPassword={setConfirmPassword}
                        handleEmailAuth={ handleEmailAuth }
                    />


                    <GoogleAuthButton mode={mode} handleGoogleAuth={ handleGoogleAuth }/>

                    <TabSwitcher
                        mode={mode}
                        setMode={setMode}
                        clearError={() => setError("")}
                    />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Auth;
