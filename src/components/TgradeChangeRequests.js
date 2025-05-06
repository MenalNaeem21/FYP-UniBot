import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Modal, Space, Select, message, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Tgrader.css'; // Reuse your Tgrader styles

const { Title, Text } = Typography;
const { Option } = Select;

const TgradeChangeRequests = () => {
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const tid = localStorage.getItem('tid');

  useEffect(() => {
    if (tid) fetchCourses();
  }, [tid]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/teachers/${tid}/courses`);
      setTeacherCourses(res.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load courses');
    }
  };

  const fetchRequests = async (courseId, section) => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/admin/requests', {
        params: { courseId, section },
      });
      setRequests(res.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to load grade change requests');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseChange = (value) => {
    const [courseId, section] = value.split('-');
    setSelectedCourse({ id: courseId, section });
    fetchRequests(courseId, section);
  };

  const updateStatus = async (gradeId, newStatus) => {
    try {
      await axios.put('http://localhost:5000/api/admin/update-status', {
        gradeId,
        status: newStatus,
      });
      message.success(`Status updated to ${newStatus}`);
      if (selectedCourse) {
        fetchRequests(selectedCourse.id, selectedCourse.section);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to update status');
    }
  };

  const columns = [
    { title: 'Roll No', dataIndex: 'rollNo', key: 'rollNo' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Course Name', dataIndex: 'courseName', key: 'courseName' },
    { title: 'Section', dataIndex: 'section', key: 'section' },
    { title: 'Requested Grade', dataIndex: 'grade', key: 'grade' },
    { 
      title: 'Comment', 
      dataIndex: 'changeComment', 
      key: 'changeComment', 
      render: text => text ? text : <Text type="secondary">No comment</Text> 
    },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: status => {
        if (status === 'pending') return <Tag color="orange">Pending</Tag>;
        if (status === 'accepted') return <Tag color="green">Accepted</Tag>;
        if (status === 'denied') return <Tag color="red">Denied</Tag>;
        return <Tag>Unknown</Tag>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        record.status === 'pending' ? (
          <Space>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => updateStatus(record._id, 'accepted')}
            >
              Accept
            </Button>
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => updateStatus(record._id, 'denied')}
            >
              Reject
            </Button>
          </Space>
        ) : (
          <Tag color="blue">Processed</Tag>
        )
      ),
    },
  ];

  return (
    <div className="grader-container">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📋 Grade Change Requests</Title>
        <Text type="secondary">
          Review and process students' grade change requests.
        </Text>
      </header>

      <Card className="grader-actions">
        <Space size="middle" wrap>
          <Select placeholder="Select Course" style={{ width: 250 }} onChange={handleCourseChange}>
            {teacherCourses.map(course => (
              <Option key={`${course.id}-${course.sections}`} value={`${course.id}-${course.sections}`}>
                {course.courseName || course.id} ({course.sections})
              </Option>
            ))}
          </Select>

          <Button
            type="default"
            icon={<SyncOutlined />}
            onClick={() => selectedCourse && fetchRequests(selectedCourse.id, selectedCourse.section)}
          >
            Refresh Requests
          </Button>
        </Space>
      </Card>

      <Card className="grades-table">
        <Title level={4}>📚 Grade Change Requests</Title>
        <Table
          dataSource={requests}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </div>
  );
};

export default TgradeChangeRequests;
