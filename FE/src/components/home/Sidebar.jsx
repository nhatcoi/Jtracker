import React, { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Typography, Button, Form, Input, Divider, Spin, Card, message, Tooltip } from "antd";
import { MenuOutlined, AppstoreOutlined, SettingOutlined, PlusOutlined, LogoutOutlined, UserOutlined, EditOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import googleLogo from "../../assests/google.svg";
import emailLogo from "../../assests/email.svg";
import "../../css/Sidebar.css";
import { userApi } from "src/api/userApi.js";
import { storageService } from "src/services/storageService.js";
import { notification } from "antd";
import ProfileSettingsModal from "./ProfileSettingsModal";
import AppSettingsModal from "./AppSettingsModal";

const { Sider } = Layout;
const { Title, Text } = Typography;

const SideBar = ({ sidebarWidth, setSidebarWidth, onSignOut }) => {

    const [userInfo, setUserInfo] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    const [showAppSettings, setShowAppSettings] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [check, setCheck] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchUserInfo().then(r => console.log(r));
    }, []);

    const fetchUserInfo = async () => {
        setLoading(true);
        try {
            let response;

            if (storageService.getUser()) {
                response = storageService.getUser();
            } else {
                response = await userApi.getMe();
            }

            setUserInfo(response);

            if (response.provider === "GOOGLE") {
                setCheck(true);
            }
        } catch (err) {
            setError(err.message);
            message.error("Failed to fetch user information");
        } finally {
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
                    onClick: () => setShowAppSettings(true)
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
                    onClick: () => setShowAppSettings(true)
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
                                : "Hello World"}
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

            <ProfileSettingsModal
                visible={showPopup}
                onClose={() => setShowPopup(false)}
                userInfo={userInfo}
                setUserInfo={setUserInfo}
                loading={loading}
                form={form}
                check={check}
                handleInputChange={handleInputChange}
                handleChangePassword={handleChangePassword}
                handleUpdateUserInfo={handleUpdateUserInfo}
            />
            <AppSettingsModal
                visible={showAppSettings}
                onClose={() => setShowAppSettings(false)}
            />
        </motion.div>
    );
};

export default SideBar;
