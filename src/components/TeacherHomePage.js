import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Row, Col, Statistic } from 'antd';
import {
  ScheduleOutlined,
  BookOutlined,
  TeamOutlined,
  BulbOutlined,
  DashboardOutlined,
  ExportOutlined,
  FireOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import './TeacherHomePage.css';

const { Title, Text } = Typography;

const TeacherHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="teacher-home-container">
      {/* Welcome Banner */}
      <Card className="welcome-banner" bordered={false}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className="welcome-title">👋 Welcome Back, Professor!</Title>
            <Text>Inspire, Educate, and Shape the Future with Confidence.</Text>
          </Col>
          <Col>
            <DashboardOutlined className="welcome-icon" />
          </Col>
        </Row>
      </Card>

      {/* Quick Navigation Cards */}
      <Row gutter={[16, 16]} className="quick-nav">
        {/* Workflow */}
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate('/Tworkflow')}>
            <ScheduleOutlined className="nav-icon" />
            <Title level={4}>Workflow</Title>
            <Text>Manage and plan your classes efficiently</Text>
          </Card>
        </Col>
        {/* Marks */}
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate('/Tmarks')}>
            <BookOutlined className="nav-icon" />
            <Title level={4}>Marks</Title>
            <Text>Record and analyze student performance</Text>
          </Card>
        </Col>
        {/* Attendance */}
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate('/Tattendance')}>
            <TeamOutlined className="nav-icon" />
            <Title level={4}>Attendance</Title>
            <Text>Monitor student attendance and access records</Text>
          </Card>
        </Col>
        {/* Resources */}
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate('/Tprofile')}>
            <UserOutlined className="nav-icon" />
            <Title level={4}>Profile</Title>
            <Text>Access and view your University Profile</Text>
          </Card>
        </Col>
      </Row>

      {/* Insights & Analytics */}
      <Card className="analytics-card" bordered={false}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={6}>
            <Statistic title="Classes Today" value={5} prefix={<ScheduleOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Total Students" value={180} prefix={<TeamOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Pending Tasks" value={3} prefix={<BookOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Completed Tasks" value={12} prefix={<CheckCircleOutlined />} />
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
                    <li><strong>📚 Recommended Workshops:</strong> Classroom Management, Innovative Teaching Techniques</li>
                    <li><strong>📅 Upcoming Events:</strong> Educator Summit 2024, Digital Teaching Expo</li>
                    <li><strong>📝 Teaching Resources:</strong> Access lesson plans, syllabus templates, and assessment tools</li>
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

export default TeacherHomePage;
