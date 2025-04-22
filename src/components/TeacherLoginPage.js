// src/components/TeacherLoginPage.js
import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Typography, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './TeacherLoginPage.css';
import axios from 'axios';

const { Title } = Typography;

const TeacherLoginPage = ({ setTeacherAuthenticated }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login-teacher", {
        email: values.email,
        password: values.password
      });

      if (response.data.token) {
        localStorage.setItem("teacherToken", response.data.token); // Store token
        setTeacherAuthenticated(true);
        message.success("Login successful!");
        navigate("/teacherhome");
      } else {
        message.error("Invalid credentials");
      }
    } catch (error) {
      console.error("Teacher Login Error:", error);
      message.error(error.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <Title level={2} className="login-title">Teacher Login</Title>
        <Form
          name="teacher-login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' }
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} className="loggin-button">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TeacherLoginPage;
