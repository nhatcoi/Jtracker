import React, { useState, useEffect, useCallback } from "react";
import { Button, Spin, Dropdown, Modal, Form, Input, Select, DatePicker, TimePicker, Layout, Typography, Menu, Card, Tabs, Empty, message, Tooltip, Space, Divider, Badge, Avatar } from "antd";
import { PlusOutlined, CalendarOutlined, ClockCircleOutlined, TrophyOutlined, FireOutlined, LeftOutlined, RightOutlined, BookOutlined, StarOutlined, ThunderboltOutlined } from "@ant-design/icons";
import api from "../../util/api.js";
import HabitList from "./HabitList";
import HabitLogProgress from "./HabitLogProgress";
import dayjs from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import {habitsApi} from "src/api/habitsApi.js";

const { Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const MainJournal = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedHabit, setSelectedHabit] = useState(null);
    const [collapsed, setCollapsed] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("");

    const [habitName, setHabitName] = useState("");
    const [description, setDescription] = useState("");
    const [frequency, setFrequency] = useState("daily");
    const [goal, setGoal] = useState("");
    const [startDate, setStartDate] = useState(dayjs());
    const [reminderTime, setReminderTime] = useState(null);

    const fetchHabits = async () => {
        setLoading(true);
        setError(null);
        try {
            const habitsData = await habitsApi.getAll({
                status: "PROGRESS",
                active: true
            });
            setHabits(habitsData);
        } catch (err) {
            setError(err.message);
            message.error("Failed to load habits");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const handleHabitClick = (habit) => {
        if (selectedHabit && selectedHabit.id === habit.id) {
            setSelectedHabit(null);
        } else {
            setSelectedHabit(habit);
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
        setStartDate(dayjs());
        setReminderTime(null);
    };

    const handleCreateHabit = async () => {
        if (!habitName || !description || !startDate) {
            message.warning("Please fill in all required fields");
            return;
        }

        const newHabit = {
            name: habitName,
            description,
            startDate: startDate.format("YYYY-MM-DD"),
            habitType: modalType === "good" ? "GOOD" : "BAD",
        };

        if (modalType === "good") {
            newHabit.frequency = frequency;
            newHabit.goal = parseInt(goal, 10);
            if (reminderTime) {
                newHabit.reminder = reminderTime.format("HH:mm:ss");
            }
        }

        try {
            await habitsApi.create(newHabit);
            message.success(`${modalType === "good" ? "Good" : "Bad"} habit created successfully!`);
            fetchHabits();
            handleCloseModal();
        } catch (error) {
            console.error("Error creating habit:", error);
            message.error(error.message || "Failed to create habit");
        }
    };

    const handleUpdateHabit = useCallback((habitId) => {
        fetchHabits();
    }, []);

    const items = [
        {
            key: "good",
            label: "Create Good Habit",
            icon: <StarOutlined />,
            onClick: () => handleOpenModal("good")
        },
        {
            key: "bad",
            label: "Break Bad Habit",
            icon: <ThunderboltOutlined />,
            onClick: () => handleOpenModal("bad")
        }
    ];

    const goodHabits = habits.filter(h => h.habitType === "GOOD").length;
    const badHabits = habits.filter(h => h.habitType === "BAD").length;

    return (
        <Layout className="main-journal" style={{ minHeight: "100vh" }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ padding: "24px 24px 0" }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                    <div>
                        <Title level={3} style={{ margin: 0 }}>
                            <BookOutlined style={{ marginRight: 12, color: "#1890ff" }} />
                            My Habit Journal
                        </Title>
                        <Text type="secondary">
                            Track your progress and build better habits
                        </Text>
                    </div>
                    <Dropdown 
                        menu={{ items }} 
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button type="primary" icon={<PlusOutlined />} size="large">
                            Add Habit
                        </Button>
                    </Dropdown>
                </div>

                <div style={{ marginBottom: 24 }}>
                    <Card 
                        style={{ 
                            borderRadius: 8,
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
                        }}
                    >
                        <Space size="large">
                            <Statistic 
                                title="Total Habits" 
                                value={habits.length} 
                                prefix={<BookOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                            <Statistic 
                                title="Good Habits" 
                                value={goodHabits} 
                                prefix={<StarOutlined />}
                                valueStyle={{ color: '#52c41a' }}
                            />
                            <Statistic 
                                title="Bad Habits" 
                                value={badHabits} 
                                prefix={<ThunderboltOutlined />}
                                valueStyle={{ color: '#f5222d' }}
                            />
                        </Space>
                    </Card>
                </div>
            </motion.div>

            <Layout style={{ padding: "0 24px 24px" }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <Layout style={{ background: "#fff", borderRadius: 8, overflow: "hidden", boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)' }}>
                        <Sider 
                            width={collapsed ? 80 : (selectedHabit ? 400 : "100%")} 
                            style={{ 
                                background: "#fff", 
                                borderRight: selectedHabit ? "1px solid #f0f0f0" : "none",
                                transition: "all 0.3s ease",
                                height: "calc(100vh - 220px)",
                                overflow: "auto",
                                position: "relative"
                            }}
                        >
                            {selectedHabit && (
                                <div 
                                    style={{ 
                                        position: "absolute", 
                                        right: 0, 
                                        top: "50%", 
                                        transform: "translateY(-50%)",
                                        zIndex: 10,
                                        background: "#fff",
                                        borderRadius: "4px 0 0 4px",
                                        boxShadow: "-2px 0 8px rgba(0, 0, 0, 0.09)"
                                    }}
                                >
                                    <Button 
                                        type="text" 
                                        icon={collapsed ? <RightOutlined /> : <LeftOutlined />}
                                        onClick={() => setCollapsed(!collapsed)}
                                        style={{ padding: "16px 8px" }}
                                    />
                                </div>
                            )}
                            
                            {loading ? (
                                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                                    <Spin size="large" tip="Loading habits..." />
                                </div>
                            ) : collapsed ? (
                                <div style={{ padding: "20px 0", textAlign: "center" }}>
                                    <Space direction="vertical" size="large">
                                        <Tooltip title="Good Habits">
                                            <Badge count={goodHabits} offset={[0, 8]}>
                                                <Avatar style={{ backgroundColor: '#52c41a' }} icon={<StarOutlined />} />
                                            </Badge>
                                        </Tooltip>
                                        <Tooltip title="Bad Habits">
                                            <Badge count={badHabits} offset={[0, 8]}>
                                                <Avatar style={{ backgroundColor: '#f5222d' }} icon={<ThunderboltOutlined />} />
                                            </Badge>
                                        </Tooltip>
                                    </Space>
                                </div>
                            ) : (
                                <HabitList
                                    habits={habits}
                                    loading={loading}
                                    error={error}
                                    onHabitClick={handleHabitClick}
                                    onUpdateHabit={handleUpdateHabit}
                                />
                            )}
                        </Sider>

                        <AnimatePresence>
                            {selectedHabit && (
                                <Content 
                                    style={{ 
                                        padding: "24px",
                                        overflow: "auto",
                                        height: "calc(100vh - 220px)",
                                    }}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <HabitLogProgress habit={selectedHabit} />
                                    </motion.div>
                                </Content>
                            )}
                        </AnimatePresence>
                    </Layout>
                </motion.div>
            </Layout>

            <Modal
                title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                        {modalType === "good" ? (
                            <>
                                <StarOutlined style={{ color: "#52c41a", marginRight: 8 }} />
                                Create Good Habit
                            </>
                        ) : (
                            <>
                                <ThunderboltOutlined style={{ color: "#f5222d", marginRight: 8 }} />
                                Break Bad Habit
                            </>
                        )}
                    </div>
                }
                open={showModal}
                onCancel={handleCloseModal}
                onOk={handleCreateHabit}
                okText="Save"
                cancelText="Cancel"
                width={600}
                centered
            >
                <Form layout="vertical">
                    <Form.Item 
                        label="Habit Name" 
                        required 
                        rules={[{ required: true, message: 'Please enter a habit name' }]}
                    >
                        <Input
                            placeholder="Enter habit name"
                            value={habitName}
                            onChange={(e) => setHabitName(e.target.value)}
                            prefix={modalType === "good" ? <StarOutlined /> : <ThunderboltOutlined />}
                        />
                    </Form.Item>

                    <Form.Item 
                        label="Description" 
                        required
                        rules={[{ required: true, message: 'Please enter a description' }]}
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Item>

                    {modalType === "good" && (
                        <>
                            <Form.Item label="Frequency">
                                <Select 
                                    value={frequency} 
                                    onChange={setFrequency}
                                    suffixIcon={<CalendarOutlined />}
                                >
                                    <Select.Option value="daily">Daily</Select.Option>
                                    <Select.Option value="weekly">Weekly</Select.Option>
                                    <Select.Option value="monthly">Monthly</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item 
                                label="Goal"
                                required={modalType === "good"}
                                rules={[{ required: modalType === "good", message: 'Please enter a goal' }]}
                            >
                                <Input
                                    type="number"
                                    placeholder="Enter goal (e.g., 30 days)"
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    prefix={<TrophyOutlined />}
                                    suffix="days"
                                />
                            </Form.Item>

                            <Form.Item label="Reminder Time">
                                <TimePicker 
                                    value={reminderTime} 
                                    onChange={setReminderTime} 
                                    format="HH:mm"
                                    placeholder="Select time"
                                    style={{ width: "100%" }}
                                    suffixIcon={<ClockCircleOutlined />}
                                />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item 
                        label="Start Date"
                        required
                        rules={[{ required: true, message: 'Please select a start date' }]}
                    >
                        <DatePicker 
                            value={startDate} 
                            onChange={setStartDate} 
                            style={{ width: "100%" }}
                            suffixIcon={<CalendarOutlined />}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </Layout>
    );
};

const Statistic = ({ title, value, prefix, valueStyle }) => (
    <div style={{ textAlign: "center" }}>
        <Text type="secondary">{title}</Text>
        <div style={{ fontSize: 24, fontWeight: "bold", ...valueStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {prefix && <span style={{ marginRight: 8 }}>{prefix}</span>}
            {value}
        </div>
    </div>
);

export default MainJournal;
