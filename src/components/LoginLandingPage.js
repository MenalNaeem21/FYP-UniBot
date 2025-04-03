// src/components/LoginLandingPage.js
import React from 'react';
import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {SmileOutlined,ThunderboltOutlined } from '@ant-design/icons';
import './LoginLandingPage.css';

const { Title } = Typography;

const LoginLandingPage = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleAdminLogin = () => {
    navigate('/adminlogin'); // Navigate to the login page for Admin
  };

  const handleStudentLogin = () => {
    navigate('/login'); // Navigate to the login page for Student
  };
  const handleTeacherLogin = () => {
    navigate('/teacherlogin'); // Navigate to the login page for Student
  };

  return (
    <div className="landing-container">
      <Title level={2} className="welcome-title">Welcome to Our AI-Powered Portal</Title>
      <div className="button-container">
        <Button type="primary" icon={<SmileOutlined />} size="large" onClick={handleAdminLogin} className="login-button">
          I'm an Admin!
        </Button>
        <Button type="default" icon={<ThunderboltOutlined />} size="large" onClick={handleStudentLogin} className="login-button">
          I'm a student
        </Button>
        <Button type="primary" icon={<SmileOutlined />} size="large" onClick={handleTeacherLogin} className="login-button">
          I'm a Professor!
        </Button>
      </div>
    </div>
  );
};

export default LoginLandingPage;
