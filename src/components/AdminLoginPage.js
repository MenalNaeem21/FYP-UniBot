// src/components/AdminLoginPage.js
import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Typography, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminLoginPage.css';

const { Title } = Typography;

const AdminLoginPage = ({ setAdminAuthenticated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login-admin", {
        email: values.email,  // Use email instead of username
        password: values.password
      });

      if (response.data.token) {
        localStorage.setItem("adminToken", response.data.token); // Store token
        setAdminAuthenticated(true);
        message.success("Login successful!");
        navigate("/AdmHomePage"); // Redirect to admin dashboard
      } else {
        message.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Login Error:", error);
      message.error(error.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <Title level={2} className="login-title">Admin Login</Title>
        <Form
          name="adminLogin"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please enter your email!" }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
