import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Typography, Card, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import './Ateacher.css';
import dayjs from 'dayjs';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const Ateacher = () => {
  const [teachers, setTeachers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  // Fetch teachers from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/teachers')
      .then(response => setTeachers(response.data))
      .catch(error => console.error('Error fetching teachers:', error));
  }, []);

  // Handle Add/Edit Teacher
  const handleSaveTeacher = async (values) => {
    try {
      if (editingTeacher) {
        // Update teacher
        const response = await axios.put(`http://localhost:5000/api/teachers/${editingTeacher._id}`, values);
        setTeachers(teachers.map(teacher => teacher._id === editingTeacher._id ? response.data : teacher));
        message.success('Teacher updated successfully');
      } else {
        // Add new teacher
        const response = await axios.post('http://localhost:5000/api/admin/registerteacher', values);
        setTeachers([...teachers, response.data]);
        message.success('Teacher added successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingTeacher(null);
    } catch (error) {
      message.error('Error saving teacher');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/teachers/${id}`);
      setTeachers(teachers.filter(teacher => teacher._id !== id));
      message.success('Teacher deleted successfully');
    } catch (error) {
      message.error('Error deleting teacher');
    }
  };

  // Handle Edit
  const handleEdit = (record) => {
    setEditingTeacher(record);
    form.setFieldsValue({ ...record, dob: record.dob ? dayjs(record.dob) : null });
    setIsModalVisible(true);
  };

  // Handle View Details
  const handleViewDetails = (record) => {
    setSelectedTeacher(record);
    setIsDetailVisible(true);
  };

  // Filtered teachers based on search query
  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.tid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Teacher ID', dataIndex: 'tid' },
    { title: 'Department', dataIndex: 'department' },
    { title: 'Campus', dataIndex: 'campus' },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginLeft: '8px' }} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger style={{ marginLeft: '8px' }} />
        </>
      ),
    },
  ];


return (
  <div className="admin-students-container">
      <header className="welcome-header">
      <Title level={2} className="welcome-title">🎓 Teacher Management</Title>
      <Text type="secondary" >
      Add and manage Teacher Profiles efficiently.
      </Text>
    </header>
    <header className="admin-header">
      <Input
        placeholder="Search by Name or Teacher id"
        prefix={<SearchOutlined />}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-bar"
      />
      <div className="marks-buttons">
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
        Add New Teacher
      </Button>
      </div>
      </header>

    <Table columns={columns} dataSource={filteredTeachers} pagination={{ pageSize: 7 }} className="student-table" />

    {/* Add/Edit Modal */}
    <Modal
      title={editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
      open={isModalVisible}
      onCancel={() => {
        setIsModalVisible(false);
        setEditingTeacher(null);
        form.resetFields();
      }}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={handleSaveTeacher}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="tid" label="Teacher id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="department" label="Department" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
          <Select>
            <Option value="Male">Male</Option>
            <Option value="Female">Female</Option>
          </Select>
        </Form.Item>
        <Form.Item name="dob" label="Date of Birth">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="mobile" label="Mobile">
          <Input />
        </Form.Item>
        <Form.Item name="cnic" label="CNIC">
          <Input />
        </Form.Item>
        <Form.Item name="campus" label="Campus">
          <Input />
        </Form.Item>
        <Form.Item name="datejoined" label="Date joined">
          <Input />
        </Form.Item>
        <Form.Item name="bloodGroup" label="Blood Group">
          <Input />
        </Form.Item>
        <Form.Item name="address" label="Address">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="familyInfo" label="Family Info">
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>

    {/* Student Detail Modal */}
    <Modal
      title="Teacher Details"
      open={isDetailVisible}
      onCancel={() => setIsDetailVisible(false)}
      footer={null}
    >
      {selectedTeacher && (
        <Card>
          
          <p><strong>Name:</strong> {selectedTeacher.name}</p>
          <p><strong>Teacher id:</strong> {selectedTeacher.tid}</p>
          <p><strong>Email:</strong> {selectedTeacher.email}</p>
          <p><strong>Password:</strong> {selectedTeacher.password}</p>
          <p><strong>Department:</strong> {selectedTeacher.department}</p>
          <p><strong>Gender:</strong> {selectedTeacher.gender}</p>
          <p> <strong>DOB:</strong>{' '}
          {selectedTeacher.dob ? dayjs(selectedTeacher.dob).format('YYYY-MM-DD') : 'N/A'}
          </p>
          <p><strong>Mobile:</strong> {selectedTeacher.mobile}</p>
          <p><strong>CNIC:</strong> {selectedTeacher.cnic}</p>
          <p><strong>Campus:</strong> {selectedTeacher.campus}</p>
          <p><strong>Date joined:</strong> {selectedTeacher.datejoined}</p>
          <p><strong>Blood Group:</strong> {selectedTeacher.bloodGroup}</p>
          <p><strong>Address:</strong> {selectedTeacher.address}</p>
          <p><strong>Family Info:</strong> {selectedTeacher.familyInfo}</p>


        </Card>
      )}
    </Modal>
  </div>
);
};
export default Ateacher;