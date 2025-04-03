import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Typography, Card, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import './Astudent.css';
import dayjs from 'dayjs';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

const Astudent = () => {
  const [students, setStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  // Fetch students from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/students')
      .then(response => setStudents(response.data))
      .catch(error => console.error('Error fetching students:', error));
  }, []);

  // Handle Add/Edit Student
  const handleSaveStudent = async (values) => {
    try {
      if (editingStudent) {
        // Update student
        const response = await axios.put(`http://localhost:5000/api/students/${editingStudent._id}`, values);
        setStudents(students.map(student => student._id === editingStudent._id ? response.data : student));
        message.success('Student updated successfully');
      } else {
        // Add new student
        const response = await axios.post('http://localhost:5000/api/students', values);
        setStudents([...students, response.data]);
        message.success('Student added successfully');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingStudent(null);
    } catch (error) {
      message.error('Error saving student');
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/students/${id}`);
      setStudents(students.filter(student => student._id !== id));
      message.success('Student deleted successfully');
    } catch (error) {
      message.error('Error deleting student');
    }
  };

  // Handle Edit
  const handleEdit = (record) => {
    setEditingStudent(record);
    form.setFieldsValue({ ...record, dob: record.dob ? dayjs(record.dob) : null });
    setIsModalVisible(true);
  };

  // Handle View Details
  const handleViewDetails = (record) => {
    setSelectedStudent(record);
    setIsDetailVisible(true);
  };

  // Filtered students based on search query
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Roll No', dataIndex: 'rollNo' },
    { title: 'Degree Program', dataIndex: 'degreeProgram' },
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
        <Title level={2} className="welcome-title">🎓 Student Management</Title>
        <Text type="secondary" >
        Add and manage student Profiles efficiently.
        </Text>
      </header>
      <header className="admin-header">
        <Input
          placeholder="Search by Name or Roll No"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <div className="marks-buttons">
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
          Add New Student
        </Button>
        </div>
        </header>
  

      <Table columns={columns} dataSource={filteredStudents} rowKey="_id" pagination={{ pageSize: 7 }} className="student-table" />

      {/* Add/Edit Modal */}
      <Modal
        title={editingStudent ? 'Edit Student' : 'Add Student'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingStudent(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveStudent}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="rollNo" label="Roll No" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="degreeProgram" label="Degree Program" rules={[{ required: true }]}>
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
          <Form.Item name="batch" label="Batch">
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
      
      <Modal
        title="Student Details"
        open={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={null}
      >
        {selectedStudent && (
          <Card>
            
            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>Roll No:</strong> {selectedStudent.rollNo}</p>
            <p><strong>Email:</strong> {selectedStudent.email}</p>
            <p><strong>Password:</strong> {selectedStudent.password}</p>
            <p><strong>Degree Program:</strong> {selectedStudent.degreeProgram}</p>
            <p><strong>Gender:</strong> {selectedStudent.gender}</p>
            <p> <strong>DOB:</strong>{' '}
            {selectedStudent.dob ? dayjs(selectedStudent.dob).format('YYYY-MM-DD') : 'N/A'}
            </p>
            <p><strong>Mobile:</strong> {selectedStudent.mobile}</p>
            <p><strong>CNIC:</strong> {selectedStudent.cnic}</p>
            <p><strong>Campus:</strong> {selectedStudent.campus}</p>
            <p><strong>Batch:</strong> {selectedStudent.batch}</p>
            <p><strong>Blood Group:</strong> {selectedStudent.bloodGroup}</p>
            <p><strong>Address:</strong> {selectedStudent.address}</p>
            <p><strong>Family Info:</strong> {selectedStudent.familyInfo}</p>


          </Card>
        )}
      </Modal>      
    </div>
  );
};

export default Astudent;
