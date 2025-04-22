import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Typography, Card, Modal, message } from 'antd'; // ✅ message imported here
import { useNavigate } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import './LoginPage.css';
import axios from 'axios';

const { Title, Text } = Typography;

const LoginPage = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false); // ✅ modal visibility state

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login-student", {
        email: values.username, // still using 'username' field but sending it as email
        password: values.password
      });

      if (response.data.token) {
        localStorage.setItem("studentToken", response.data.token); // Store token
        setAuthenticated(true);
        message.success("Login successful!");
        navigate("/home"); // Redirect to home
      } else {
        message.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      message.error(error.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    message.error("Please check the form fields.");
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordVisible(true);
  };

  const handleCloseModal = () => {
    setIsForgotPasswordVisible(false);
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <Title level={2} className="login-title">Welcome Back</Title>
        <Text className="login-subtitle">Sign in to continue</Text>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <div className="login-options">
            <Checkbox>Remember me</Checkbox>
            <Button type="link" className="forgot-password" onClick={handleForgotPassword}>
              Forgot Password?
            </Button>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} className="loginn-button">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Forgot Password Modal */}
      <Modal
        title="Forgot Password"
        open={isForgotPasswordVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>
        ]}
      >
        <p>If you have forgotten your password, please contact support:</p>
        <Text>
          <MailOutlined />{' '}
          <a href="mailto:support@example.com">support@example.com</a>
        </Text>
      </Modal>
    </div>
  );
};

export default LoginPage;
