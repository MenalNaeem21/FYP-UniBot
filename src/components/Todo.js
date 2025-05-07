// src/components/Sworkflow.js
import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Card,
  Typography,
  Modal,
  Upload,
  message,
  Row,
  Col,
  Statistic,
} from 'antd';
import { UploadOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import './Tworkflow.css'; // ✅ Reusing the same CSS

const { Title, Text } = Typography;

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [studentData, setStudentData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(null);

  useEffect(() => {
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const res = await axios.get('http://localhost:5000/api/auth/studentprofile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudentData(res.data);
      fetchClasswork(res.data);
    } catch (error) {
      console.error('Error fetching student profile:', error);
      message.error('Failed to load student profile');
    }
  };

  const fetchClasswork = async (student) => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/classwork/student', {
        params: { rollNo: student.rollNo },
      });

      // Mark whether submitted or not (basic flag)
      const enrichedTasks = res.data.map(task => ({
        ...task,
        id: task._id,
        taskId: task.taskId,
        dueDate: dayjs(task.dueDate).format('YYYY-MM-DD'),
        attachment: task.attachmentUrl ? task.attachmentUrl.split('/').pop() : 'No File',
        attachmentUrl: task.attachmentUrl || '',
        isSubmitted: task.submissions?.some(sub => sub.rollNo === student.rollNo) || false,
      }));

      setTasks(enrichedTasks);
    } catch (error) {
      console.error('Error loading classwork:', error);
      message.error('Failed to fetch classwork');
    }
  };

  const handleUpload = async () => {
    if (!uploadingFile || !selectedTask) return;
  
    const formData = new FormData();
    formData.append('file', uploadingFile);
    formData.append('rollNo', studentData.rollNo);
    formData.append('name', studentData.name);

    try {
      const token = localStorage.getItem('studentToken');
      await axios.post(`http://localhost:5000/api/admin/classwork/submit/${selectedTask.taskId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      message.success('Submission successful!');
      setIsModalOpen(false);
      setUploadingFile(null);
      setSelectedTask(null);
      fetchClasswork(studentData); // 🔥 Refresh classwork list
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('Failed to submit classwork.');
    }
  };

  const openUploadModal = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  // Analytics
  const pendingCount = tasks.filter(task => !task.isSubmitted && dayjs().isBefore(task.dueDate)).length;
  const submittedCount = tasks.filter(task => task.isSubmitted).length;
  const expiredCount = tasks.filter(task => !task.isSubmitted && dayjs().isAfter(task.dueDate)).length;

  const columns = [
    {
      title: 'Course',
      render: (text, record) => `${record.courseId} (${record.courseName})`,
    },
    {
      title: 'Task',
      dataIndex: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
    },
    {
      title: 'Attachment',
      dataIndex: 'attachment',
      render: (text, record) =>
        record.attachment !== 'No File' ? (
          <a href={`http://localhost:5000${record.attachmentUrl}`} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        ) : (
          'No File'
        ),
    },
    
    {
      title: 'Status',
      render: (_, record) => (
        record.isSubmitted ? <Text type="success">Submitted</Text> : <Text type="danger">Pending</Text>
      ),
    },
    {
      title: 'Action',
      render: (_, record) => {
        const duePassed = dayjs().isAfter(record.dueDate);

        if (record.isSubmitted) {
          return (
            <Button
              type="dashed"
              icon={<EditOutlined />}
              onClick={() => openUploadModal(record)}
            >
              Edit Submission
            </Button>
          );
        } else if (duePassed) {
          return <Button type="default" disabled>Due Passed</Button>;
        } else {
          return (
            <Button
              type="primary"
              icon={<UploadOutlined />}
              onClick={() => openUploadModal(record)}
            >
              Submit
            </Button>
          );
        }
      },
    },
  ];

  return (
    <div className="todo-page">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📋 Classwork Submissions</Title>
        <Text type="secondary">
          View assigned tasks and submit your work.
        </Text>
      </header>

      {/* Analytics */}
      <Row gutter={16} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Pending Work" value={pendingCount} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Submitted Work" value={submittedCount} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Missed Deadlines" value={expiredCount} valueStyle={{ color: '#cf1322' }} />
          </Card>
        </Col>
      </Row>

      <main className="todo-content" style={{ marginTop: 30 }}>
        <Card className="todo-card">
          <Table
            dataSource={tasks}
            columns={columns}
            rowKey="id"
            className="task-table"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </main>

      {/* Modal for Uploading Submissions */}
      <Modal
        title={selectedTask?.isSubmitted ? 'Edit Your Submission' : 'Submit Classwork'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpload}
        okText={selectedTask?.isSubmitted ? 'Update' : 'Submit'}
        okButtonProps={{ disabled: !uploadingFile }}
      >
        <Upload
          beforeUpload={(file) => {
            setUploadingFile(file);
            return false; // prevent auto-upload
          }}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </Modal>
    </div>
  );
};

export default Todo;
