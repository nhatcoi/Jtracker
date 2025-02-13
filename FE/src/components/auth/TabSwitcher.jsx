import React from "react";

const TabSwitcher = ({ mode, setMode, clearError }) => {
    return (
        <div className="text-center mb-3">
            <span
                onClick={() => {
                    setMode("signin");
                    clearError();
                }}
                style={{
                    cursor: "pointer",
                    fontWeight: mode === "signin" ? "bold" : "normal",
                    marginRight: "15px",
                    textDecoration: mode === "signin" ? "underline" : "none",
                }}
            >
                Sign In
            </span>
            <span
                onClick={() => {
                    setMode("signup");
                    clearError();
                }}
                style={{
                    cursor: "pointer",
                    fontWeight: mode === "signup" ? "bold" : "normal",
                    textDecoration: mode === "signup" ? "underline" : "none",
                }}
            >
                Sign Up
            </span>
        </div>
    );
};

export default TabSwitcher;
