import React, { useEffect, useState, useCallback } from "react";
import { Button, Card, ListGroup, Spinner, Form, Dropdown, Collapse, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faEllipsisV, faEdit, faEye, faTimes, faUndo,faCheck, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import api from "../../util/api";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

const HabitList = ({ habits, loading, error, onHabitClick, onUpdateHabit }) => {
    const [elapsedTimes, setElapsedTimes] = useState({});
    const [showGoodHabits, setShowGoodHabits] = useState(true);
    const [showBadHabits, setShowBadHabits] = useState(true);
    const [logInputs, setLogInputs] = useState({});

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingHabit, setEditingHabit] = useState(null);

    const handleEditClick = useCallback((habit) => {
        setEditingHabit(habit);
        setShowEditModal(true);
    }, []);

    const handleCloseEditModal = useCallback(() => {
        setShowEditModal(false);
        setEditingHabit(null);
    }, []);

    const handleSaveEdit = useCallback(async () => {
        if (!editingHabit) return;

        const formattedReminder = editingHabit.reminder.includes(':')
            ? `${editingHabit.reminder}:00`
            : `${editingHabit.reminder}:00`;

        try {
            const response = await api.put(`/habits/${editingHabit.id}`, {
                name: editingHabit.name,
                description: editingHabit.description,
                frequency: editingHabit.frequency,
                goal: editingHabit.goal,
                startDate: editingHabit.startDate,
                reminder: formattedReminder
            });
            if (response.status !== 200) throw new Error("Failed to update habit.");
            onUpdateHabit(editingHabit.id);
            handleCloseEditModal();
        } catch (err) {
            console.error("Error updating habit:", err);
        }
    }, [editingHabit, onUpdateHabit, handleCloseEditModal]);

    const handleEditChange = useCallback((field, value) => {
        setEditingHabit((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleDeleteEdit = useCallback(async () => {
        if (!editingHabit) return;

        try {
            const response = await api.delete(`/habits/${editingHabit.id}`);
            if (response.status !== 200) throw new Error("Failed to delete habit.");
            alert("Habit deleted successfully.");
            onUpdateHabit(editingHabit.id);
            handleCloseEditModal();
        } catch (err) {
            console.error("Error deleting habit:", err);
        }
    });

    const handleArchiveEdit = useCallback(async () => {
        if (!editingHabit) return;

        try {
            const response = await api.put(`/habits/${editingHabit.id}`, {
                active: false,
            });
            if (response.status !== 200) throw new Error("Failed to archive habit.");
            alert("Habit archived successfully.");
            onUpdateHabit(editingHabit.id);
            handleCloseEditModal();
        } catch (err) {
            console.error("Error archiving habit:", err);
        }
    });

    const handleSuccess = useCallback(async (habitId) => {
        try {
            const response = await api.put(`/habits/${habitId}`, {
                status: "SUCCESS",
                endDate: dayjs().format("YYYY-MM-DD"),
            });
            if (response.status !== 200) throw new Error("Failed to update habit.");
            onUpdateHabit(habitId);
        } catch (err) {
            console.error("Error updating habit:", err);
        }
    }, [habits, onUpdateHabit]);

    const handleFail = useCallback(async (habitId) => {
        try {
            const response = await api.put(`/habits/${habitId}`, {
                status: "FAIL",
                endDate: dayjs().format("YYYY-MM-DD"),
            });
            if (response.status !== 200) throw new Error("Failed to update habit.");
            onUpdateHabit(habitId);
        } catch (err) {
            console.error("Error updating habit:", err);
        }
    }, [habits, onUpdateHabit]);

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTimes = {};
            habits.forEach((habit) => {
                const diff = dayjs.duration(dayjs().diff(dayjs(habit.createdAt)));
                const days = Math.floor(diff.asDays());
                const hours = diff.hours();
                const minutes = diff.minutes();
                const seconds = diff.seconds();
                updatedTimes[habit.id] = `${days > 0 ? `${days} days ` : ""}${hours}h ${minutes}m ${seconds}s`;
            });
            setElapsedTimes(updatedTimes);
        }, 1000);
        return () => clearInterval(interval);
    }, [habits]);

    const handleItemClick = useCallback((event, habit) => {
        if (event.target.closest("button, input, .dropdown")) {
            return;
        }
        onHabitClick(habit);
    }, [onHabitClick]);

    const handleMarkAsDone = useCallback(async (habitId) => {
        try {
            const response = await api.put(`/habit-logs/update/${habitId}`, {
                statusLog: "COMPLETED",
                achieved: habits.find((habit) => habit.id === habitId).goal
            });
            if (response.status !== 200) throw new Error("Failed to update habit.");
            onUpdateHabit(habitId);
        } catch (err) {
            console.error("Error updating habit:", err);
        }
    }, [habits, onUpdateHabit]);

    const handleLogInputChange = useCallback((habitId, value) => {
        setLogInputs((prev) => ({ ...prev, [habitId]: value }));
    }, []);

    const handleLogSubmit = useCallback(async (habitId) => {
        const logValue = logInputs[habitId];
        if (!logValue) return;

        try {
            const response = await api.put(`/habit-logs/update/${habitId}`, {
                achieved: logValue,
            });
            if (response.status !== 200) throw new Error("Failed to update log.");
            onUpdateHabit(habitId);
            setLogInputs((prev) => ({ ...prev, [habitId]: "" }));
        } catch (err) {
            console.error("Error updating log:", err);
        }
    }, [logInputs, onUpdateHabit]);

    const handleUndo = useCallback(async (habitId) => {
        try {
            const response = await api.put(`/habit-logs/update/${habitId}`, {
                statusLog: "PROGRESS",
                achieved: 0
            });
            if (response.status !== 200) throw new Error("Failed to undo habit.");
            onUpdateHabit(habitId); // Cập nhật lại danh sách habits
        } catch (err) {
            console.error("Error undoing habit:", err);
        }
    }, [onUpdateHabit]);

    const goodHabits = habits.filter((habit) => habit.habitType === "GOOD");
    const uncompletedGoodHabits = goodHabits.filter(habit => habit.achievedPeriod < habit.goal);
    const completedGoodHabits = goodHabits.filter(habit => habit.achievedPeriod >= habit.goal);
    const badHabits = habits.filter((habit) => habit.habitType === "BAD");

    return (
        <div>
            {loading && <div className="d-flex justify-content-center"><Spinner animation="border" /></div>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && (
                <>
                    {habits.length === 0 ? (
                        <Card className="habit_list_card text-center">
                            <Card.Body>
                                <Card.Title>No Habits Found</Card.Title>
                                <Card.Text>You haven't added any habits yet. Click the button below to add your first habit.</Card.Text>
                            </Card.Body>
                        </Card>
                    ) : (
                        <>
                            <h1>Today</h1>
                            {goodHabits.length > 0 && (
                                <div>
                                    <h5 className="text-success d-flex justify-content-between align-items-center">
                                        Good Habits
                                        <Button variant="link" onClick={() => setShowGoodHabits(!showGoodHabits)}>
                                            <FontAwesomeIcon icon={showGoodHabits ? faChevronUp : faChevronDown} />
                                        </Button>
                                    </h5>
                                    <Collapse in={showGoodHabits}>
                                        <div>
                                            <h6>In Progress</h6>
                                            <ListGroup className="mb-3">
                                                {uncompletedGoodHabits.map((habit) => (
                                                    <ListGroup.Item key={habit.id}
                                                                    className="habit-item d-flex justify-content-between align-items-center "
                                                                    onClick={(e) => handleItemClick(e, habit)}
                                                                    style={{cursor: "pointer"}}>
                                                        <div>
                                                            <h6>{habit.name}</h6>
                                                            <p>{habit.id}</p>
                                                            <p>{habit.frequency}</p>
                                                            <p>{habit.status}</p>
                                                            <p>{habit.description}</p>
                                                            <p>Reminder: {habit.reminder}</p>
                                                            <p>Goal: {habit.achievedPeriod}/{habit.goal}</p>
                                                        </div>

                                                        <div className="d-flex align-items-center">
                                                            <Button variant="success" className="mx-2"
                                                                    onClick={() => handleMarkAsDone(habit.id)}>
                                                                <FontAwesomeIcon icon={faCheckCircle}/> Quick Done
                                                            </Button>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Log progress"
                                                                className="mx-2"
                                                                style={{ width: '120px' }}
                                                                value={logInputs[habit.id] || ""}
                                                                onChange={(e) => handleLogInputChange(habit.id, e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") {
                                                                        handleLogSubmit(habit.id).then(r => console.log(r));
                                                                    }
                                                                }}
                                                            />
                                                            <Dropdown className="custom-dropdown">
                                                                <Dropdown.Toggle variant="link"
                                                                                 className="dropdown-toggle">
                                                                    <FontAwesomeIcon icon={faEllipsisV}/>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="custom-dropdown-menu">
                                                                    <Dropdown.Item onClick={() => handleEditClick(habit)}>
                                                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleSuccess(habit.id)}>
                                                                        <FontAwesomeIcon icon={faCheck} /> Success
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleFail(habit.id)}>
                                                                        <FontAwesomeIcon icon={faTimes}/> Fail
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>

                                            {completedGoodHabits.length > 0 && (
                                                <>
                                                    <h6>Success Period</h6>
                                                    <ListGroup>
                                                        {completedGoodHabits.map((habit) => (
                                                            <ListGroup.Item key={habit.id}
                                                                            className="habit-item d-flex justify-content-between align-items-center bg-light"
                                                                            onClick={(e) => handleItemClick(e, habit)}
                                                                            style={{
                                                                                cursor: "pointer",
                                                                                opacity: 0.5,
                                                                                textDecoration: "line-through"
                                                                            }}>
                                                                <div>
                                                                    <h6>
                                                                        {habit.name} - <span
                                                                        className="text-success">SUCCESS</span>
                                                                    </h6>
                                                                    <p>Goal: {habit.achievedPeriod}/{habit.goal}</p>
                                                                </div>
                                                                <div className="d-flex align-items-center">
                                                                    <Dropdown className="custom-dropdown">
                                                                        <Dropdown.Toggle variant="link"
                                                                                         className="dropdown-toggle">
                                                                            <FontAwesomeIcon icon={faEllipsisV}/>
                                                                        </Dropdown.Toggle>
                                                                        <Dropdown.Menu className="custom-dropdown-menu">
                                                                            <Dropdown.Item onClick={() => handleEditClick(habit)}>
                                                                                <FontAwesomeIcon icon={faEdit} /> Edit
                                                                            </Dropdown.Item>
                                                                            <Dropdown.Item onClick={() => handleUndo(habit.id)}>
                                                                                <FontAwesomeIcon icon={faUndo}/> Undo
                                                                            </Dropdown.Item>
                                                                        </Dropdown.Menu>
                                                                    </Dropdown>
                                                                </div>
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                </>
                                            )}
                                        </div>
                                    </Collapse>
                                </div>
                            )}

                            {badHabits.length > 0 && (
                                <div>
                                    <h5 className="text-danger d-flex justify-content-between align-items-center">
                                        Bad Habits
                                        <Button variant="link" onClick={() => setShowBadHabits(!showBadHabits)}>
                                            <FontAwesomeIcon icon={showBadHabits ? faChevronUp : faChevronDown}/>
                                        </Button>
                                    </h5>
                                    <Collapse in={showBadHabits}>
                                        <div>
                                            <ListGroup>
                                                {badHabits.map((habit) => (
                                                    <ListGroup.Item key={habit.id}
                                                                    className="habit-item d-flex justify-content-between align-items-center"
                                                                    onClick={(e) => handleItemClick(e, habit)}
                                                                    style={{cursor: "pointer"}}>
                                                        <div>
                                                            <h6>{habit.name}</h6>
                                                            <p>{habit.description}</p>
                                                            <p className="text-muted">Quit: {elapsedTimes[habit.id] || "0h 0m 0s"} ago</p>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <Dropdown className="custom-dropdown">
                                                                <Dropdown.Toggle variant="link"
                                                                                 className="dropdown-toggle">
                                                                    <FontAwesomeIcon icon={faEllipsisV}/>
                                                                </Dropdown.Toggle>
                                                                <Dropdown.Menu className="custom-dropdown-menu">
                                                                    <Dropdown.Item onClick={() => handleEditClick(habit)}>
                                                                        <FontAwesomeIcon icon={faEdit} /> Edit
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleSuccess(habit.id)}>
                                                                        <FontAwesomeIcon icon={faCheck} /> Success
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item onClick={() => handleFail(habit.id)}>
                                                                        <FontAwesomeIcon icon={faTimes} /> Fail
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </div>
                                    </Collapse>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {/* Modal Edit */}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Habit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Habit Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter habit name"
                                value={editingHabit?.name || ""}
                                onChange={(e) => handleEditChange("name", e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter description"
                                value={editingHabit?.description || ""}
                                onChange={(e) => handleEditChange("description", e.target.value)}
                            />
                        </Form.Group>

                        {editingHabit?.habitType === "GOOD" && (
                            <>
                                <Form.Group>
                                    <Form.Label>Frequency</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={editingHabit?.frequency || "daily"}
                                        onChange={(e) => handleEditChange("frequency", e.target.value)}
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
                                        value={editingHabit?.goal || ""}
                                        onChange={(e) => handleEditChange("goal", e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Reminder Time</Form.Label>
                                    <Form.Control
                                        type="time"
                                        value={editingHabit?.reminder || ""}
                                        onChange={(e) => handleEditChange("reminder", e.target.value)}
                                    />
                                </Form.Group>
                            </>
                        )}

                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={editingHabit?.startDate || ""}
                                onChange={(e) => handleEditChange("startDate", e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleDeleteEdit}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={handleArchiveEdit}>
                        Archive
                    </Button>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>




        </div>
    );
};

export default HabitList;