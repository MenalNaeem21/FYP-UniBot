import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Avatar, List, Divider, Button, Row, Col, Spin, message } from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, IdcardOutlined,
  HeartOutlined, HomeOutlined, CalendarOutlined, TeamOutlined, MessageOutlined
} from '@ant-design/icons';
import './Tprofile.css';

const { Title, Text } = Typography;

const Tprofile = () => {
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = localStorage.getItem("teacherToken");

        const response = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          setTeacherData(response.data);
        } else {
          message.error("Failed to load teacher profile");
        }
      } catch (error) {
        console.error("Error fetching teacher profile:", error);
        message.error(error.response?.data?.message || "Failed to load profile data");
      } finally {
        setLoading(false); // 🔥 Critical fix: stop the loading spinner
      }
    };

    fetchTeacherData();
  }, []);

  if (loading) {
    return <div className="profile-container"><Spin size="large" /></div>;
  }

  if (!teacherData) {
    return <div className="profile-container"><p>Failed to load profile data.</p></div>;
  }

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar size={100} icon={<UserOutlined />} className="profile-avatar" />
          <Title level={3} className="profile-name">{teacherData.name}</Title>
          <Text className="profile-degree">{teacherData.department}</Text>
          <Text className="profile-campus">{teacherData.campus}</Text>
        </div>
        <Divider />
        <Row gutter={16}>
          <Col span={8}>
            <Title level={4} className="category-title">Work Info</Title>
            <List className="profile-section">
              <List.Item>
                <div className="profile-item">
                  <IdcardOutlined className="icon" /> <Text>Teacher ID:</Text> <span>{teacherData.tid}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <UserOutlined className="icon" /> <Text>Department:</Text> <span>{teacherData.department}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <CalendarOutlined className="icon" /> <Text>Date Joined:</Text> <span>{teacherData.datejoined}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <EnvironmentOutlined className="icon" /> <Text>Campus:</Text> <span>{teacherData.campus}</span>
                </div>
              </List.Item>
            </List>
          </Col>
          <Col span={8}>
            <Title level={4} className="category-title">Personal Info</Title>
            <List className="profile-section">
              <List.Item>
                <div className="profile-item">
                  <UserOutlined className="icon" /> <Text>Gender:</Text> <span>{teacherData.gender}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <CalendarOutlined className="icon" /> <Text>Date of Birth:</Text> <span>{teacherData.dob}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <IdcardOutlined className="icon" /> <Text>CNIC:</Text> <span>{teacherData.cnic}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <MailOutlined className="icon" /> <Text>Email:</Text> <span>{teacherData.email}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <PhoneOutlined className="icon" /> <Text>Mobile No:</Text> <span>{teacherData.mobile}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <HeartOutlined className="icon" /> <Text>Blood Group:</Text> <span>{teacherData.bloodGroup}</span>
                </div>
              </List.Item>
            </List>
          </Col>
          <Col span={8}>
            <Title level={4} className="category-title">Other Info</Title>
            <List className="profile-section">
              <List.Item>
                <div className="profile-item">
                  <HomeOutlined className="icon" /> <Text>Address:</Text> <span>{teacherData.address}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <TeamOutlined className="icon" /> <Text>Family Info:</Text> <span>{teacherData.familyInfo}</span>
                </div>
              </List.Item>
            </List>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Tprofile;
