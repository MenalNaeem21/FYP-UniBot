import React, { useState } from 'react';
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
  Checkbox,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import './Tworkflow.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Aworkflow = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingTask, setEditingTask] = useState(null);
  const timetableData = [
    {
      key: '1',
      day: 'Monday',
      time: '9:00 AM - 10:30 AM',
      course: 'CS101 - Intro to Programming',
      section: 'A',
    },
    {
      key: '2',
      day: 'Tuesday',
      time: '11:00 AM - 12:30 PM',
      course: 'MATH201 - Calculus II',
      section: 'C',
    },
    {
      key: '3',
      day: 'Wednesday',
      time: '1:00 PM - 2:30 PM',
      course: 'ENG101 - English Composition',
      section: 'D',
    },
    {
      key: '4',
      day: 'Thursday',
      time: '10:00 AM - 11:30 AM',
      course: 'PHYS101 - Physics I',
      section: 'C',
    },
    {
      key: '5',
      day: 'Friday',
      time: '2:00 PM - 3:30 PM',
      course: 'CS202 - Data Structures',
      section: 'A',
    },
  ];
  const timetableColumns = [
    {
      title: 'Day',
      dataIndex: 'day',
      key: 'day',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
    },
  ];


  const handleAddTask = (values) => {
    const newTask = {
      id: editingTask ? editingTask.id : Date.now(),
      ...values,
      dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : '',
      attachment: values.attachment?.file?.name || 'No File',
      completed: false,
    };

    if (editingTask) {
      setTasks((prev) =>
        prev.map((task) => (task.id === editingTask.id ? newTask : task))
      );
      setEditingTask(null);
    } else {
      setTasks((prev) => [...prev, newTask]);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    form.setFieldsValue({
      ...task,
      dueDate: dayjs(task.dueDate),
    });
    setIsModalOpen(true);
  };

  const handleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const columns = [
    {
      title: '✔️',
      dataIndex: 'completed',
      render: (completed, record) => (
        <Checkbox
          checked={completed}
          onChange={() => handleComplete(record.id)}
        />
      ),
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
      title: 'Priority',
      dataIndex: 'priority',
    },
    {
      title: 'Attachment',
      dataIndex: 'attachment',
      render: (text) => (text !== 'No File' ? <a href="#">{text}</a> : 'No File'),
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            danger
          />
        </div>
      ),
    },
  ];

  return (
    <div className="todo-page">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📋 Workflow Task Manager</Title>
        <Text type="secondary">
          Manage your tasks and deliverables efficiently.
        </Text>
      </header>

      <main className="todo-content">
        <Card className="todo-card">
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
            rules={[
              { required: true, message: 'Please enter the task description' },
            ]}
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
          <Form.Item
            name="priority"
            label="Priority Level"
            rules={[
              { required: true, message: 'Please select the priority level' },
            ]}
          >
            <Select placeholder="Select priority level">
              <Option value="High">High</Option>
              <Option value="Medium">Medium</Option>
              <Option value="Low">Low</Option>
            </Select>
          </Form.Item>
          <Form.Item name="attachment" label="File Attachment (Optional)">
            <Upload beforeUpload={() => false}>
              <Button icon={<UploadOutlined />}>Upload File</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Aworkflow;
