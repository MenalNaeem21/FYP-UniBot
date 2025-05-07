import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Input, Modal, Space, message, Tag } from 'antd';
import { SearchOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Todo.css';

const { Title, Text } = Typography;

const GradeChangeRequest = () => {
  const [grades, setGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [currentGradeId, setCurrentGradeId] = useState(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const student = await axios.get('http://localhost:5000/api/auth/studentprofile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await axios.get('http://localhost:5000/api/admin/mystudentgrades', {
        params: { rollNo: student.data.rollNo },
      });
      setGrades(res.data);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch grades');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = grades.filter(item =>
    item.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.courseId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openRequestModal = (gradeId) => {
    setCurrentGradeId(gradeId);
    setComment('');
    setCommentModalVisible(true);
  };

  const submitRequest = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/request-change', {
        gradeId: currentGradeId,
        comment,
      });
      message.success('Request submitted successfully!');
      setCommentModalVisible(false);
      fetchGrades();
    } catch (error) {
      console.error(error);
      message.error('Failed to submit request');
    }
  };

  const renderStatusTag = (status) => {
    if (status === 'pending') {
      return <Tag color="orange">Pending</Tag>;
    } else if (status === 'accepted') {
      return <Tag color="green">Accepted</Tag>;
    } else if (status === 'denied') {
      return <Tag color="red">Denied</Tag>;
    } else {
      return null;
    }
  };

  const columns = [
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Course ID',
      dataIndex: 'courseId',
      key: 'courseId',
    },
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
    },
    {
        title: 'Request Status',
        key: 'status',
        render: (_, record) => (
          record.status ? (
            renderStatusTag(record.status)
          ) : (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => openRequestModal(record._id)}
            >
              Request Change
            </Button>
          )
        ),
      },
  ];

  return (
    <div className="todo-page">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📋 Grade Change Request</Title>
        <Text type="secondary">Request grade changes with valid reasons.</Text>
      </header>

      <Card className="timetable-card">
        <Title level={3} className="timetable-title">📚 My Grades</Title>
        <Input
          placeholder="Search by Course ID or Name"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
          style={{ marginBottom: '1rem', width: '300px' }}
        />
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={false}
          className="timetable-table"
        />
      </Card>

      <Modal
        title="Grade Change Request"
        visible={commentModalVisible}
        onOk={submitRequest}
        onCancel={() => setCommentModalVisible(false)}
        okText="Submit Request"
      >
        <Input.TextArea
          rows={4}
          placeholder="Optional comments (reason for grade change)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default GradeChangeRequest;
