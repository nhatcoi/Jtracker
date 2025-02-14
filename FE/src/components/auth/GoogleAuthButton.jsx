import React from "react";
import { Button } from "react-bootstrap";
import googleLogo from "../../assests/google.svg";

const GoogleAuthButton = ({ mode, handleGoogleAuth }) => {
    return (
        <div className="my-3">
            <Button variant="white" onClick={handleGoogleAuth} className="google w-100 d-flex align-items-center justify-content-center">
                <img
                    alt="google-logo"
                    src={googleLogo} // Sử dụng hình ảnh đã import
                    style={{ width: "40px", height: "40px", marginRight: "10px" }}
                />
                {mode === "signin" ? "Sign In with Google" : "Sign Up with Google"}
            </Button>
        </div>
    );
};

export default GoogleAuthButton;