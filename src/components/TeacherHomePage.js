import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography, Row, Col, message, List, Tag } from 'antd';
import {
  ScheduleOutlined, BookOutlined, TeamOutlined,
  DashboardOutlined, UserOutlined
} from '@ant-design/icons';
import axios from 'axios';
import './TeacherHomePage.css';

const { Title, Text } = Typography;

const TeacherHomePage = () => {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [assignedCourses, setAssignedCourses] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('teacherToken');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchTeacherProfile(token);
  }, []);

  const fetchTeacherProfile = async (token) => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeacher(res.data);
      fetchAssignedCourses(res.data.tid);
    } catch (err) {
      console.error('Error fetching profile:', err);
      message.error('Failed to load teacher profile');
    }
  };

  const fetchAssignedCourses = async (tid) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/teachers/${tid}/courses`);
      setAssignedCourses(res.data);
    } catch (err) {
      console.error('Error loading courses:', err);
      message.error('Failed to fetch assigned courses');
    }
  };

  return (
    <div className="teacher-home-container">
      {/* Welcome Header */}
      <Card className="welcome-banner" bordered={false}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className="welcome-title">
              👋 Welcome Back, {teacher?.name || "Professor"}!
            </Title>
            <Text>Inspire, Educate, and Shape the Future with Confidence.</Text>
          </Col>
          <Col>
            <DashboardOutlined className="welcome-icon" />
          </Col>
        </Row>
      </Card>

      {/* Navigation */}
      <Row gutter={[16, 16]} className="quick-nav">
        <Col span={6}>
          <Card hoverable onClick={() => navigate('/Tworkflow')}>
            <ScheduleOutlined className="nav-icon" />
            <Title level={4}>Workflow</Title>
            <Text>Manage class tasks</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => navigate('/Tmarks')}>
            <BookOutlined className="nav-icon" />
            <Title level={4}>Marks</Title>
            <Text>Upload and view grades</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => navigate('/Tattendance')}>
            <TeamOutlined className="nav-icon" />
            <Title level={4}>Attendance</Title>
            <Text>Track student attendance</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable onClick={() => navigate('/Tprofile')}>
            <UserOutlined className="nav-icon" />
            <Title level={4}>Profile</Title>
            <Text>View your university details</Text>
          </Card>
        </Col>
      </Row>

      



      
<Card title="🧑‍🏫 Your Profile Info" className="profile-info-card">
  <Row gutter={[24, 16]}>
    <Col span={6}>
      <div className="info-item">
        <UserOutlined className="info-icon" />
        <div>
          <Text className="info-label">Email</Text>
          <br />
          <Text>{teacher?.email}</Text>
        </div>
      </div>
    </Col>
    <Col span={6}>
      <div className="info-item">
        <TeamOutlined className="info-icon" />
        <div>
          <Text className="info-label">Mobile</Text>
          <br />
          <Text>{teacher?.mobile}</Text>
        </div>
      </div>
    </Col>
    <Col span={6}>
      <div className="info-item">
        <ScheduleOutlined className="info-icon" />
        <div>
          <Text className="info-label">Campus</Text>
          <br />
          <Text>{teacher?.campus}</Text>
        </div>
      </div>
    </Col>
    <Col span={6}>
      <div className="info-item">
        <BookOutlined className="info-icon" />
        <div>
          <Text className="info-label">Department</Text>
          <br />
          <Text>{teacher?.department}</Text>
        </div>
      </div>
    </Col>
  </Row>
</Card>

{/* 📘 Modern Course Cards */}
<Card title="📘 Assigned Courses" className="courses-card">
  {assignedCourses.length === 0 ? (
    <Text type="secondary">No courses assigned yet.</Text>
  ) : (
    <Row gutter={[16, 16]}>
      {assignedCourses.map((course) => (
        <Col span={8} key={`${course.id}-${course.sections}`}>
          <Card className="course-tile" hoverable>
            <Title level={5} className="course-title">
              {course.name}
            </Title>
            <Text type="secondary">Course ID: {course.id}</Text>
            <br />
            <Tag color="blue">Section {course.sections}</Tag>
            <Tag color="purple">Semester {course.semester}</Tag>
            <Tag color="green">{course.creditHours} Credit Hours</Tag>
          </Card>
        </Col>
      ))}
    </Row>
  )}
</Card>

    </div>
  );
};

export default TeacherHomePage;
