import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Card, Spinner, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faBoxesStacked, faGear, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import api from "../../util/api.js";
import googleLogo from "../../assests/google.svg"
import emailLogo from "../../assests/email.svg"

const SideBar = ({ user, sidebarWidth, setSidebarWidth, onSignOut }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (showPopup) {
            fetchUserInfo().then(r => r);
        }
    }, [showPopup]);

    const fetchUserInfo = async () => {
        setLoading(true);
        try {
            const response = await api.get("/users/me");
            console.log(response.data);
            setUserInfo(response.data);
        } catch (err) {
            setError(err.message);
            console.log(error)
        }
        setLoading(false);
    };

    const handleChangePassword = async () => {
        try {
            const { oldPassword, newPassword } = userInfo;
            if (!oldPassword || !newPassword) {
                alert("Please enter both old and new passwords.");
                return;
            }
            const response = await api.post("/users/reset-password", {
                oldPassword,
                newPassword,
            });
            alert("Password changed successfully!");
            setShowPopup(false);
        } catch (error) {
            alert("Failed to change password: " + error.message);
        }
    };

    const toggleSidebar = () => {
        if (isCollapsed) {
            setSidebarWidth("25%");
        } else {
            setSidebarWidth("5%");
        }
        setIsCollapsed(!isCollapsed);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            [name]: value
        }));
    };

    const handleUpdateUserInfo = async (field, value) => {
        try {
            const updatedUser = await api.put("/users", {
                ...userInfo,
                [field]: value
            });

            if (updatedUser) {
                setUserInfo(updatedUser);
            }

            console.log("User info updated successfully");
        } catch (error) {
            console.error("Failed to update user info:", error);
        }
    };

    return (
        <div className="resizable-box sidebar" style={{ width: sidebarWidth }}>
            <div className="d-flex flex-column p-3 bg-light vh-100">
                <Button
                    variant="outline-secondary"
                    className="collapse-btn"
                    onClick={toggleSidebar}
                >
                    <FontAwesomeIcon icon={faBars} />
                </Button>

                {sidebarWidth !== "5%" && (
                    <div className="mb-4 text-center">
                        <img
                            alt="Avatar"
                            src={userInfo?.avatar || "data:image/jpeg;base64,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"}
                            // src={user?.photoURL || user?.avatar || "https://via.placeholder.com/150"}
                            className="rounded-circle"
                            width="80"
                            height="80"
                            style={{ cursor: "pointer" }}
                            onClick={() => setShowPopup(true)}
                        />
                        <h5 className="mt-2">
                            {userInfo?.firstname || "Hello World!"}
                        </h5>
                    </div>
                )}

                {sidebarWidth !== "5%" && (
                    <ListGroup>
                        <ListGroup.Item action onClick={() => navigate("/me/habits")}>
                            <FontAwesomeIcon icon={faBoxesStacked} className="me-2" />
                            All Habits
                        </ListGroup.Item>
                        <h6 className="mt-3">AREAS</h6>
                        <ListGroup.Item action onClick={() => navigate("/me/manage")}>
                            <FontAwesomeIcon icon={faPlus} />
                            Manage Habits
                        </ListGroup.Item>
                        <h6 className="mt-3">PREFERENCES</h6>
                        <ListGroup.Item action onClick={() => setShowPopup(true)}>
                            <FontAwesomeIcon icon={faGear} />
                            App Settings
                        </ListGroup.Item>
                    </ListGroup>
                )}

                {sidebarWidth !== "5%" && (
                    <Button variant="danger" className="mt-auto" onClick={onSignOut}>
                        Sign Out
                    </Button>
                )}

                {/* Popup */}
                <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {loading ? (
                            <div className="text-center">
                                <Spinner animation="border" size="sm" />
                            </div>
                        ) : userInfo ? (
                            <>
                                {/* Avatar + Input */}
                                <div className="d-flex align-items-center gap-4 mb-3">
                                    <img
                                        src={userInfo?.avatar || "data:image/jpeg;base64,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"}
                                        alt="User Avatar"
                                        className="rounded-circle"
                                        width="80"
                                        height="80"
                                    />
                                    <div>

                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="text"
                                                name="firstname"
                                                value={userInfo.firstname}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault(); // Ngăn submit form
                                                        handleUpdateUserInfo("firstname", e.target.value);
                                                    }
                                                }}
                                                placeholder="First name"
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Control
                                                type="text"
                                                name="lastname"
                                                value={userInfo.lastname}
                                                onChange={handleInputChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault();
                                                        handleUpdateUserInfo("lastname", e.target.value);
                                                    }
                                                }}
                                                placeholder="Last name"
                                            />
                                        </Form.Group>
                                    </div>
                                </div>


                                {/* Sign-In Method */}
                                <h6>SIGN-IN METHOD</h6>
                                <Card className="p-2 mb-3">
                                    <p className="mb-1">
                                        <img
                                            src={userInfo?.provider === "GOOGLE" ? googleLogo : emailLogo}
                                            alt={userInfo?.provider === "GOOGLE" ? "Google Logo" : "Email Icon"}
                                            width="30"
                                            className="me-2"
                                        />
                                        {userInfo.email}
                                    </p>
                                    {/*<Button variant="outline-primary" size="sm">*/}
                                    {/*    Link Email*/}
                                    {/*</Button>*/}
                                </Card>
                                {!(userInfo?.provider === "GOOGLE") && (
                                    <>
                                        <h6>Reset Password</h6>
                                        <Form>
                                            <Form.Group className="mb-3">
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Enter old password"
                                                    name="oldPassword"
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <Form.Control
                                                    type="password"
                                                    placeholder="Enter new password"
                                                    name="newPassword"
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Group>

                                            <Button variant="primary" onClick={handleChangePassword}>
                                                Confirm
                                            </Button>
                                        </Form>
                                    </>
                                )}

                                {/*/!* Caution Zone *!/*/}
                                {/*<h6 className="text-danger">CAUTION ZONE</h6>*/}

                                {/*<Card className="caution-zone p-2 mb-2">*/}
                                {/*    <div className="d-flex justify-content-between align-items-center gap-3">*/}
                                {/*        <p className="mb-0">All of your habit data has been reset.</p>*/}
                                {/*        <Button variant="outline-danger" size="sm"*/}
                                {/*                className="border-danger text-danger bg-white">*/}
                                {/*            Delete*/}
                                {/*        </Button>*/}
                                {/*    </div>*/}
                                {/*</Card>*/}

                                {/*<Card className="caution-zone p-2 mb-2">*/}
                                {/*    <div className="d-flex justify-content-between align-items-center gap-3">*/}
                                {/*        <p className="mb-0">Delete all habits, all progress and go back to ground*/}
                                {/*            zero.</p>*/}
                                {/*        <Button variant="outline-danger" size="sm"*/}
                                {/*                className="border-danger text-danger bg-white">*/}
                                {/*            Delete*/}
                                {/*        </Button>*/}
                                {/*    </div>*/}
                                {/*</Card>*/}

                                {/*<Card className="caution-zone p-2">*/}
                                {/*    <div className="d-flex justify-content-between align-items-center gap-3">*/}
                                {/*        <p className="mb-0">Remove all progress from your habit lists.</p>*/}
                                {/*        <Button variant="outline-warning" size="sm"*/}
                                {/*                className="border-danger text-danger bg-white">*/}
                                {/*            Reset*/}
                                {/*        </Button>*/}
                                {/*    </div>*/}
                                {/*</Card>*/}
                            </>
                        ) : (
                            <p className="text-muted">No user data found.</p>
                        )}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default SideBar;
