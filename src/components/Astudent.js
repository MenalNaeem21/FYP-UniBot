import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Typography, Card, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import moment from 'moment';
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
        const response = await axios.post('http://localhost:5000/api/admin/registerst', values);
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
      <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Name is required' }]}>
        <Input />
      </Form.Item>

      <Form.Item
        name="rollNo"
        label="Roll No"
        rules={[
          { required: true, message: 'Roll No is required' },
          { pattern: /^[0-9]{2}[A-Z]-[0-9]{4}$/, message: 'Format should be like 12L-3456' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="degreeProgram"
        label="Degree Program"
        rules={[{ required: true, message: 'Degree Program is required' }]}
      >
        <Select
          showSearch
          placeholder="Select or enter manually"
          optionFilterProp="children"
          dropdownRender={menu => (
            <>
              {menu}
              <Form.Item style={{ margin: 0, padding: '8px' }}>
                <Input
                  placeholder="Custom Program"
                  onPressEnter={(e) => {
                    form.setFieldsValue({ degreeProgram: e.target.value });
                  }}
                />
              </Form.Item>
            </>
          )}
        >
        <Option value="BBA">BBA</Option>
        <Option value="BS(AF)">BS(AF)</Option>
        <Option value="BS(AI)">BS(AI)</Option>
        <Option value="BS(BA)">BS(BA)</Option>
        <Option value="BS(CE)">BS(CE)</Option>
        <Option value="BS(CompEng)">BS(CompEng)</Option>
        <Option value="BS(CS)">BS(CS)</Option>
        <Option value="BS(CyS)">BS(CyS)</Option>
        <Option value="BS(DS)">BS(DS)</Option>
        <Option value="BS(EE)">BS(EE)</Option>
        <Option value="BS(FinTech)">BS(FinTech)</Option>
        <Option value="BS(SE)">BS(SE)</Option>

        <Option value="MBA">MBA</Option>
        <Option value="MS(AL)">MS(AL)</Option>
        <Option value="MS(AI)">MS(AI)</Option>
        <Option value="MS(BA)">MS(BA)</Option>
        <Option value="MS(CE)">MS(CE)</Option>
        <Option value="MS(CS)">MS(CS)</Option>
        <Option value="MS(CyS)">MS(CyS)</Option>
        <Option value="MS(DS)">MS(DS)</Option>
        <Option value="MS(EE)">MS(EE)</Option>
        <Option value="MS(Math)">MS(Math)</Option>
        <Option value="MS(SE)">MS(SE)</Option>
        <Option value="MS(SPM)">MS(SPM)</Option>

        <Option value="PhD(CE)">PhD(CE)</Option>
        <Option value="PhD(CS)">PhD(CS)</Option>
        <Option value="PhD(EE)">PhD(EE)</Option>
        <Option value="PhD(MS)">PhD(MS)</Option>
        <Option value="PhD(Math)">PhD(Math)</Option>
        <Option value="PhD(SE)">PhD(SE)</Option>


        </Select>
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Enter a valid email' },
          { pattern: /^l\d{6}@gmail\.com$/, message: 'Email must be like l123456@gmail.com' },
        ]}
      >
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

      <Form.Item
  name="dob"
  label="Date of Birth"
  rules={[
    { required: true, message: 'Date of Birth is required' },
    {
      validator: (_, value) => {
        if (!value) {
          return Promise.reject(new Error('Date of Birth is required'));
        }

        const today = new Date();
        const dob = new Date(value.$d); // ⚡ because Ant Design DatePicker gives Moment-like object
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--; // birthday not reached yet
        }

        if (age < 18) {
          return Promise.reject(new Error('Student must be at least 18 years old'));
        }
        return Promise.resolve();
      },
    },
  ]}
>
  <DatePicker style={{ width: '100%' }} />
</Form.Item>



      <Form.Item
        name="mobile"
        label="Mobile"
        rules={[
          { required: true, message: 'Mobile number is required' },
          { pattern: /^03[0-9]{9}$/, message: 'Mobile must be like 03123456789 (11 digits)' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="cnic"
        label="CNIC"
        rules={[
          { required: true, message: 'CNIC is required' },
          { pattern: /^[0-9]{5}-[0-9]{7}-[0-9]$/, message: 'Format must be 35202-1234567-8' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="campus"
        label="Campus"
        rules={[{ required: true, message: 'Campus is required' }]}
      >
        <Select placeholder="Select Campus">
          <Option value="Lahore">Lahore</Option>
          <Option value="Islamabad">Islamabad</Option>
          <Option value="Faisalabad">Faisalabad</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="batch"
        label="Batch"
        rules={[
          { required: true, message: 'Batch is required' },
          { pattern: /^[0-9]{4}$/, message: 'Batch must be 4 digits (e.g., 2025)' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="bloodGroup"
        label="Blood Group"
      >
        <Select placeholder="Select Blood Group">
          {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
            <Option key={bg} value={bg}>{bg}</Option>
          ))}
        </Select>
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
