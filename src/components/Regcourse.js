import React, { useState } from 'react';
import {
  Button,
  Table,
  Card,
  Typography,
  Modal,
  Tag,
  Space,
  message,
} from 'antd';
import {
  UserAddOutlined,
  UserDeleteOutlined,
  UserSwitchOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import './Regcourse.css';

const { Title, Text } = Typography;

const courseData = [
  {
    id: 1,
    name: 'Introduction to Computer Science',
    professor: 'Dr. Alice Johnson',
    prerequisites: 'None',
    sections: ['A', 'B'],
    seats: 0,
  },
  {
    id: 2,
    name: 'Data Structures and Algorithms',
    professor: 'Dr. Bob Smith',
    prerequisites: 'Intro to Computer Science',
    sections: ['A'],
    seats: 5,
  },
  {
    id: 3,
    name: 'Operating Systems',
    professor: 'Dr. Carol Lee',
    prerequisites: 'Data Structures and Algorithms',
    sections: ['B'],
    seats: 2,
  },
];

const Regcourse = () => {
  const [availableCourses, setAvailableCourses] = useState(courseData);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [waitlist, setWaitlist] = useState([]);

  const handleAddCourse = (course) => {
    if (course.seats > 0) {
      setRegisteredCourses([...registeredCourses, course]);
      setAvailableCourses(
        availableCourses.map((c) =>
          c.id === course.id ? { ...c, seats: c.seats - 1 } : c
        )
      );
      message.success(`${course.name} added successfully!`);
    } else {
      message.warning(
        `${course.name} is full. You have been added to the waitlist.`
      );
      setWaitlist([...waitlist, course]);
    }
  };

  const handleDropCourse = (course) => {
    setRegisteredCourses(
      registeredCourses.filter((c) => c.id !== course.id)
    );
    setAvailableCourses(
      availableCourses.map((c) =>
        c.id === course.id ? { ...c, seats: c.seats + 1 } : c
      )
    );
    message.success(`${course.name} dropped successfully!`);
  };

  const handleWaitlistDrop = (course) => {
    setWaitlist(waitlist.filter((c) => c.id !== course.id));
    message.info(`${course.name} removed from waitlist.`);
  };

  const courseColumns = [
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Professor',
      dataIndex: 'professor',
      key: 'professor',
    },
    {
      title: 'Prerequisites',
      dataIndex: 'prerequisites',
      key: 'prerequisites',
    },
    {
      title: 'Sections',
      dataIndex: 'sections',
      key: 'sections',
      render: (sections) => sections.join(', '),
    },
    {
      title: 'Seats Available',
      dataIndex: 'seats',
      key: 'seats',
      render: (seats) => (
        <Tag color={seats > 0 ? 'green' : 'red'}>{seats}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => handleAddCourse(record)}
            disabled={
              registeredCourses.some((c) => c.id === record.id) ||
              waitlist.some((c) => c.id === record.id)
            }
            className="add-task-button"
          >
            Add
          </Button>
          <Button
            type="default"
            icon={<UserSwitchOutlined />}
            onClick={() => handleWaitlistDrop(record)}
            disabled={!waitlist.some((c) => c.id === record.id)}
          >
            Leave Waitlist
          </Button>
        </Space>
      ),
    },
  ];

  const registeredColumns = [
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Professor',
      dataIndex: 'professor',
      key: 'professor',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          danger
          icon={<UserDeleteOutlined />}
          onClick={() => handleDropCourse(record)}
        >
          Drop
        </Button>
      ),
    },
  ];

  return (
    <div className="reg-container">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">🎓 Course Registration</Title>
        <Text type="secondary">
          Register courses and access waitlist.
        </Text>
      </header>
      
      <main className="reg-content">
        <Card title="Available Courses" className="reg-card">
          <Table
            dataSource={availableCourses}
            columns={courseColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Card>

        <Card title="Registered Courses" className="reg-card">
          <Table
            dataSource={registeredCourses}
            columns={registeredColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Card>

        <Card title="Waitlisted Courses" className="reg-card">
          <Table
            dataSource={waitlist}
            columns={registeredColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </main>

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

export default Regcourse;
