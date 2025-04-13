import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Typography, Button, Modal, Form, Input, Divider, Spin, Card, message, Tooltip } from "antd";
import { MenuOutlined, AppstoreOutlined, SettingOutlined, PlusOutlined, LogoutOutlined, UserOutlined, EditOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import googleLogo from "../../assests/google.svg";
import emailLogo from "../../assests/email.svg";
import "../../css/Sidebar.css";
import {userApi} from "src/api/userApi.js";
import {storageService} from "src/services/storageService.js";
import { notification } from "antd";

const { Sider } = Layout;
const { Title, Text } = Typography;

const SideBar = ({ sidebarWidth, setSidebarWidth, onSignOut }) => {

    const [userInfo, setUserInfo] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [check, setCheck] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUserInfo().then(r => console.log(r));
    }, []);

    const fetchUserInfo = async () => {
        setLoading(true);
        if (storageService.getUser()) {
            console.log("user info sto: ", storageService.getUser());
            setUserInfo(storageService.getUser());
            setLoading(false);
        } else {
            try {
                const response = await userApi.getMe();
                console.log("response: ", response); // ⚠️ in toàn bộ response
                if (response.provider === "GOOGLE") {
                    setCheck(true);
                }
                console.log("user info: ", response);
                setUserInfo(response);
            } catch (err) {
                console.error("Fetch failed:", err); // ⚠️ In chi tiết lỗi
                setError(err.message);
                message.error("Failed to fetch user information");
            }
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        try {
            const values = await form.validateFields();
            const { oldPassword, newPassword } = values;
            
            if (!oldPassword || !newPassword) {
                notification.success({
                    message: 'Success',
                    description: 'Password changed successfully.',
                });
                return;
            }
            
            await userApi.changePassword(oldPassword, newPassword);
            notification.success({
                message: 'Success',
                description: 'Password changed successfully.',
            });
            setShowPopup(false);
            form.resetFields();
        } catch (error) {
            if (error.errorFields) {
                return;
            }
            notification.error({
                message: 'Failed',
                description: 'Password change failed. Please try again.',
            });
        }
    };

    const handleUpdateUserInfo = async (field, value) => {
        try {
            const updatedData = {
                ...userInfo,
                [field]: value
            };
            const updatedUser = await userApi.updateProfile(updatedData);
            setUserInfo(updatedUser);
            message.success("User info updated successfully");
        } catch (error) {
            message.error("Failed to update user info");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo((prevUserInfo) => ({
            ...prevUserInfo,
            [name]: value
        }));
    };


    const toggleSidebar = () => {
        if (isCollapsed) {
            setSidebarWidth("250px");
        } else {
            setSidebarWidth("80px");
        }
        setIsCollapsed(!isCollapsed);
    };

    const getMenuItems = () => {
        const items = [
            {
                key: "habits",
                icon: <AppstoreOutlined />,
                label: !isCollapsed && "All Habits",
                onClick: () => navigate("/me/habits")
            },
        ];
        if (!isCollapsed) {
            items.push(
                {
                    key: "areas",
                    label: <Text strong style={{ fontSize: "12px", color: "#8c8c8c" }}>AREAS</Text>,
                    disabled: true
                },
                {
                    key: "manage",
                    icon: <PlusOutlined />,
                    label: "Manage Habits",
                    onClick: () => navigate("/me/manage")
                },

                {
                    key: "preferences",
                    label: <Text strong style={{ fontSize: "12px", color: "#8c8c8c" }}>PREFERENCES</Text>,
                    disabled: true
                },
                {
                    key: "settings",
                    icon: <SettingOutlined />,
                    label: "App Settings",
                    onClick: () => setShowPopup(true)
                },
                {
                    type: "divider"
                }
            );
        } else {
            items.push(
                {
                    key: "manage",
                    icon: <PlusOutlined />,
                    onClick: () => navigate("/me/manage")
                },
                {
                    key: "settings",
                    icon: <SettingOutlined />,
                    onClick: () => setShowPopup(true)
                }
            );
        }
        items.push({
            key: "signout",
            icon: <LogoutOutlined />,
            label: !isCollapsed && "Sign Out",
            danger: true,
            onClick: onSignOut
        });
        
        return items;
    };

    return (
        <motion.div
            className="sidebar-container"
            animate={{ width: isCollapsed ? "80px" : "250px" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <Sider
                collapsible
                collapsed={isCollapsed}
                trigger={null}
                width="100%"
                collapsedWidth="100%"
                className="sidebar-sider"
            >
                <Button 
                    type="text" 
                    icon={<MenuOutlined />} 
                    onClick={toggleSidebar} 
                    className="collapse-btn"
                />
                
                {/* Profile button - always visible */}
                <div className={isCollapsed ? "profile-button-collapsed" : "profile-button-expanded"}>
                    <Tooltip title="Edit Profile">
                        <Avatar 
                            size={isCollapsed ? 50 : 80} 
                            src={userInfo?.avatar || ""} 
                            icon={<UserOutlined />}
                            className="user-avatar"
                            onClick={() => setShowPopup(true)}
                        />
                    </Tooltip>
                    
                    {/* Only show name when expanded */}
                    {!isCollapsed && (
                        <Title level={5} className="user-name">
                            {userInfo?.firstname || userInfo?.lastname
                                ? `${userInfo.firstname} ${userInfo.lastname}` 
                                : "Hello World" }
                        </Title>
                    )}
                </div>
                
                <Menu
                    mode="inline"
                    theme="light"
                    items={getMenuItems()}
                    className={`sidebar-menu ${isCollapsed ? 'sidebar-menu-collapsed' : ''}`}
                    selectedKeys={[window.location.pathname.includes('/habits') ? 'habits' : 'manage']}
                />
            </Sider>

            <Modal
                title="Profile Settings"
                open={showPopup}
                onCancel={() => setShowPopup(false)}
                footer={null}
                centered
                className="profile-modal"
            >
                {loading ? (
                    <div className="loading-container">
                        <Spin size="large" />
                    </div>
                ) : userInfo ? (
                    <>
                        <div className="profile-header">
                            <Avatar 
                                size={80} 
                                src={userInfo?.avatar || ""} 
                                icon={<UserOutlined />}
                            />
                            <div className="profile-name-inputs">
                                <Form layout="vertical">
                                    <Form.Item label="First Name">
                                        <Input
                                            name="firstname"
                                            value={userInfo.firstname}
                                            onChange={handleInputChange}
                                            onPressEnter={(e) => handleUpdateUserInfo("firstname", e.target.value)}
                                            suffix={<EditOutlined />}
                                        />
                                    </Form.Item>
                                    <Form.Item label="Last Name">
                                        <Input
                                            name="lastname"
                                            value={userInfo.lastname}
                                            onChange={handleInputChange}
                                            onPressEnter={(e) => handleUpdateUserInfo("lastname", e.target.value)}
                                            suffix={<EditOutlined />}
                                        />
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>

                        <Divider orientation="left">Sign-in Method</Divider>
                        <Card className="sign-in-method">
                            <div className="email-display">
                                <img
                                    src={check ? googleLogo : emailLogo}
                                    alt={check ? "Google Logo" : "Email Icon"}
                                    width="24"
                                    className="provider-icon"
                                />
                                <Text>{userInfo.email}</Text>
                            </div>
                        </Card>

                        {!check && (
                            <>
                                <Divider orientation="left">Reset Password</Divider>
                                <Form form={form} layout="vertical" onFinish={handleChangePassword}>
                                    <Form.Item
                                        name="oldPassword"
                                        label="Old Password"
                                        rules={[{ required: true, message: 'Please enter your old password' }]}
                                    >
                                        <Input.Password placeholder="Enter old password" />
                                    </Form.Item>
                                    <Form.Item
                                        name="newPassword"
                                        label="New Password"
                                        rules={[
                                            { required: true, message: 'Please enter your new password' },
                                            { min: 6, message: 'Password must be at least 6 characters' }
                                        ]}
                                    >
                                        <Input.Password placeholder="Enter new password" />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">
                                            Change Password
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </>
                        )}
                    </>
                ) : (
                    <Text type="secondary">No user data found.</Text>
                )}
            </Modal>
        </motion.div>
    );
};

export default SideBar;
