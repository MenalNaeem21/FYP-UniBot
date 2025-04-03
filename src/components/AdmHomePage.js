// src/components/AdmHomePage.js
import { useEffect } from "react";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Row, Col, Statistic } from 'antd';
import {
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  ProjectOutlined,
  MessageOutlined,
  BulbOutlined,
  DashboardOutlined,
  ExportOutlined,
  FireOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import './AdmHomePage.css';

const { Title, Text } = Typography;

const AdmHomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminlogin"); // Redirect to login if no token
    }
  }, []);
  return (
    <div className="admin-home-container">
      {/* Welcome Banner */}
      <Card className="welcome-banner" bordered={false}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className="welcome-title">
              👋 Welcome Back, Admin!
            </Title>
            <Text>Manage your platform efficiently and stay updated with real-time insights.</Text>
          </Col>
          <Col>
            <DashboardOutlined className="welcome-icon" style={{color: '#fa541c' }}/>
          </Col>
        </Row>
      </Card>

      {/* Quick Navigation Cards */}
      <Row gutter={[16, 16]} className="quick-nav">
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate('/Astudent')}>
            <TeamOutlined className="nav-icon" />
            <Title level={4}>Students</Title>
            <Text>Manage and view student records</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate('/Ateacher')}>
            <UserOutlined className="nav-icon" />
            <Title level={4}>Teachers</Title>
            <Text>Manage and view Teacher profiles</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate('/Areport')}>
            <LineChartOutlined className="nav-icon" />
            <Title level={4}>Reports</Title>
            <Text>Review and manage reported issues</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate('/Aworkflow')}>
            <ProjectOutlined className="nav-icon" />
            <Title level={4}>Workflow</Title>
            <Text>Efficiently Monitor and streamline tasks</Text>
          </Card>
        </Col>
      </Row>

      {/* Insights & Analytics */}
      <Card className="analytics-card" bordered={false}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={6}>
            <Statistic title="Total Students" value={342} prefix={<TeamOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Total Teachers" value={45} prefix={<UserOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Pending Reports" value={8} prefix={<FileTextOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Active Workflows" value={12} prefix={<ProjectOutlined />} />
          </Col>
        </Row>
      </Card>

      {/* AI Recommendations */}
      <Card className="ai-recommendations-card" bordered={false}>
          <Row justify="space-between" align="middle">
            <Col>
              <FireOutlined style={{ fontSize: '36px', color: '#fa541c' }} />
              <Title level={2}>AI Recommendations</Title>
              <Text>Discover insights tailored for you to maximize your academic success.</Text>
              <ul className="ai-list">
              <li><strong>📊 System Insights:</strong> Monitor user activity, performance metrics, and system health</li>
              <li><strong>👥 User Management:</strong> Review pending user approvals and role assignments</li>
              <li><strong>🔒 Security Alerts:</strong> Check system vulnerabilities and recent security updates</li>
            </ul>
            </Col>
            
            
            <Button type="primary" icon={<ExportOutlined />} size="large" className="explore-insights-button">
              Explore Insights
            </Button>
            
           
            
          </Row>
        </Card>
      {/* Chatbot Button */}
      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        className="chatbot-button"
        onClick={() => console.log('Chatbot opened!')}
      />
    </div>
  );
};

export default AdmHomePage;
