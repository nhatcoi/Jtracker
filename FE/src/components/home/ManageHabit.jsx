import React, { useState, useEffect } from "react";
import { Layout, Menu, Card, List, Tag, Typography, Statistic, Badge, Skeleton, Empty, Tabs, Tooltip, message, Divider } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, CalendarOutlined, AimOutlined, TagOutlined, HistoryOutlined, FileTextOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import api from "../../util/api.js";
import "../../css/ManageHabit.css";
import {habitsApi} from "src/api/habitsApi.js";

const { Sider, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const ManageHabit = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm:ss"));
    const [activeTab, setActiveTab] = useState("active");

    const fetchHabits = async (active) => {
        setLoading(true);
        setError(null);

        try {
            const habitsData = await habitsApi.getAll({
                params: active
            })
            setHabits(habitsData);
        } catch (err) {
            setError(err.message);
            message.error("Failed to fetch habits");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchHabits(activeTab === "active");
    }, [activeTab]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(dayjs().format("HH:mm:ss"));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const getStatusTag = (status) => {
        switch (status) {
            case "PROGRESS":
                return <Tag icon={<ClockCircleOutlined />} color="warning">In Progress</Tag>;
            case "COMPLETED":
                return <Tag icon={<CheckCircleOutlined />} color="success">Completed</Tag>;
            default:
                return <Tag color="default">{status}</Tag>;
        }
    };

    const getActiveTag = (active) => {
        return active ? 
            <Tag icon={<CheckCircleOutlined />} color="success">Active</Tag> : 
            <Tag icon={<CloseCircleOutlined />} color="error">Inactive</Tag>;
    };

    const menuItems = [
        {
            key: "habits-header",
            label: <Text strong>HABITS</Text>,
            disabled: true,
            className: "menu-header"
        },
        {
            key: "active",
            label: (
                <div className="menu-item-with-count">
                    <span>Active</span>
                    <Badge count={habits.filter(h => h.active).length} className="custom-badge" />
                </div>
            ),
            onClick: () => handleTabClick("active")
        },
        {
            key: "archived",
            label: (
                <div className="menu-item-with-count">
                    <span>Archived</span>
                    <Badge count={habits.filter(h => !h.active).length} className="custom-badge" />
                </div>
            ),
            onClick: () => handleTabClick("archived")
        },
        {
            key: "logs-header",
            label: <Text strong>LOGS</Text>,
            disabled: true,
            className: "menu-header"
        },
        {
            key: "habit-logs",
            label: (
                <div className="menu-item-with-count">
                    <span>Habit Logs</span>
                    <Badge count={habits.length} className="custom-badge" />
                </div>
            ),
            disabled: true
        }
    ];

    const renderHabitList = () => {
        if (loading) {
            return [
                <Skeleton active avatar paragraph={{ rows: 4 }} key="skeleton-1" />,
                <Skeleton active avatar paragraph={{ rows: 4 }} key="skeleton-2" />,
                <Skeleton active avatar paragraph={{ rows: 4 }} key="skeleton-3" />
            ];
        }

        if (error) {
            return <Empty description={<span className="text-danger">{error}</span>} />;
        }

        if (habits.length === 0) {
            return <Empty description={`No ${activeTab} habits found`} />;
        }

        return (
            <List
                dataSource={habits}
                renderItem={(habit) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        key={habit.id}
                    >
                        <Card 
                            className="habit-card"
                            hoverable
                        >
                            <div className="habit-card-header">
                                <div className="habit-title-container">
                                    <div className="habit-icon">{habit.icon || "📌"}</div>
                                    <div>
                                        <Title level={5} className="habit-title">{habit.name}</Title>
                                        <Paragraph type="secondary" ellipsis={{ rows: 2 }}>
                                            {habit.description || "No description provided"}
                                        </Paragraph>
                                    </div>
                                </div>
                                <div className="habit-status">
                                    {getStatusTag(habit.status)}
                                </div>
                            </div>

                            <Divider style={{ margin: "12px 0" }} />

                            <div className="habit-details">
                                <div className="habit-details-column">
                                    <div className="habit-detail-item">
                                        <CalendarOutlined /> <Text strong>Frequency:</Text> {habit.frequency}
                                    </div>
                                    <div className="habit-detail-item">
                                        <AimOutlined /> <Text strong>Goal:</Text> {habit.goal}
                                    </div>
                                    <div className="habit-detail-item">
                                        <TagOutlined /> <Text strong>Type:</Text> {habit.habitType}
                                    </div>
                                </div>
                                <div className="habit-details-column">
                                    <div className="habit-detail-item">
                                        <CalendarOutlined /> <Text strong>Start Date:</Text> {dayjs(habit.startDate).format("MMM D, YYYY")}
                                    </div>
                                    <div className="habit-detail-item">
                                        <CalendarOutlined /> <Text strong>End Date:</Text> {habit.endDate ? dayjs(habit.endDate).format("MMM D, YYYY") : "N/A"}
                                    </div>
                                    <div className="habit-detail-item">
                                        <HistoryOutlined /> <Text strong>Created:</Text> {dayjs(habit.createdAt).format("MMM D, YYYY")}
                                    </div>
                                </div>
                            </div>

                            <div className="habit-footer">
                                {getActiveTag(habit.active)}
                            </div>
                        </Card>
                    </motion.div>
                )}
                grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 1, xl: 1, xxl: 1 }}
            />
        );
    };

    return (
        <Layout className="manage-habit-layout">
            <Sider width={250} theme="light" className="manage-habit-sider">
                <Menu
                    mode="inline"
                    selectedKeys={[activeTab]}
                    items={menuItems}
                    className="manage-habit-menu"
                />
            </Sider>
            <Content className="manage-habit-content">
                <Card
                    title={
                        <div className="habit-card-title">
                            <Title level={4}>Habits</Title>
                            <Statistic value={currentTime} className="time-statistic" />
                        </div>
                    }
                    className="content-card"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderHabitList()}
                        </motion.div>
                    </AnimatePresence>
                </Card>
            </Content>
        </Layout>
    );
};

export default ManageHabit;