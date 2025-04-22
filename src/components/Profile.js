import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Typography, Avatar, List, Divider, Button, Row, Col, Spin, message } from 'antd';
import {
  UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, IdcardOutlined,
  HeartOutlined, HomeOutlined, CalendarOutlined, TeamOutlined, MessageOutlined
} from '@ant-design/icons';
import './Profile.css';

const { Title, Text } = Typography;

const Profile = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("studentToken");

        const response = await axios.get("http://localhost:5000/api/auth/studentprofile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.data) {
          setStudentData(response.data); // data fetched successfully
        } else {
          message.error("Failed to load student profile");
        }
      } catch (error) {
        console.error("Error fetching student profile:", error);
        message.error("An error occurred while fetching the profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  if (loading) {
    return <div className="profile-container"><Spin size="large" /></div>;
  }

  if (!studentData) {
    return <div className="profile-container"><p>Failed to load profile data.</p></div>;
  }

  return (
    <div className="profile-container">
      <Card className="profile-card">
        <div className="profile-header">
          <Avatar size={100} icon={<UserOutlined />} className="profile-avatar" />
          <Title level={3} className="profile-name">{studentData.name}</Title>
          <Text className="profile-degree">{studentData.degreeProgram}</Text>
          <Text className="profile-campus">{studentData.campus}</Text>
        </div>
        <Divider />
        <Row gutter={16}>
          <Col span={8}>
            <Title level={4} className="category-title">Academic Info</Title>
            <List className="profile-section">
              <List.Item>
                <div className="profile-item">
                  <IdcardOutlined className="icon" /> <Text>Roll No:</Text> <span>{studentData.rollNo}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <UserOutlined className="icon" /> <Text>Degree Program:</Text> <span>{studentData.degreeProgram}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <CalendarOutlined className="icon" /> <Text>Batch:</Text> <span>{studentData.batch}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <EnvironmentOutlined className="icon" /> <Text>Campus:</Text> <span>{studentData.campus}</span>
                </div>
              </List.Item>
            </List>
          </Col>
          <Col span={8}>
            <Title level={4} className="category-title">Personal Info</Title>
            <List className="profile-section">
              <List.Item>
                <div className="profile-item">
                  <UserOutlined className="icon" /> <Text>Gender:</Text> <span>{studentData.gender}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <CalendarOutlined className="icon" /> <Text>Date of Birth:</Text> <span>{studentData.dob}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <IdcardOutlined className="icon" /> <Text>CNIC:</Text> <span>{studentData.cnic}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <MailOutlined className="icon" /> <Text>Email:</Text> <span>{studentData.email}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <PhoneOutlined className="icon" /> <Text>Mobile No:</Text> <span>{studentData.mobile}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <HeartOutlined className="icon" /> <Text>Blood Group:</Text> <span>{studentData.bloodGroup}</span>
                </div>
              </List.Item>
            </List>
          </Col>
          <Col span={8}>
            <Title level={4} className="category-title">Other Info</Title>
            <List className="profile-section">
              <List.Item>
                <div className="profile-item">
                  <HomeOutlined className="icon" /> <Text>Address:</Text> <span>{studentData.address}</span>
                </div>
              </List.Item>
              <List.Item>
                <div className="profile-item">
                  <TeamOutlined className="icon" /> <Text>Family Info:</Text> <span>{studentData.familyInfo}</span>
                </div>
              </List.Item>
            </List>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Profile;
