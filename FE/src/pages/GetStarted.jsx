import React from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css";

const GetStarted = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/auth");
    };

    return (
        <div className="bgd d-flex justify-content-center align-items-center vh-100">
            <Card className="frame p-4 text-center get-started-card">
                <h1>Build Strong Habits</h1>
                <h1>Live a Stronger Life</h1>
                <p>Welcome to JTracker. Click the button below to start!</p>
                <div className="button-container">
                    <button className="Btn animated-button" onClick={handleGetStarted}>
                        Get Started
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default GetStarted;
