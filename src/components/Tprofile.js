import React from 'react';
import { Card, Typography, Avatar, List, Divider, Button, Row, Col } from 'antd';
import { 
  UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, IdcardOutlined, 
  HeartOutlined, HomeOutlined, CalendarOutlined, TeamOutlined, MessageOutlined 
} from '@ant-design/icons';
import './Tprofile.css';

const { Title, Text } = Typography;

const userData = {
  name: 'Albert Khan',
  gender: 'Male',
  dob: '23-Jan-2000',
  cnic: '12345-6789012-3',
  tid: '231',
  department: 'Civil Engineering',
  datejoined: '23-Jan-2000',
  campus: 'Lahore Campus',
  email: 'hamza_right@gmail.com',
  mobile: '+923324060799',
  bloodGroup: 'A+',
  address: '286 Aziz town, Lahore, Pakistan',
  familyInfo: 'Father: Ryan Ali, Mother: Sheila Butt',
};

const Tprofile = () => (
  <div className="profile-container">
    <Card className="profile-card">
      <div className="profile-header">
        <Avatar size={100} icon={<UserOutlined />} className="profile-avatar" />
        <Title level={3} className="profile-name">{userData.name}</Title>
        <Text className="profile-degree">{userData.department}</Text>
        <Text className="profile-campus">{userData.campus}</Text>
      </div>
      <Divider />
      <Row gutter={16}>
        <Col span={8}>
          <Title level={4} className="category-title">Work Info</Title>
          <List className="profile-section">
            <List.Item>
              <div className="profile-item">
                <IdcardOutlined className="icon" /> <Text>Teacher id:</Text> <span>{userData.tid}</span>
              </div>
            </List.Item>
            <List.Item>
              <div className="profile-item">
                <UserOutlined className="icon" /> <Text>Department:</Text> <span>{userData.department}</span>
              </div>
            </List.Item>
            <List.Item>
              <div className="profile-item">
                <CalendarOutlined className="icon" /> <Text>Date joined:</Text> <span>{userData.datejoined}</span>
              </div>
            </List.Item>
            <List.Item>
              <div className="profile-item">
                <EnvironmentOutlined className="icon" /> <Text>Campus:</Text> <span>{userData.campus}</span>
              </div>
            </List.Item>
          </List>
        </Col>
        <Col span={8}>
          <Title level={4} className="category-title">Personal Info</Title>
          <List className="profile-section">
            <List.Item>
              <div className="profile-item">
                <UserOutlined className="icon" /> <Text>Gender:</Text> <span>{userData.gender}</span>
              </div>
            </List.Item>
            <List.Item>
              <div className="profile-item">
                <CalendarOutlined className="icon" /> <Text>Date of Birth:</Text> <span>{userData.dob}</span>
              </div>
            </List.Item>
            <List.Item>
              <div className="profile-item">
                <IdcardOutlined className="icon" /> <Text>CNIC:</Text> <span>{userData.cnic}</span>
              </div>
            </List.Item>
            <List.Item>
              <div className="profile-item">
                <MailOutlined className="icon" /> <Text>Email:</Text> <span>{userData.email}</span>
              </div>
            </List.Item>
            <List.Item>
              <div className="profile-item">
                <PhoneOutlined className="icon" /> <Text>Mobile No:</Text> <span>{userData.mobile}</span>
              </div>
            </List.Item>
            <List.Item>
              <div className="profile-item">
                <HeartOutlined className="icon" /> <Text>Blood Group:</Text> <span>{userData.bloodGroup}</span>
              </div>
            </List.Item>
          </List>
        </Col>
        <Col span={8}>
          <Title level={4} className="category-title">Other Info</Title>
          <List className="profile-section">
            <List.Item>
              <div className="profile-item">
                <HomeOutlined className="icon" /> <Text>Address:</Text> <span>{userData.address}</span>
              </div>
            </List.Item>
            <List.Item>
              <div className="profile-item">
                <TeamOutlined className="icon" /> <Text>Family Info:</Text> <span>{userData.familyInfo}</span>
              </div>
            </List.Item>
          </List>
        </Col>
      </Row>
      <Button 
        type="primary" 
        shape="circle" 
        icon={<MessageOutlined />} 
        className="chatbot-button" 
        onClick={() => console.log('Chatbot opened!')}
      />
    </Card>
  </div>
);

export default Tprofile;
