import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faEllipsisV, faEdit, faTimes, faUndo, faCheck, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { Card, List, Typography, Spin, Input, Button, Dropdown, Collapse, Modal, Form, Select, DatePicker, InputNumber, Badge, Space, Progress, Divider, Tag, message, Tooltip } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined, EditOutlined, EllipsisOutlined, UndoOutlined, DownOutlined, UpOutlined, ClockCircleOutlined, TrophyOutlined } from "@ant-design/icons";
import api from "../../util/api";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { motion } from "framer-motion";

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

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

        const formattedReminder = editingHabit.reminder.includes(":")
            ? editingHabit.reminder.split(":").length === 2
                ? `${editingHabit.reminder}:00`
                : editingHabit.reminder
            : editingHabit.reminder;

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
            message.success('Habit updated successfully');
        } catch (err) {
            console.error("Error updating habit:", err);
            message.error('Failed to update habit');
        }
    }, [editingHabit, onUpdateHabit, handleCloseEditModal]);

    const handleEditChange = useCallback((field, value) => {
        setEditingHabit((prev) => ({ ...prev, [field]: value }));
    }, []);

    const handleDeleteEdit = useCallback(async () => {
        if (!editingHabit) return;

        try {
            const response = await api.delete(`/habits/${editingHabit.id}`);
            if (response.status !== 204) throw new Error("Failed to delete habit.");
            message.success('Habit deleted successfully');
            onUpdateHabit(editingHabit.id);
            handleCloseEditModal();
        } catch (err) {
            console.error("Error deleting habit:", err);
            message.error('Failed to delete habit');
        }
    }, [editingHabit, onUpdateHabit, handleCloseEditModal]);

    const handleArchiveEdit = useCallback(async () => {
        if (!editingHabit) return;

        try {
            const response = await api.put(`/habits/${editingHabit.id}`, {
                active: false,
            });
            if (response.status !== 200) throw new Error("Failed to archive habit.");
            message.success('Habit archived successfully');
            onUpdateHabit(editingHabit.id);
            handleCloseEditModal();
        } catch (err) {
            console.error("Error archiving habit:", err);
            message.error('Failed to archive habit');
        }
    }, [editingHabit, onUpdateHabit, handleCloseEditModal]);

    const handleSuccess = useCallback(async (habitId) => {
        try {
            const response = await api.put(`/habits/${habitId}`, {
                status: "SUCCESS",
                endDate: dayjs().format("YYYY-MM-DD"),
            });
            if (response.status !== 200) throw new Error("Failed to update habit.");
            onUpdateHabit(habitId);
            message.success('Habit marked as successful');
        } catch (err) {
            console.error("Error updating habit:", err);
            message.error('Failed to update habit status');
        }
    }, [onUpdateHabit]);

    const handleFail = useCallback(async (habitId) => {
        try {
            const response = await api.put(`/habits/${habitId}`, {
                status: "FAILED",
                endDate: dayjs().format("YYYY-MM-DD"),
            });
            if (response.status !== 200) throw new Error("Failed to update habit.");
            onUpdateHabit(habitId);
            message.error('Habit marked as failed');
        } catch (err) {
            console.error("Error updating habit:", err);
            message.error('Failed to update habit status');
        }
    }, [onUpdateHabit]);

    useEffect(() => {
        const interval = setInterval(() => {
            const updatedTimes = {};
            habits.forEach((habit) => {
                const diff = dayjs.duration(dayjs().diff(dayjs(habit.createdAt)));
                const days = Math.floor(diff.asDays());
                const hours = diff.hours();
                const minutes = diff.minutes();
                const seconds = diff.seconds();
                updatedTimes[habit.id] = `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m ${seconds}s`;
            });
            setElapsedTimes(updatedTimes);
        }, 1000);
        return () => clearInterval(interval);
    }, [habits]);

    const handleItemClick = useCallback((habit) => {
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
            message.success('Habit marked as done');
        } catch (err) {
            console.error("Error updating habit:", err);
            message.error('Failed to mark habit as done');
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
            message.success('Progress logged successfully');
        } catch (err) {
            console.error("Error updating log:", err);
            message.error('Failed to log progress');
        }
    }, [logInputs, onUpdateHabit]);

    const handleUndo = useCallback(async (habitId) => {
        try {
            const response = await api.put(`/habit-logs/update/${habitId}`, {
                statusLog: "PROGRESS",
                achieved: 0
            });
            if (response.status !== 200) throw new Error("Failed to undo habit.");
            onUpdateHabit(habitId);
            message.info('Habit progress reset');
        } catch (err) {
            console.error("Error undoing habit:", err);
            message.error('Failed to reset habit progress');
        }
    }, [onUpdateHabit]);

    const goodHabits = habits.filter((habit) => habit.habitType === "GOOD");
    const uncompletedGoodHabits = goodHabits.filter(habit => habit.achievedPeriod < habit.goal);
    const completedGoodHabits = goodHabits.filter(habit => habit.achievedPeriod >= habit.goal);
    const badHabits = habits.filter((habit) => habit.habitType === "BAD");

    const getDropdownItems = (habit) => {
        const items = [
            {
                key: 'edit',
                label: (
                    <span onClick={() => handleEditClick(habit)}>
                        <EditOutlined /> Edit
                    </span>
                ),
            }
        ];

        if (habit.achievedPeriod < habit.goal) {
            items.push(
                {
                    key: 'success',
                    label: (
                        <span onClick={() => handleSuccess(habit.id)}>
                            <CheckCircleOutlined /> Success
                        </span>
                    ),
                },
                {
                    key: 'fail',
                    label: (
                        <span onClick={() => handleFail(habit.id)}>
                            <CloseCircleOutlined /> Fail
                        </span>
                    ),
                }
            );
        } else {
            items.push({
                key: 'undo',
                label: (
                    <span onClick={() => handleUndo(habit.id)}>
                        <UndoOutlined /> Undo
                    </span>
                ),
            });
        }

        return items;
    };

    return (
        <div className="habit-list-container">
            {loading && (
                <div style={{ textAlign: 'center', margin: '40px 0' }}>
                    <Spin size="large" />
                </div>
            )}
            
            {error && (
                <Alert
                    message="Error"
                    description={error}
                    type="error"
                    showIcon
                    style={{ marginBottom: 16 }}
                />
            )}

            {!loading && !error && (
                <>
                    {habits.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Card 
                                className="empty-habits-card" 
                                style={{ 
                                    textAlign: 'center', 
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
                                }}
                            >
                                <div style={{ padding: '20px 0' }}>
                                    <Title level={4}>No Habits Found</Title>
                                    <Paragraph>
                                        You haven't added any habits yet. Click the button below to add your first habit.
                                    </Paragraph>
                                </div>
                            </Card>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <Title level={2} style={{ marginLeft: 16, marginTop: 16 }}>Today</Title>


                            {goodHabits.length > 0 && (
                                <div style={{ marginBottom: 24 }}>
                                    <div 
                                        style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: 8
                                        }}
                                    >
                                        <Title 
                                            level={4} 
                                            style={{ 
                                                color: '#52c41a', 
                                                margin: 0,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <TrophyOutlined style={{ marginRight: 8, paddingLeft: 16 }} /> Good Habits
                                        </Title>
                                        <Button 
                                            type="text" 
                                            icon={showGoodHabits ? <UpOutlined /> : <DownOutlined />}
                                            onClick={() => setShowGoodHabits(!showGoodHabits)}
                                        />
                                    </div>
                                    
                                    <Collapse 
                                        activeKey={showGoodHabits ? ['1'] : []}
                                        ghost
                                        bordered={false}
                                    >
                                        <Panel key="1" showArrow={false} header={null}>
                                            <div>
                                                <Title level={5} style={{ marginTop: 0 }}>In Progress</Title>
                                                <List
                                                    itemLayout="horizontal"
                                                    dataSource={uncompletedGoodHabits}
                                                    renderItem={habit => (
                                                        <motion.div
                                                            whileHover={{ scale: 1.01 }}
                                                            transition={{ type: 'spring', stiffness: 300 }}
                                                        >
                                                            <Card 
                                                                className="habit-card"
                                                                style={{ 
                                                                    marginBottom: 16, 
                                                                    borderRadius: 8,
                                                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                                                                    cursor: 'pointer'
                                                                }}
                                                                onClick={(e) => {
                                                                    // Prevent click when interacting with controls
                                                                    if (e.target.closest('.ant-dropdown-trigger, .ant-input, .ant-btn')) {
                                                                        return;
                                                                    }
                                                                    handleItemClick(habit);
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                                    <div>
                                                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                                                            <Title level={5} style={{ margin: 0 }}>{habit.name}</Title>
                                                                            <Tag color="blue" style={{ marginLeft: 8 }}>{habit.frequency}</Tag>
                                                                        </div>
                                                                        
                                                                        <Paragraph ellipsis={{ rows: 2 }}>{habit.description}</Paragraph>
                                                                        
                                                                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                                                                <Text type="secondary">Reminder: {habit.reminder}</Text>
                                                                            </div>
                                                                            
                                                                            <div style={{ marginTop: 8 }}>
                                                                                <Text strong>Progress: {habit.achievedPeriod}/{habit.goal}</Text>
                                                                                <Progress 
                                                                                    percent={Math.round((habit.achievedPeriod / habit.goal) * 100)} 
                                                                                    status="active"
                                                                                    strokeColor={{
                                                                                        '0%': '#108ee9',
                                                                                        '100%': '#87d068',
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </Space>
                                                                    </div>
                                                                    
                                                                    <Space align="start">
                                                                        <Tooltip title="Mark as done">
                                                                            <Button 
                                                                                type="primary" 
                                                                                shape="circle"
                                                                                icon={<CheckCircleOutlined />}
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleMarkAsDone(habit.id);
                                                                                }}
                                                                            />
                                                                        </Tooltip>
                                                                        
                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                            <Input
                                                                                placeholder="Log progress"
                                                                                style={{ width: 100, marginRight: 8 }}
                                                                                value={logInputs[habit.id] || ""}
                                                                                onChange={(e) => handleLogInputChange(habit.id, e.target.value)}
                                                                                onPressEnter={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleLogSubmit(habit.id);
                                                                                }}
                                                                                onClick={(e) => e.stopPropagation()}
                                                                            />
                                                                            
                                                                            <Dropdown
                                                                                menu={{ items: getDropdownItems(habit) }}
                                                                                trigger={['click']}
                                                                            >
                                                                                <Button 
                                                                                    type="text" 
                                                                                    icon={<EllipsisOutlined />}
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                />
                                                                            </Dropdown>
                                                                        </div>
                                                                    </Space>
                                                                </div>
                                                            </Card>
                                                        </motion.div>
                                                    )}
                                                />

                                                {completedGoodHabits.length > 0 && (
                                                    <>
                                                        <Divider orientation="left">
                                                            <Badge 
                                                                count={completedGoodHabits.length} 
                                                                style={{ backgroundColor: '#52c41a' }}
                                                            >
                                                                <Title level={5} style={{ margin: 0 }}>Completed</Title>
                                                            </Badge>
                                                        </Divider>
                                                        
                                                        <List
                                                            itemLayout="horizontal"
                                                            dataSource={completedGoodHabits}
                                                            renderItem={habit => (
                                                                <motion.div
                                                                    whileHover={{ scale: 1.01 }}
                                                                    transition={{ type: 'spring', stiffness: 300 }}
                                                                >
                                                                    <Card 
                                                                        className="habit-card completed"
                                                                        style={{ 
                                                                            marginBottom: 16, 
                                                                            borderRadius: 8,
                                                                            background: '#f6ffed',
                                                                            borderColor: '#b7eb8f',
                                                                            opacity: 0.85,
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        onClick={(e) => {
                                                                            if (e.target.closest('.ant-dropdown-trigger')) {
                                                                                return;
                                                                            }
                                                                            handleItemClick(habit);
                                                                        }}
                                                                    >
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                            <div>
                                                                                <Title level={5} style={{ margin: 0, textDecoration: 'line-through' }}>
                                                                                    {habit.name} <Tag color="success">SUCCESS</Tag>
                                                                                </Title>
                                                                                <Text type="success">Goal: {habit.achievedPeriod}/{habit.goal}</Text>
                                                                            </div>
                                                                            
                                                                            <Dropdown
                                                                                menu={{ items: getDropdownItems(habit) }}
                                                                                trigger={['click']}
                                                                            >
                                                                                <Button 
                                                                                    type="text" 
                                                                                    icon={<EllipsisOutlined />}
                                                                                    onClick={(e) => e.stopPropagation()}
                                                                                />
                                                                            </Dropdown>
                                                                        </div>
                                                                    </Card>
                                                                </motion.div>
                                                            )}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </Panel>
                                    </Collapse>
                                </div>
                            )}

                            {badHabits.length > 0 && (
                                <div style={{ marginBottom: 24 }}>
                                    <div 
                                        style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            marginBottom: 8
                                        }}
                                    >
                                        <Title 
                                            level={4} 
                                            style={{ 
                                                color: '#f5222d', 
                                                margin: 0,
                                                display: 'flex',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <CloseCircleOutlined style={{ marginRight: 8, paddingLeft: 16 }} /> Bad Habits
                                        </Title>
                                        <Button 
                                            type="text" 
                                            icon={showBadHabits ? <UpOutlined /> : <DownOutlined />}
                                            onClick={() => setShowBadHabits(!showBadHabits)}
                                        />
                                    </div>
                                    
                                    <Collapse 
                                        activeKey={showBadHabits ? ['1'] : []}
                                        ghost
                                        bordered={false}
                                    >
                                        <Panel key="1" showArrow={false} header={null}>
                                            <List
                                                itemLayout="horizontal"
                                                dataSource={badHabits}
                                                renderItem={habit => (
                                                    <motion.div
                                                        whileHover={{ scale: 1.01 }}
                                                        transition={{ type: 'spring', stiffness: 300 }}
                                                    >
                                                        <Card 
                                                            className="habit-card bad"
                                                            style={{ 
                                                                marginBottom: 16, 
                                                                borderRadius: 8,
                                                                background: '#fff1f0',
                                                                borderColor: '#ffccc7',
                                                                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                                                                cursor: 'pointer'
                                                            }}
                                                            onClick={(e) => {
                                                                if (e.target.closest('.ant-dropdown-trigger')) {
                                                                    return;
                                                                }
                                                                handleItemClick(habit);
                                                            }}
                                                        >
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                <div>
                                                                    <Title level={5} style={{ margin: 0 }}>{habit.name}</Title>
                                                                    <Paragraph ellipsis={{ rows: 2 }}>{habit.description}</Paragraph>
                                                                    <Text type="danger">
                                                                        <ClockCircleOutlined style={{ marginRight: 8 }} />
                                                                        Quit: {elapsedTimes[habit.id] || "0h 0m 0s"} ago
                                                                    </Text>
                                                                </div>
                                                                
                                                                <Dropdown
                                                                    menu={{ items: getDropdownItems(habit) }}
                                                                    trigger={['click']}
                                                                >
                                                                    <Button 
                                                                        type="text" 
                                                                        icon={<EllipsisOutlined />}
                                                                        onClick={(e) => e.stopPropagation()}
                                                                    />
                                                                </Dropdown>
                                                            </div>
                                                        </Card>
                                                    </motion.div>
                                                )}
                                            />
                                        </Panel>
                                    </Collapse>
                                </div>
                            )}
                        </motion.div>
                    )}
                </>
            )}

            <Modal
                title="Edit Habit"
                open={showEditModal}
                onCancel={handleCloseEditModal}
                footer={[
                    <Button key="delete" danger onClick={handleDeleteEdit}>
                        Delete
                    </Button>,
                    <Button key="archive" onClick={handleArchiveEdit}>
                        Archive
                    </Button>,
                    <Button key="cancel" onClick={handleCloseEditModal}>
                        Cancel
                    </Button>,
                    <Button key="save" type="primary" onClick={handleSaveEdit}>
                        Save
                    </Button>,
                ]}
                width={600}
            >
                <Form layout="vertical">
                    <Form.Item label="Habit Name">
                        <Input
                            placeholder="Enter habit name"
                            value={editingHabit?.name || ""}
                            onChange={(e) => handleEditChange("name", e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item label="Description">
                        <Input.TextArea
                            rows={3}
                            placeholder="Enter description"
                            value={editingHabit?.description || ""}
                            onChange={(e) => handleEditChange("description", e.target.value)}
                        />
                    </Form.Item>

                    {editingHabit?.habitType === "GOOD" && (
                        <>
                            <Form.Item label="Frequency">
                                <Select
                                    value={editingHabit?.frequency || "daily"}
                                    onChange={(value) => handleEditChange("frequency", value)}
                                    style={{ width: '100%' }}
                                >
                                    <Option value="daily">Daily</Option>
                                    <Option value="weekly">Weekly</Option>
                                    <Option value="monthly">Monthly</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="Goal">
                                <InputNumber
                                    placeholder="Enter goal (e.g., 30 times)"
                                    value={editingHabit?.goal || ""}
                                    onChange={(value) => handleEditChange("goal", value)}
                                    style={{ width: '100%' }}
                                />
                            </Form.Item>

                            <Form.Item label="Reminder Time">
                                <Input
                                    type="time"
                                    value={editingHabit?.reminder || ""}
                                    onChange={(e) => handleEditChange("reminder", e.target.value)}
                                />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item label="Start Date">
                        <DatePicker
                            value={editingHabit?.startDate ? dayjs(editingHabit.startDate) : null}
                            onChange={(date) => handleEditChange("startDate", date ? date.format("YYYY-MM-DD") : "")}
                            style={{ width: '100%' }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default HabitList;