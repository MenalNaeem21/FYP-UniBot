import React, { useState, useEffect, useCallback } from 'react';
import {
  Button,
  Table,
  Card,
  Typography,
  Tag,
  Space,
  Select,
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
const { Option } = Select;

const Regcourse = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [registeredCourses, setRegisteredCourses] = useState([]);
  const [waitlist, setWaitlist] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registrationAllowed, setRegistrationAllowed] = useState(false);
  const [activeSemester, setActiveSemester] = useState('Fall');
  const [selectedSemester, setSelectedSemester] = useState('Fall');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch student data
        const token = localStorage.getItem("studentToken");
        const studentRes = await axios.get("http://localhost:5000/api/auth/studentprofile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStudentData(studentRes.data);

        // Fetch controls data
        const controlsRes = await axios.get('http://localhost:5000/api/controls');
        setRegistrationAllowed(controlsRes.data.registrationOpen);
        setActiveSemester(controlsRes.data.activeSemester);
        setSelectedSemester(controlsRes.data.activeSemester);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        message.error("Failed to load registration settings or student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/courses');
      setAvailableCourses(response.data);
    } catch (error) {
      message.error('Failed to load courses');
    }
  }, []);

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
        semester: course.semester,
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

      fetchCourses();
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
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
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
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
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

  if (!registrationAllowed) {
    return (
      <div className="reg-container">
        <Card style={{ textAlign: 'center', marginTop: '20vh' }}>
          <Title level={2}>🚫 Registration Period Closed</Title>
          <Text>Please check back later!</Text>
        </Card>
      </div>
    );
  }

  const filteredCourses = availableCourses.filter(c => c.semester === selectedSemester);

  return (
    <div className="reg-container">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">🎓 Course Registration</Title>
        <Text type="secondary">
          Register courses by semester.
        </Text>
      </header>

      <main className="reg-content">
        <Card title="Available Courses" className="reg-card">
          <Space style={{ marginBottom: 16 }}>
            <Text strong>Semester:</Text>
            <Select
              value={selectedSemester}
              style={{ width: 150 }}
              disabled
            >
              <Option value="Fall">Fall</Option>
              <Option value="Spring">Spring</Option>
              <Option value="Summer">Summer</Option>
            </Select>
          </Space>

          <Table
            dataSource={filteredCourses}
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
