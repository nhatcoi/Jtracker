import React, { useEffect, useState } from "react";
import { ProgressBar, Card, Row, Col, Form, Button, Spinner } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import api from "src/util/api.js";

const HabitLogProgress = ({ habit }) => {
    const [habitLog, setHabitLog] = useState(null);
    const [habitStatus, setHabitStatus] = useState({ COMPLETED: 0, FAILED: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [habitNote, setHabitNote] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchHabitLogs = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/habit-logs/${habit.id}`);
            setHabitLog(response.data);
        } catch (err) {
            setError("Failed to fetch habit logs.");
        } finally {
            setLoading(false);
        }
    };

    const fetchHabitStatus = async () => {
        try {
            const response = await api.get(`/habit-logs/status-counts/${habit.id}`);
            setHabitStatus(response.data);
        } catch (err) {
            console.error("Failed to fetch habit status.");
        }
    };

    const saveHabitNote = async () => {
        if (!habitNote.trim()) return;

        setSaving(true);
        try {
            await api.put(`/habit-logs/${habitLog.id}`, {
                notes: habitNote
            });
            alert("Note saved successfully!");
        } catch (err) {
            alert("Failed to save note.");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        fetchHabitLogs();
        fetchHabitStatus();
    }, [habit]);

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!habitLog) {
        return <div>No data available.</div>;
    }

    // Calculate progress
    const progress = (habitLog.achieved / habitLog.habit.goal) * 100;
    const streak = habitStatus.currentStreak || 0;
    const completed = habitStatus.completed || 0;
    const failed = habitStatus.failed || 0;
    const total = completed + failed;

    return (
        <div className="p-3">
            <h4 className="mb-3">Habit Progress</h4>

            <Card className="p-3 mb-3">
                <h5>Today's Progress</h5>
                <ProgressBar now={progress} label={`${Math.round(progress)}%`} />
            </Card>

            <Row className="g-3">
                <Col xs={12} md={6}>
                    <Card className="p-3 text-center">
                        <h6>Current Streak</h6>
                        <p className="fw-bold">{streak} days</p>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className="p-3 text-center">
                        <h6>Completed</h6>
                        <p className="fw-bold">{completed} days</p>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className="p-3 text-center">
                        <h6>Failed</h6>
                        <p className="fw-bold">{failed} days</p>
                    </Card>
                </Col>
                <Col xs={12} md={6}>
                    <Card className="p-3 text-center">
                        <h6>Total</h6>
                        <p className="fw-bold">{total} times</p>
                    </Card>
                </Col>
            </Row>

            <Card className="p-3 mt-3">
                <h5>Habit Notes</h5>
                <p>(Markdown support)</p>
                <Form>
                    <Form.Group controlId="habitNote">
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Write your habit note in Markdown..."
                            value={habitNote}
                            onChange={(e) => setHabitNote(e.target.value)}
                        />
                    </Form.Group>
                    <Button className="mt-2" variant="primary" onClick={saveHabitNote} disabled={saving}>
                        {saving ? <Spinner size="sm" animation="border" /> : "Save Note"}
                    </Button>
                </Form>

                {habitNote && (
                    <Card className="p-2 mt-3 bg-light">
                        <h6>Preview</h6>
                        <ReactMarkdown>{habitNote}</ReactMarkdown>
                    </Card>
                )}
                {habitLog.notes && (
                    <Card className="p-2 mt-3 bg-light">
                        <h6>Previous Note</h6>
                        <ReactMarkdown>{habitLog.notes}</ReactMarkdown>
                    </Card>
                )}
            </Card>
        </div>
    );
};

export default HabitLogProgress;
