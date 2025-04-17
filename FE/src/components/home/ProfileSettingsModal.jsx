

import React from "react";
import { Modal, Avatar, Form, Input, Divider, Card, Typography, Button, Spin } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import googleLogo from "../../assests/google.svg";
import emailLogo from "../../assests/email.svg";

const { Text } = Typography;

const ProfileSettingsModal = ({
  visible,
  onClose,
  userInfo,
  setUserInfo,
  loading,
  form,
  check,
  handleInputChange,
  handleChangePassword,
  handleUpdateUserInfo,
}) => {
  return (
    <Modal
      title="Profile Settings"
      open={visible}
      onCancel={onClose}
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
                    onPressEnter={(e) =>
                      handleUpdateUserInfo("firstname", e.target.value)
                    }
                    suffix={<EditOutlined />}
                  />
                </Form.Item>
                <Form.Item label="Last Name">
                  <Input
                    name="lastname"
                    value={userInfo.lastname}
                    onChange={handleInputChange}
                    onPressEnter={(e) =>
                      handleUpdateUserInfo("lastname", e.target.value)
                    }
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
                  rules={[{ required: true, message: "Please enter your old password" }]}
                >
                  <Input.Password placeholder="Enter old password" />
                </Form.Item>
                <Form.Item
                  name="newPassword"
                  label="New Password"
                  rules={[
                    { required: true, message: "Please enter your new password" },
                    { min: 6, message: "Password must be at least 6 characters" },
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
  );
};

export default ProfileSettingsModal;