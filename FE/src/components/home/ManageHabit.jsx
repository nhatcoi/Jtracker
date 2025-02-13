import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Card, Form, Button, Spinner } from "react-bootstrap";
import api from "../../util/api.js";

const ManageHabit = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
    const [activeTab, setActiveTab] = useState("active");

    const fetchHabits = async (active) => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/habits/list", {
                params: { active }}
            );
            setHabits(response.data.content);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHabits(activeTab === "active");
    }, [activeTab]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <Row className="p-3">
            {/* Sidebar - Manage Habits */}
            <Col md={3}>
                <ListGroup>
                    <ListGroup.Item variant="light"><strong>Habits</strong></ListGroup.Item>
                    <ListGroup.Item
                        active={activeTab === "active"}
                        onClick={() => handleTabClick("active")}
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                    >
                        Active
                        {/*<span className="badge bg-secondary">{habits.filter((habit) => habit.active).length}</span>*/}
                    </ListGroup.Item>
                    <ListGroup.Item
                        active={activeTab === "archived"}
                        onClick={() => handleTabClick("archived")}
                        className="d-flex justify-content-between align-items-center"
                        style={{ cursor: "pointer" }}
                    >
                        Archived
                    </ListGroup.Item>

                    <ListGroup.Item variant="light"><strong>Logs</strong></ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">Habit Logs <span className="badge bg-secondary">{habits.length}</span></ListGroup.Item>
                </ListGroup>
            </Col>

            {/* Habits List */}
            <Col md={9}>
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h5>Habits</h5>
                        <span>{currentTime}</span>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <Spinner animation="border" />
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : (
                            <ListGroup>
                                {habits.map((habit) => (
                                    <ListGroup.Item key={habit.id} className="p-3 mb-2 bg-light border rounded">
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <span className="me-3 fs-4">{habit.icon || "📌"}</span>
                                                <div>
                                                    <h6 className="mb-1">{habit.name}</h6>
                                                    <small className="text-muted">{habit.description}</small>
                                                </div>
                                            </div>
                                            <div>
                                    <span
                                        className={`badge ${
                                            habit.status === "PROGRESS"
                                                ? "bg-warning"
                                                : habit.status === "COMPLETED"
                                                    ? "bg-success"
                                                    : "bg-secondary"
                                        }`}
                                    >
                                        {habit.status}
                                    </span>
                                            </div>
                                        </div>
                                        <hr className="my-2" />
                                        <div className="row">
                                            <div className="col-md-6">
                                                <p><strong>Frequency:</strong> {habit.frequency}</p>
                                                <p><strong>Goal:</strong> {habit.goal}</p>
                                                <p><strong>Type:</strong> {habit.habitType}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p><strong>Start Date:</strong> {habit.startDate}</p>
                                                <p><strong>End Date:</strong> {habit.endDate || "N/A"}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-2">
                                            <small className="text-muted">Created At: {habit.createdAt}</small>
                                            <span
                                                className={`badge ${
                                                    habit.active ? "bg-success" : "bg-danger"
                                                }`}
                                            >
                                    {habit.active ? "Active" : "Inactive"}
                                </span>
                                        </div>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ManageHabit;