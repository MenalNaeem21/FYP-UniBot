import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Row, Col, Statistic, Avatar, Progress, List, Tag } from 'antd';
import {
  BookOutlined,
  ScheduleOutlined,
  UserOutlined,
  CheckCircleOutlined,
  DashboardOutlined,
  FireOutlined,
  ExportOutlined,
  MessageOutlined,
  FileTextOutlined,
  ProfileOutlined,
  CalendarOutlined,
  ReadOutlined,
  FallOutlined
} from '@ant-design/icons';
import './HomePage.css';

const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="student-home-container">
      {/* 🎓 Hero Section */}
      <Card className="hero-banner" bordered={false}>
        <Row justify="space-between" align="middle">
          <Col span={16}>
            <Title level={1} className="hero-title">🎓 Welcome Back, Scholar!</Title>
            <Text className="hero-subtitle">
              Your academic journey awaits – track your progress, manage tasks, and unlock your potential.
            </Text>
          </Col>
          <Col span={8} className="hero-avatar">
            <Avatar size={128} icon={<UserOutlined />} />
          </Col>
        </Row>
      </Card>

      <Card className="quick-stats-card" bordered={false}>
  <Row gutter={[16, 16]} justify="center" align="middle">
    <Col span={4}>
      <Statistic title="Current GPA" value={3.8} suffix="/4.0" />
    </Col>
    <Col span={4}>
      <Statistic title="Cumulative GPA" value={3.7} suffix="/4.0" />
    </Col>
    <Col span={4}>
      <Statistic title="Registered Courses" value={5} prefix={<ReadOutlined />} />
    </Col>
    <Col span={4}>
      <Statistic title="Pending Tasks" value={3} prefix={<ScheduleOutlined />} />
    </Col>
    <Col span={4}>
      <Statistic title="Low Attendance" value={'DS 201'} prefix={<FallOutlined />} />
    </Col>
  </Row>
</Card>



<Row gutter={[16, 16]} className="quick-nav" justify="space-between">
  <Col span={4}>
    <Card hoverable className="nav-card" onClick={() => navigate('/transcript')}>
      <FileTextOutlined className="nav-icon" />
      <Title level={5}>Transcript</Title>
      <Text>Check GPA, CGPA,credits earned and academic performance</Text>
    </Card>
  </Col>
  <Col span={4}>
    <Card hoverable className="nav-card" onClick={() => navigate('/workflow')}>
      <CalendarOutlined className="nav-icon" />
      <Title level={5}>Workflow</Title>
      <Text>Manage Workflows, access timetable and see attendance </Text>
    </Card>
  </Col>
  <Col span={4}>
    <Card hoverable className="nav-card" onClick={() => navigate('/registration')}>
      <BookOutlined className="nav-icon" />
      <Title level={5}>Register Courses</Title>
      <Text>Choose Subjects, access waitlist and register</Text>
    </Card>
  </Col>
  <Col span={4}>
    <Card hoverable className="nav-card" onClick={() => navigate('/marks')}>
      <CheckCircleOutlined className="nav-icon" />
      <Title level={5}>Marks</Title>
      <Text>Check in-depth marks for each course and analyze class average</Text>
    </Card>
  </Col>
  <Col span={4}>
    <Card hoverable className="nav-card" onClick={() => navigate('/profile')}>
      <ProfileOutlined className="nav-icon" />
      <Title level={5}>Profile</Title>
      <Text>Manage account details including personal info, academic info and other</Text>
    </Card>
  </Col>
</Row>


      {/* 🔥 AI Recommendations */}
      <Card className="ai-recommendations-card" bordered={false}>
        <Row justify="space-between" align="middle">
          <Col>
            <FireOutlined style={{ fontSize: '36px', color: '#fa541c' }} />
            <Title level={2}>AI Recommendations</Title>
            <Text>Discover insights tailored for you to maximize your academic success.</Text>
            <ul className="ai-list">
            <li>📘 Recommended Course: Advanced Machine Learning</li>
            <li>🗓️ Low Attendance: Data Structures and Algorithms</li>
            <li>📚 Study Material: Top Research Papers on AI</li>
          </ul>
          </Col>
          
          
          <Button type="primary" icon={<ExportOutlined />} size="large" className="explore-insights-button">
            Explore Insights
          </Button>
          
          
          
        </Row>
      </Card>
     

      {/* 📅 Upcoming Deadlines */}
      <Card className="deadlines-card" bordered={false}>
        <Title level={4}>📅 Upcoming Deadlines</Title>
        <List>
          <List.Item>
            📝 Assignment 3 - Due: <Tag color="red">March 25, 2024</Tag>
          </List.Item>
          <List.Item>
            📊 Project Submission - Due: <Tag color="orange">April 10, 2024</Tag>
          </List.Item>
          <List.Item>
            🧠 Midterm Exam - Date: <Tag color="blue">April 15, 2024</Tag>
          </List.Item>
        </List>
      </Card>

      {/* 💬 Chatbot */}
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

export default HomePage;
