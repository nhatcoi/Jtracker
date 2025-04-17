import React from "react";
import { Modal, Form, Select, Switch, Radio } from "antd";

const { Option } = Select;

const AppSettingsModal = ({ visible, onClose }) => {
    return (
        <Modal
            title="App Settings"
            open={visible}
            onCancel={onClose}
            footer={null}
            centered
        >
            <Form layout="vertical">
                <Form.Item label="Timezone">
                    <Select defaultValue="Asia/Ho_Chi_Minh">
                        <Option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</Option>
                        <Option value="America/New_York">America/New_York</Option>
                        <Option value="Europe/London">Europe/London</Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Notifications">
                    <Switch defaultChecked />
                </Form.Item>

                <Form.Item label="Theme Mode">
                    <Radio.Group defaultValue="light">
                        <Radio.Button value="light">Light</Radio.Button>
                        <Radio.Button value="dark">Dark</Radio.Button>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AppSettingsModal;
