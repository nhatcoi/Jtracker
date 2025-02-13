import React, { useState, useEffect, useCallback } from "react";
import { Button, Spinner, Dropdown, Modal, Form } from "react-bootstrap";
import api from "../../util/api.js";
import HabitList from "./HabitList";
import HabitLogProgress from "./HabitLogProgress";

const MainJournal = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [habitListWidth, setHabitListWidth] = useState("100%");
    const [habitProgressWidth, setHabitProgressWidth] = useState("0%");
    const [selectedHabit, setSelectedHabit] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");

    const [habitName, setHabitName] = useState("");
    const [description, setDescription] = useState("");
    const [frequency, setFrequency] = useState("daily");
    const [goal, setGoal] = useState("");
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [reminderTime, setReminderTime] = useState("");


    const fetchHabits = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get("/habits/list", {
                params: {
                    status: "PROGRESS",
                    active: true,
                }
            });

            setHabits(response.data.content);
        } catch (err) {
            setError(err.message);
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const handleHabitClick = (habit) => {
        if (selectedHabit && selectedHabit.id === habit.id) {
            setSelectedHabit(null);
            setHabitProgressWidth("0%");
            setHabitListWidth("100%");
        } else {
            setSelectedHabit(habit);
            setHabitProgressWidth("30%");
            setHabitListWidth("70%");
        }
    };

    const handleOpenModal = (type) => {
        setModalType(type);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setHabitName("");
        setDescription("");
        setFrequency("daily");
        setGoal("");
        setStartDate("");
    };

    const handleCreateHabit = async () => {
        if (!habitName || !description || !startDate) return;

        const newHabit = {
            name: habitName,
            description,
            startDate,
            habitType: modalType === "good" ? "Good" : "Bad",
        };

        if (modalType === "good") {
            newHabit.frequency = frequency;
            newHabit.goal = parseInt(goal, 10);

            if (reminderTime) {
                newHabit.reminder = reminderTime.includes(':') ? `${reminderTime}:00` : `${reminderTime}:00`;
            }
        }

        try {
            await api.post("/habits", newHabit);
            fetchHabits();
            handleCloseModal();
        } catch (error) {
            console.error("Error creating habit:", error);
        }
    };


    const handleUpdateHabit = useCallback((habitId) => {
        fetchHabits();
    }, [fetchHabits]);

    return (
        <div className="main-journal p-3">
            <div className="top-bar">
                <h4>All Habits</h4>

                <Dropdown>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic" className="mb-3">
                        + Add Habits
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleOpenModal("good")}>
                            Create Good Habit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleOpenModal("bad")}>
                            Break Bad Habit
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className="resizable-container">
                <div className="resizable-box" style={{ width: habitListWidth }}>
                    <HabitList
                        habits={habits}
                        loading={loading}
                        error={error}
                        onHabitClick={handleHabitClick}
                        onUpdateHabit={handleUpdateHabit}
                    />
                </div>

                <div
                    className="resizable-box"
                    style={{
                        width: habitProgressWidth,
                        opacity: habitProgressWidth === "0%" ? 0 : 1,
                        transition: "width 0.4s ease-in-out, opacity 0.3s ease-in-out"
                    }}
                >
                    {selectedHabit && <HabitLogProgress habit={selectedHabit} />}
                </div>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === "good" ? "Create Good Habit" : "Break Bad Habit"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {/* Common Fields for Both Good and Bad Habits */}
                        <Form.Group>
                            <Form.Label>Habit Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter habit name"
                                value={habitName}
                                onChange={(e) => setHabitName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        {/* Fields for Good Habit */}
                        {modalType === "good" && (
                            <>
                                <Form.Group>
                                    <Form.Label>Frequency</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={frequency}
                                        onChange={(e) => setFrequency(e.target.value)}
                                    >
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                    </Form.Control>
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Goal</Form.Label>
                                    <Form.Control
                                        type="number"
                                        placeholder="Enter goal (e.g., 30 days)"
                                        value={goal}
                                        onChange={(e) => setGoal(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Reminder Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={reminderTime}
                                        onChange={(e) => setReminderTime(e.target.value)}
                                    />
                                </Form.Group>
                            </>
                        )}

                        {/* Common Start Date Field */}
                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </Form.Group>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleCreateHabit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MainJournal;
