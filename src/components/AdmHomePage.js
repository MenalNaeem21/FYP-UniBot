// src/components/AdmHomePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Typography, Button, Row, Col, Statistic, message } from "antd";
import {
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  ProjectOutlined,
  MessageOutlined,
  DashboardOutlined,
  ExportOutlined,
  FireOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./AdmHomePage.css";

const { Title, Text } = Typography;

const AdmHomePage = () => {
  const navigate = useNavigate();

  const [adminName, setAdminName] = useState("Admin");
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [reportCount, setReportCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/adminlogin");
    } else {
      fetchAdminName(token);
      fetchStats();
    }
  }, []);

  const fetchAdminName = async (token) => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/adminprofile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAdminName(res.data.name);
    } catch (error) {
      console.error("Error fetching admin name:", error);
      message.error("Failed to load admin name");
    }
  };

  const fetchStats = async () => {
    try {
      const [studentsRes, teachersRes, complaintsRes, coursesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/stats/students/count"),
        axios.get("http://localhost:5000/api/stats/teachers/count"),
        axios.get("http://localhost:5000/api/stats/complaints/count"),
        axios.get("http://localhost:5000/api/stats/course/count"),
      ]);
      setStudentCount(studentsRes.data.count);
      setTeacherCount(teachersRes.data.count);
      setReportCount(complaintsRes.data.count);
      setCourseCount(coursesRes.data.count);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch dashboard stats.");
    }
  };

  return (
    <div className="admin-home-container">
      <Card className="welcome-banner" bordered={false}>
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} className="welcome-title">
              👋 Welcome Back, {adminName}!
            </Title>
            <Text>Manage your platform efficiently and stay updated with real-time insights.</Text>
          </Col>
          <Col>
            <DashboardOutlined className="welcome-icon" style={{ color: "#fa541c" }} />
          </Col>
        </Row>
      </Card>

      {/* Quick Navigation */}
      <Row gutter={[16, 16]} className="quick-nav">
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate("/Astudent")}>
            <TeamOutlined className="nav-icon" />
            <Title level={4}>Students</Title>
            <Text>Manage and view student records</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate("/Ateacher")}>
            <UserOutlined className="nav-icon" />
            <Title level={4}>Teachers</Title>
            <Text>Manage and view Teacher profiles</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate("/Areport")}>
            <LineChartOutlined className="nav-icon" />
            <Title level={4}>Reports</Title>
            <Text>Review and manage reported issues</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable className="nav-card" onClick={() => navigate("/AdminControls")}>
            <ProjectOutlined className="nav-icon" />
            <Title level={4}>Workflow</Title>
            <Text>Efficiently Monitor and control Panel</Text>
          </Card>
        </Col>
      </Row>

      {/* Stats Section */}
      <Card className="analytics-card" bordered={false}>
        <Row gutter={[16, 16]} justify="center">
          <Col span={6}>
            <Statistic title="Total Students" value={studentCount} prefix={<TeamOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Total Teachers" value={teacherCount} prefix={<UserOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Pending Reports" value={reportCount} prefix={<FileTextOutlined />} />
          </Col>
          <Col span={6}>
            <Statistic title="Active Courses" value={courseCount} prefix={<ProjectOutlined />} />
          </Col>
        </Row>
      </Card>

      {/* AI Recommendation */}
      <Card className="ai-recommendations-card" bordered={false}>
        <Row justify="space-between" align="middle">
          <Col>
            <FireOutlined style={{ fontSize: "36px", color: "#fa541c" }} />
            <Title level={2}>AI Recommendations</Title>
            <Text>Discover insights tailored for you to maximize your academic success.</Text>
            <ul className="ai-list">
              <li>
                <strong>📊 System Insights:</strong> Monitor user activity, performance metrics, and system health
              </li>
              <li>
                <strong>👥 User Management:</strong> Review pending user approvals and role assignments
              </li>
              <li>
                <strong>🔒 Security Alerts:</strong> Check system vulnerabilities and recent security updates
              </li>
            </ul>
          </Col>
          <Button type="primary" icon={<ExportOutlined />} size="large" className="explore-insights-button">
            Explore Insights
          </Button>
        </Row>
      </Card>

      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        className="chatbot-button"
        onClick={() => console.log("Chatbot opened!")}
      />
    </div>
  );
};

export default AdmHomePage;
