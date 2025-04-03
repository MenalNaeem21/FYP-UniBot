import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, Typography, Card } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import './Astudent.css';
import dayjs from 'dayjs';

const { Title,Text } = Typography;
const { Option } = Select;

const Astudent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [students, setStudents] = useState([
    {
      key: '1',
      name: 'Hamza Ali Abbasi',
      gender: 'Male',
      dob: '2000-01-23',
      cnic: '12345-6789012-3',
      rollNo: '21L-9999',
      degreeProgram: 'BS Computer Science',
      batch: '2021',
      campus: 'Lahore Campus',
      email: 'hamza_right@gmail.com',
      password: '123',
      mobile: '+923324060799',
      bloodGroup: 'A+',
      address: '286 Aziz town, Lahore, Pakistan',
      familyInfo: 'Father: Ryan Ali, Mother: Sheila Butt',
    },
    {
      key: '2',
      name: 'Ayesha Siddiqui',
      gender: 'Female',
      dob: '1999-02-15',
      cnic: '98765-4321098-7',
      rollNo: '19K-1023',
      degreeProgram: 'BS Software Engineering',
      batch: '2019',
      campus: 'Islamabad Campus',
      email: 'ayesha_siddiqui@gmail.com',
      password: 'ayesha@123',
      mobile: '+923017654321',
      bloodGroup: 'B+',
      address: '45 Canal View, Islamabad, Pakistan',
      familyInfo: 'Father: Aslam Siddiqui, Mother: Nadia Aslam',
    },
    {
      key: '3',
      name: 'Zeeshan Malik',
      gender: 'Male',
      dob: '1998-07-12',
      cnic: '56789-1234567-8',
      rollNo: '18K-2345',
      degreeProgram: 'BE Mechanical Engineering',
      batch: '2018',
      campus: 'Karachi Campus',
      email: 'zeeshan.malik@hotmail.com',
      password: 'zeeshan@123',
      mobile: '+923214567890',
      bloodGroup: 'O-',
      address: '12 Gulshan Avenue, Karachi, Pakistan',
      familyInfo: 'Father: Malik Ahmed, Mother: Rabia Malik',
    },
    {
      key: '4',
      name: 'Rabia Hassan',
      gender: 'Female',
      dob: '2001-11-20',
      cnic: '34567-8901234-6',
      rollNo: '21F-5678',
      degreeProgram: 'BArch Architecture',
      batch: '2021',
      campus: 'Faisalabad Campus',
      email: 'rabia.hassan@gmail.com',
      password: 'rabia@123',
      mobile: '+923458761234',
      bloodGroup: 'AB+',
      address: '98 City Center, Faisalabad, Pakistan',
      familyInfo: 'Father: Hassan Ali, Mother: Sana Hassan',
    },
    {
      key: '5',
      name: 'Bilal Tariq',
      gender: 'Male',
      dob: '1997-03-05',
      cnic: '65432-1098765-4',
      rollNo: '17L-9999',
      degreeProgram: 'BS Electrical Engineering',
      batch: '2017',
      campus: 'Peshawar Campus',
      email: 'bilal.tariq@outlook.com',
      password: 'bilal@456',
      mobile: '+923018765432',
      bloodGroup: 'B-',
      address: '67 Hill Road, Peshawar, Pakistan',
      familyInfo: 'Father: Tariq Aziz, Mother: Samina Tariq',
    },
    {
      key: '6',
      name: 'Fatima Noor',
      gender: 'Female',
      dob: '2000-08-30',
      cnic: '12345-5432109-2',
      rollNo: '20F-8765',
      degreeProgram: 'BBA Business Administration',
      batch: '2020',
      campus: 'Quetta Campus',
      email: 'fatima.noor@gmail.com',
      password: 'fatima@789',
      mobile: '+923337654321',
      bloodGroup: 'A-',
      address: '89 Civic Center, Quetta, Pakistan',
      familyInfo: 'Father: Noor Hussain, Mother: Asma Noor',
    },
    {
      key: '7',
      name: 'Ali Raza',
      gender: 'Male',
      dob: '2002-06-15',
      cnic: '34567-1234567-8',
      rollNo: '22L-6789',
      degreeProgram: 'BS Civil Engineering',
      batch: '2022',
      campus: 'Lahore Campus',
      email: 'ali.raza@gmail.com',
      password: 'ali@123',
      mobile: '+923334567890',
      bloodGroup: 'O+',
      address: '45 Garden Town, Lahore, Pakistan',
      familyInfo: 'Father: Raza Khan, Mother: Ayesha Raza',
    }
]);


  const [form] = Form.useForm();

  // Handle Add/Edit Student
  const handleSaveStudent = (values) => {
    if (editingStudent) {
      setStudents((prev) =>
        prev.map((student) => (student.key === editingStudent.key ? { ...values, key: editingStudent.key } : student))
      );
      setEditingStudent(null);
    } else {
      setStudents((prev) => [...prev, { ...values, key: Date.now().toString() }]);
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // Handle Delete
  const handleDelete = (key) => {
    setStudents((prev) => prev.filter((student) => student.key !== key));
  };

  // Handle Edit
  const handleEdit = (record) => {
    setEditingStudent(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Handle View Details
  const handleViewDetails = (record) => {
    setSelectedStudent(record);
    setIsDetailVisible(true);
  };

  // Filtered students based on search query
  const filteredStudents = students.filter((student) => {
    return (
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Roll No',
      dataIndex: 'rollNo',
    },
    {
      title: 'Degree Program',
      dataIndex: 'degreeProgram',
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginLeft: '8px' }} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.key)} danger style={{ marginLeft: '8px' }} />
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

      <Table columns={columns} dataSource={filteredStudents} pagination={{ pageSize: 7 }} className="student-table" />

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

      {/* Student Detail Modal */}
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
