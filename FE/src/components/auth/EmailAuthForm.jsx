import React, { useState } from "react";
import { Form, Button, Collapse } from "react-bootstrap";

const EmailAuthForm = ({
                           mode,
                           email,
                           password,
                           confirmPassword,
                           setEmail,
                           setPassword,
                           setConfirmPassword,
                           handleEmailAuth,
                       }) => {
    const [showForm, setShowForm] = useState(false);
    const [firstClick, setFirstClick] = useState(true);

    const handleButtonClick = (e) => {
        if (firstClick) {
            e.preventDefault(); // Ngăn form submit ngay lần đầu
            setShowForm(true);
            setFirstClick(false);
        }
    };

    return (
        <Form onSubmit={(e) => {
            if (firstClick) {
                // Ngăn form submit lần đầu tiên khi người dùng nhấn vào button
                handleButtonClick(e);
            } else {
                // Sau khi form đã được mở, thực thi handleEmailAuth
                handleEmailAuth(e);
            }
        }}
              className="form_email"
        >
            <Collapse in={showForm}>
                <div>
                    <Form.Group controlId="formEmail" className="mb-3">
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter email"
                            required
                        />
                    </Form.Group>

                    <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                        />
                    </Form.Group>

                    {mode === "signup" && (
                        <Form.Group controlId="formConfirmPassword" className="mb-3">
                            <Form.Control
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm Password"
                                required
                            />
                        </Form.Group>
                    )}
                </div>
            </Collapse>

            <Button
                variant="success"
                type="submit"
                className="w-100"
                onClick={handleButtonClick}
            >
                {mode === "signin" ? "Sign In with Email" : "Sign Up with Email"}
            </Button>
        </Form>
    );
};

export default EmailAuthForm;
