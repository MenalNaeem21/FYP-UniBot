import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Typography, Card, Space, Select,Popconfirm } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined, UserOutlined, TeamOutlined, DeleteOutlined } from '@ant-design/icons';
import './Aregistration.css';
const { Option } = Select;
const { Title, Text } = Typography;

const Aregistration = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [form] = Form.useForm();
  const [studentForm] = Form.useForm();

  // 🗂️ Sample Data on Load
  useEffect(() => {
    setCourses([
        { id: 'CS101', name: 'Introduction to Computer Science', instructor: 'Dr. Alice', instructorId: 'I001', semester: 'Fall', sections: 'A', seatAvailability: 25 },
        { id: 'MA202', name: 'Linear Algebra', instructor: 'Prof. Bob', instructorId: 'I002', semester: 'Spring', sections: 'B', seatAvailability: 20 },
        { id: 'PHY303', name: 'Modern Physics', instructor: 'Dr. Eve', instructorId: 'I003', semester: 'Fall', sections: 'C', seatAvailability: 30 },
        { id: 'EE404', name: 'Digital Electronics', instructor: 'Dr. Charlie', instructorId: 'I004', semester: 'Spring', sections: 'D', seatAvailability: 15 },
        { id: 'EN505', name: 'Advanced English', instructor: 'Prof. Diana', instructorId: 'I005', semester: 'Summer', sections: 'E', seatAvailability: 10 },
        { id: 'CS606', name: 'Artificial Intelligence', instructor: 'Dr. Alan', instructorId: 'I006', semester: 'Fall', sections: 'F', seatAvailability: 12 },
        { id: 'STAT707', name: 'Statistics and Probability', instructor: 'Prof. John', instructorId: 'I007', semester: 'Spring', sections: 'G', seatAvailability: 18 },
        // { id: 'BIO808', name: 'Molecular Biology', instructor: 'Dr. Sarah', instructorId: 'I008', semester: 'Summer', sections: 'H', seatAvailability: 22 },
    ]);

    setStudents([
        { rollNo: 'S101', name: 'Alice Johnson', email: 'alice@example.com' },
        { rollNo: 'S102', name: 'Bob Smith', email: 'bob@example.com' },
        { rollNo: 'S103', name: 'Charlie Brown', email: 'charlie@example.com' },
        { rollNo: 'S104', name: 'Diana Prince', email: 'diana@example.com' },
        { rollNo: 'S105', name: 'Eve Adams', email: 'eve@example.com' },
        { rollNo: 'S106', name: 'Frank White', email: 'frank@example.com' },
        { rollNo: 'S107', name: 'Grace Lee', email: 'grace@example.com' },
        { rollNo: 'S108', name: 'Hank Pym', email: 'hank@example.com' },
    ]);
  }, []);

  // 🚀 Add/Edit Course
  const handleAddEditCourse = (values) => {
    if (editingCourse) {
      setCourses((prev) =>
        prev.map((course) =>
          course.id === editingCourse.id ? { ...values, id: editingCourse.id } : course
        )
      );
      setEditingCourse(null);
    } else {
      setCourses((prev) => [...prev, { ...values, id: Date.now().toString() }]);
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  // 👁️ View Course Details
  const handleViewDetails = (course) => {
    setSelectedCourseDetails(course);
    setIsDetailsModalVisible(true);
  };

  // 🧑‍🎓 View Students
  const handleViewStudents = () => {
    setIsStudentModalVisible(true);
  };

  // ➕ Add Student
  const handleAddStudent = (values) => {
    setStudents((prev) => [
      ...prev,
      {
        rollNo: `S${Date.now()}`,
        name: values.name,
        email: values.email,
      },
    ]);
    setIsAddStudentModalVisible(false);
    studentForm.resetFields();
  };

  // ❌ Delete Student
  const handleDeleteStudent = (rollNo) => {
    setStudents((prev) => prev.filter((student) => student.rollNo !== rollNo));
  };

  const courseColumns = [
    { title: 'Course Name', dataIndex: 'name', key: 'name' },
    { title: 'Course ID', dataIndex: 'id', key: 'id' },
    { title: 'Instructor ID', dataIndex: 'instructorId', key: 'instructorId' },
    { title: 'Instructor Name', dataIndex: 'instructor', key: 'instructor' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} style={{ marginRight: '8px' }} />
          <Button icon={<TeamOutlined />} onClick={handleViewStudents} style={{ marginRight: '8px' }} />
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCourse(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
        </>
      ),
    },
  ];

  const studentColumns = [
    { title: 'Roll No', dataIndex: 'rollNo', key: 'rollNo' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this student?"
          onConfirm={() => handleDeleteStudent(record.rollNo)}
          okText="Yes"
          cancelText="No"
        >
          <Button icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="course-management-container">
      {/* 📚 Header */}
        <header className="welcome-header">
        <Title level={2} className="welcome-title">📚 Course Management</Title>
        <Text type="secondary" >
        Add and manage course registrations effectively.
        </Text>
      </header>
      <header className="admin-header">
        <div className="marks-buttons">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setIsModalVisible(true);
            form.resetFields();
          }}
        >
          Add New Course
        </Button>
        </div>
      </header>

      {/* 📊 Course Table */}
      <Table columns={courseColumns} dataSource={courses} rowKey="id" pagination={{ pageSize: 8 }} className="course-table" />

      {/* 📝 Add/Edit Modal */}
      <Modal
        title={editingCourse ? 'Edit Course' : 'Add Course'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCourse(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAddEditCourse}>
          <Form.Item name="name" label="Course Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="id" label="Course ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="instructor" label="Instructor Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="instructorId" label="Instructor ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="semester" label="Semester Offered" rules={[{ required: true }]}>
            <Select>
              <Option value="Fall">Fall</Option>
              <Option value="Spring">Spring</Option>
              <Option value="Summer">Summer</Option>
            </Select>
          </Form.Item>
          <Form.Item name="sections" label="Sections (e.g., A, B, C)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="seatAvailability" label="Seat Availability" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 📄 Course Details Modal */}
      <Modal title="Course Details" open={isDetailsModalVisible} onCancel={() => setIsDetailsModalVisible(false)} footer={null}>
        {selectedCourseDetails && (
          <Card>
            <p><strong>Course Name:</strong> {selectedCourseDetails.name}</p>
            <p><strong>Course ID:</strong> {selectedCourseDetails.id}</p>
            <p><strong>Instructor:</strong> {selectedCourseDetails.instructor}</p>
            <p><strong>Instructor ID:</strong> {selectedCourseDetails.instructorId}</p>
            <p><strong>Semester:</strong> {selectedCourseDetails.semester}</p>
            <p><strong>Sections:</strong> {selectedCourseDetails.sections}</p>
            <p><strong>Seat Availability:</strong> {selectedCourseDetails.seatAvailability}</p>
          </Card>
        )}
      </Modal>

      {/* 🧑‍🎓 Students Modal */}
      <Modal
        title="Enrolled Students"
        open={isStudentModalVisible}
        onCancel={() => setIsStudentModalVisible(false)}
        footer={[
          <Button type="primary" onClick={() => setIsAddStudentModalVisible(true)}>Add Student</Button>
        ]}
      >
        <Table columns={studentColumns} dataSource={students} rowKey="rollNo" pagination={{ pageSize: 5 }} />
      </Modal>

      {/* ➕ Add Student Modal */}
      <Modal title="Add New Student" open={isAddStudentModalVisible} onCancel={() => setIsAddStudentModalVisible(false)} onOk={() => studentForm.submit()}>
        <Form form={studentForm} layout="vertical" onFinish={handleAddStudent}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="rollNo" label="rollNo" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Aregistration;
