import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Table,
  Card,
  Typography,
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
import axios from 'axios';
import './Regcourse.css';

const { Title, Text } = Typography;

const Regcourse = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch student data from token
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("studentToken");
        const response = await axios.get("http://localhost:5000/api/auth/studentprofile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student profile:", error);
        message.error("Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, []);

  // Fetch available courses
  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setAvailableCourses(response.data);
    } catch (error) {
      message.error('Failed to load courses');
    }
  }, []);

  // Fetch student-specific registered/waitlisted courses
  const fetchStudentCourses = useCallback(async () => {
    if (!studentData?.email || !studentData?.rollNo) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/admin/courses`, {
        params: {
          email: studentData.email,
          rollNo: studentData.rollNo,
        },
      });
      setRegisteredCourses(response.data.registered || []);
      setWaitlist(response.data.waitlisted || []);
    } catch (error) {
      message.error('Failed to load your course data');
    }
  }, [studentData?.email, studentData?.rollNo]);

  useEffect(() => {
    if (studentData) {
      fetchCourses();
      fetchStudentCourses();
    }
  }, [studentData, fetchCourses, fetchStudentCourses]);

  const handleAddCourse = async (course) => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin/register', {
        courseId: course.id,
        section: course.sections,
        studentEmail: studentData.email,
        studentRollNo: studentData.rollNo,
      });
  
      if (res.data.status === 'waitlisted') {
        setWaitlist([...waitlist, course]);
        message.warning(`${course.name} is full. You’ve been waitlisted.`);
      } else {
        setRegisteredCourses([...registeredCourses, course]);
        message.success(`${course.name} registered successfully!`);
      }
  
      fetchCourses(); // refresh course list
    } catch (err) {
      console.error("Frontend registration error:", err);
      message.error('Failed to register for course');
    }
  };
  

  const handleDropCourse = async (course) => {
    try {
      const res = await axios.post('http://localhost:5000/api/admin/drop', {
        courseId: course.id,
        section: course.sections,
        studentEmail: studentData.email,
        studentRollNo: studentData.rollNo,
      });

      if (res.data.status === 'dropped') {
        setRegisteredCourses(registeredCourses.filter(c => c.id !== course.id));
      } else if (res.data.status === 'removed_from_waitlist') {
        setWaitlist(waitlist.filter(c => c.id !== course.id));
      }

      message.success(`${course.name} removed successfully!`);
      fetchCourses();
    } catch (err) {
      message.error('Failed to drop course');
    }
  };

  const handleWaitlistDrop = (course) => {
    handleDropCourse(course);
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
      dataIndex: ['instructor', 'name'],
      key: 'professor',
    },
    {
      title: 'Prerequisites',
      dataIndex: 'prerequisites',
      key: 'prerequisites',
      render: (prereqs) => prereqs?.join(', ') || 'None',
    },
    {
      title: 'Sections',
      dataIndex: 'sections',
      key: 'sections',
      render: (sections) => Array.isArray(sections) ? sections.join(', ') : sections,
    },
    {
      title: 'Seats Available',
      dataIndex: 'seatAvailability',
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
      dataIndex: ['instructor', 'name'],
      key: 'professor',
    },
    {
      title: 'Section',
      dataIndex: 'sections',
      key: 'section',
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

  if (loading) return null;

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
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        </Card>

        <Card title="Registered Courses" className="reg-card">
          <Table
            dataSource={registeredCourses}
            columns={registeredColumns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
          />
        </Card>

        <Card title="Waitlisted Courses" className="reg-card">
          <Table
            dataSource={waitlist}
            columns={registeredColumns}
            rowKey="_id"
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
