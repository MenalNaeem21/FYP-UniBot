// src/components/Tworkflow.js
import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Card,
  Typography,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Upload,
  message,
  Space,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import './Tworkflow.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Tworkflow = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingTask, setEditingTask] = useState(null);

  const [teacherCourses, setTeacherCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [viewSubmissions, setViewSubmissions] = useState([]);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);

  const tid = localStorage.getItem('tid');

  useEffect(() => {
    if (tid) fetchCourses();
  }, [tid]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/teachers/${tid}/courses`);
      setTeacherCourses(res.data);
    } catch (error) {
      message.error('Failed to load courses');
    }
  };

  const fetchClasswork = async (course) => {
    if (!course?.id || !course?.section) {
      console.error('No valid course provided');
      return;
    }
  
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/classwork/${course.id}/${course.section}`);
      setTasks(res.data.map(task => ({
        ...task,
        id: task._id,
        taskId: task.taskId,  // ✅ important now
        dueDate: dayjs(task.dueDate).format('YYYY-MM-DD'),
        attachment: task.attachmentUrl ? task.attachmentUrl.split('/').pop() : 'No File',
        attachmentUrl: task.attachmentUrl || '',
      })));
    } catch (error) {
      console.error('Error loading classwork:', error);
      setTasks([]);
    }
  };

  const generateTaskId = () => {
    return Math.floor(100 + Math.random() * 900); // Random 3-digit number
  };

  const handleAddTask = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('dueDate', values.dueDate);
  
      if (values.attachment?.file) {
        formData.append('attachment', values.attachment.file);
      }
  
      if (editingTask) {
        // ✨ If editing, PATCH instead of DELETE + POST
        await axios.patch(`http://localhost:5000/api/admin/classwork/update/${editingTask.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Classwork updated successfully');
      } else {
        // 🔥 If new task, POST
        formData.append('courseId', selectedCourse.id);
        formData.append('courseSection', selectedCourse.section);
        formData.append('courseName', selectedCourse.name || 'Unnamed Course');
        formData.append('taskId', generateTaskId());
  
        await axios.post('http://localhost:5000/api/admin/classwork/create', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        message.success('Classwork created successfully');
      }
  
      fetchClasswork(selectedCourse);
      setIsModalOpen(false);
      setEditingTask(null);
      form.resetFields();
    } catch (error) {
      console.error('Error saving/updating classwork:', error);
      message.error('Failed to save classwork');
    }
  };
  
  

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/classwork/delete/${id}`);
      message.success('Classwork deleted successfully');
      fetchClasswork(selectedCourse);
    } catch (error) {
      message.error('Failed to delete classwork');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      title: task.title,
      description: task.description,
      dueDate: dayjs(task.dueDate),
    });
    setIsModalOpen(true);
  };

  const handleViewSubmissions = async (taskId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/submissions-taskid/${taskId}`);
      setViewSubmissions(res.data || []);
      setIsSubmissionsModalOpen(true);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      message.error('Failed to load submissions');
    }
  };

  const columns = [
    {
      title: 'Task ID',
      dataIndex: 'taskId',
      key: 'taskId',
    },
    {
      title: 'Task',
      dataIndex: 'title',
      render: (text, record) => (
        <span className={record.completed ? 'completed-task' : ''}>{text}</span>
      ),
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
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleViewSubmissions(record.taskId)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="todo-page">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📋 Workflow Task Manager</Title>
        <Text type="secondary">Manage your tasks and deliverables efficiently.</Text>
      </header>

      <main className="todo-content">
        <Card className="todo-card">
          <Select
            placeholder="Select Course"
            onChange={(value) => {
              const [id, section] = value.split('-');
              const course = teacherCourses.find(c => c.id === id && c.sections === section);
              if (course) {
                const formattedCourse = {
                  id: course.id,
                  section: course.sections,
                  name: course.name,
                };
                setSelectedCourse(formattedCourse);
                fetchClasswork(formattedCourse);
              } else {
                message.error('Course not found!');
              }
            }}
            style={{ width: 300, marginBottom: 20 }}
          >
            {teacherCourses.map((course) => (
              <Option key={`${course.id}-${course.sections}`} value={`${course.id}-${course.sections}`}>
                {course.id} ({course.sections})
              </Option>
            ))}
          </Select>

          <Table
            dataSource={tasks}
            columns={columns}
            rowKey="id"
            className="task-table"
            pagination={{ pageSize: 5 }}
          />

          <div className="add-task-section">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsModalOpen(true)}
              className="add-task-button"
            >
              Add Task
            </Button>
          </div>
        </Card>
      </main>

      {/* Modal for Adding/Editing Tasks */}
      <Modal
        title={editingTask ? 'Edit Task' : 'Add Task'}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={editingTask ? 'Update' : 'Add'}
      >
        <Form form={form} layout="vertical" onFinish={handleAddTask}>
          <Form.Item
            name="title"
            label="Task Title"
            rules={[{ required: true, message: 'Please enter the task title' }]}
          >
            <Input placeholder="Enter task title" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter the task description' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter task description" />
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select the due date' }]}
          >
            <DatePicker className="date-picker" />
          </Form.Item>
          <Form.Item name="attachment" label="File Attachment (Optional)">
          <Upload
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>

          </Form.Item>
        </Form>
      </Modal>

      {/* Modal for Viewing Submissions */}
      <Modal
        title="Submissions"
        open={isSubmissionsModalOpen}
        onCancel={() => setIsSubmissionsModalOpen(false)}
        footer={null}
      >
        <Table
          dataSource={viewSubmissions}
          columns={[
            { title: 'Roll No', dataIndex: 'rollNo', key: 'rollNo' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
              title: 'Submitted File',
              dataIndex: 'submittedFileUrl',
              key: 'submittedFileUrl',
              render: (url) => (
                <a href={`http://localhost:5000${url}`} target="_blank" rel="noopener noreferrer">
                  View File
                </a>
              ),
            },
            {
              title: 'Submitted At',
              dataIndex: 'submittedAt',
              key: 'submittedAt',
              render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm') : 'N/A',
            },
            { title: 'Status', dataIndex: 'status', key: 'status' },
          ]}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default Tworkflow;
