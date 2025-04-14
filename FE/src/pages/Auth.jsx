import React, { useState } from "react";
import { Container, Card } from "react-bootstrap";
import { Spin } from "antd";
import TabSwitcher from "../components/auth/TabSwitcher";
import EmailAuthForm from "../components/auth/EmailAuthForm";
import GoogleAuthButton from "../components/auth/GoogleAuthButton";
import logo from "../../public/logo.png";
import "../css/Auth.css";

import { useEmailAuth } from "../hooks/useEmailAuth.js";
import { useGoogleAuth } from "../hooks/useGoogleAuth.js";

const Auth = ({ setUser }) => {
    const [mode, setMode] = useState("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailLoading, setEmailLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    const { handleEmailAuth, error: emailError, setError: setEmailError } = useEmailAuth(mode, setUser);
    const { handleGoogleAuth, error: googleError, setError: setGoogleError } = useGoogleAuth(setUser);

    const combinedError = emailError || googleError;

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setEmailLoading(true);
        await handleEmailAuth(email, password, confirmPassword);
        setEmailLoading(false);
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        await handleGoogleAuth();
        setGoogleLoading(false);
    };

    return (
        <Container className="auth_box d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <Card style={{ width: "400px" }}>
                <Card.Body>
                    <img className="logo" src={logo} alt="logo" style={{ width: 65, height: 48, display: "block", margin: "auto" }} />
                    <p className="welcome text-center">Welcome to JtracKer</p>
                    <p className="underwel text-center">Sign in to your account and start building good habits with JtracKer</p>

                    {combinedError && <p className="text-danger text-center">{combinedError}</p>}

                    <Spin spinning={emailLoading}>
                        <EmailAuthForm
                            mode={mode}
                            email={email}
                            password={password}
                            confirmPassword={confirmPassword}
                            setEmail={setEmail}
                            setPassword={setPassword}
                            setConfirmPassword={setConfirmPassword}
                            handleEmailAuth={handleEmailSubmit}
                        />
                    </Spin>

                    <Spin spinning={googleLoading}>
                        <GoogleAuthButton mode={mode} handleGoogleAuth={handleGoogleLogin} />
                    </Spin>

                    <TabSwitcher
                        mode={mode}
                        setMode={(m) => {
                            setMode(m);
                            setEmailError("");
                            setGoogleError("");
                        }}
                    />
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Auth;
