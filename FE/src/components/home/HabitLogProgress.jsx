import React, { useEffect, useState } from "react";
import { Card, Row, Col, Progress, Form, Input, Button, Spin, Typography, Statistic, Divider, Alert, message, Tooltip, Switch, Empty, Badge } from "antd";
import { EditOutlined, SaveOutlined, FireOutlined, CheckCircleOutlined, CloseCircleOutlined, CalendarOutlined, TrophyOutlined, LineChartOutlined, HistoryOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import api from "src/util/api.js";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const HabitLogProgress = ({ habit }) => {
    const [habitLog, setHabitLog] = useState(null);
    const [habitStatus, setHabitStatus] = useState({ COMPLETED: 0, FAILED: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [habitNote, setHabitNote] = useState("");
    const [saving, setSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(true);

    const fetchHabitLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get(`/habit-logs/${habit.id}`);
            setHabitLog(response.data);
            // Initialize note with existing note if available
            if (response.data.notes) {
                setHabitNote(response.data.notes);
            } else {
                setHabitNote("");
            }
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
            message.success("Note saved successfully!");
        } catch (err) {
            message.error("Failed to save note.");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (habit && habit.id) {
            fetchHabitLogs();
            fetchHabitStatus();
        }
    }, [habit]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <Spin size="large" tip="Loading habit data..." />
            </div>
        );
    }

    if (error) {
        return (
            <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                style={{ marginBottom: 16 }}
            />
        );
    }

    if (!habitLog) {
        return (
            <Empty
                description="No data available for this habit yet"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
        );
    }

    const progress = (habitLog.achieved / habitLog.habit.goal) * 100;
    const streak = habitStatus.currentStreak || 0;
    const completed = habitStatus.completed || 0;
    const failed = habitStatus.failed || 0;
    const total = completed + failed;
    const successRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Determine progress status and color
    let progressStatus = "active";
    let progressColor = { from: '#108ee9', to: '#87d068' };
    
    if (progress >= 100) {
        progressStatus = "success";
        progressColor = { from: '#52c41a', to: '#52c41a' };
    } else if (progress < 30) {
        progressColor = { from: '#faad14', to: '#108ee9' };
    }

    return (
        <motion.div 
            className="habit-log-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div style={{ marginBottom: 24 }}>
                <Title level={3} style={{ margin: 0 }}>
                    <Badge 
                        status={habit.habitType === "GOOD" ? "success" : "error"} 
                        style={{ marginRight: 8 }}
                    />
                    {habitLog.habit.name}
                </Title>
                <Text type="secondary">
                    {habitLog.habit.description}
                </Text>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <Card 
                    className="habit-progress-card" 
                    style={{ 
                        marginBottom: 24,
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                    }}
                    title={
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <LineChartOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                            <span>Today's Progress</span>
                        </div>
                    }
                >
                    <div style={{ padding: '8px 0 16px' }}>
                        <Progress 
                            percent={Math.min(Math.round(progress), 100)} 
                            status={progressStatus}
                            strokeColor={{
                                '0%': progressColor.from,
                                '100%': progressColor.to,
                            }}
                            strokeWidth={12}
                        />
                        <div style={{ marginTop: 16, textAlign: 'center' }}>
                            <Text strong>Goal: {habitLog.achieved}/{habitLog.habit.goal}</Text>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <Card 
                            className="habit-info-card"
                            style={{ 
                                textAlign: 'center',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                                height: '100%'
                            }}
                            hoverable
                        >
                            <Statistic 
                                title="Current Streak"
                                value={streak}
                                suffix="days"
                                valueStyle={{ color: '#1890ff' }}
                                prefix={<FireOutlined />}
                            />
                        </Card>
                    </motion.div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                    >
                        <Card 
                            className="habit-info-card"
                            style={{ 
                                textAlign: 'center',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                                height: '100%'
                            }}
                            hoverable
                        >
                            <Statistic 
                                title="Completed"
                                value={completed}
                                suffix="days"
                                valueStyle={{ color: '#52c41a' }}
                                prefix={<CheckCircleOutlined />}
                            />
                        </Card>
                    </motion.div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.4 }}
                    >
                        <Card 
                            className="habit-info-card"
                            style={{ 
                                textAlign: 'center',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                                height: '100%'
                            }}
                            hoverable
                        >
                            <Statistic 
                                title="Failed"
                                value={failed}
                                suffix="days"
                                valueStyle={{ color: '#f5222d' }}
                                prefix={<CloseCircleOutlined />}
                            />
                        </Card>
                    </motion.div>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                    >
                        <Card 
                            className="habit-info-card"
                            style={{ 
                                textAlign: 'center',
                                borderRadius: 8,
                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                                height: '100%'
                            }}
                            hoverable
                        >
                            <Statistic 
                                title="Success Rate"
                                value={successRate}
                                suffix="%"
                                valueStyle={{ color: successRate >= 70 ? '#52c41a' : successRate >= 40 ? '#faad14' : '#f5222d' }}
                                prefix={<TrophyOutlined />}
                            />
                        </Card>
                    </motion.div>
                </Col>
            </Row>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
            >
                <Card 
                    className="habit-note-card" 
                    style={{ 
                        marginTop: 24,
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                    }}
                    title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <EditOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                <span>Habit Notes</span>
                            </div>
                            <div>
                                <Tooltip title="Toggle preview">
                                    <Switch 
                                        checkedChildren="Preview" 
                                        unCheckedChildren="Edit only" 
                                        defaultChecked 
                                        onChange={(checked) => setShowPreview(checked)}
                                        size="small"
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    }
                >
                    <Form layout="vertical" style={{ marginTop: 12 }}>
                        <Form.Item>
                            <TextArea
                                rows={4}
                                value={habitNote}
                                onChange={(e) => setHabitNote(e.target.value)}
                                placeholder="Write your notes here (Markdown supported)"
                                style={{ borderRadius: 4 }}
                            />
                            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    <HistoryOutlined /> Last updated: {habitLog.updatedAt ? dayjs(habitLog.updatedAt).format('YYYY-MM-DD HH:mm') : 'Never'}
                                </Text>
                                <Button 
                                    type="primary" 
                                    icon={<SaveOutlined />} 
                                    onClick={saveHabitNote} 
                                    loading={saving}
                                >
                                    Save Note
                                </Button>
                            </div>
                        </Form.Item>
                    </Form>

                    {showPreview && habitNote && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                        >
                            <Divider orientation="left">Preview</Divider>
                            <Card 
                                type="inner" 
                                className="note-preview" 
                                style={{ 
                                    background: "#fafafa", 
                                    marginTop: 16,
                                    borderRadius: 4 
                                }}
                            >
                                <ReactMarkdown>{habitNote}</ReactMarkdown>
                            </Card>
                        </motion.div>
                    )}
                </Card>
            </motion.div>
        </motion.div>
    );
};

export default HabitLogProgress;
