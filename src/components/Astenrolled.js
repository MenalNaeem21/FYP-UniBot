import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Typography, Card, Space, Select, Popconfirm, message } from 'antd';
import { EyeOutlined, TeamOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './aenrolled.css';

const { Option } = Select;
const { Title, Text } = Typography;

const Astenrolled = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [isStudentModalVisible, setIsStudentModalVisible] = useState(false);
  const [isAddStudentModalVisible, setIsAddStudentModalVisible] = useState(false);
  const [studentForm] = Form.useForm();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/courses');
        setCourses(res.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        message.error('Failed to load courses');
      }
    };

    const fetchStudents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/students');
        setAllStudents(res.data);
      } catch (error) {
        console.error('Error fetching students:', error);
        message.error('Failed to load students');
      }
    };

    fetchCourses();
    fetchStudents();
  }, []);

  const handleViewDetails = (course) => {
    setSelectedCourseDetails(course);
    setIsDetailsModalVisible(true);
  };

  const handleViewStudents = async (course) => {
    setSelectedCourse(course);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/courses/${course.id}/sections/${course.sections}/students`
      );
      setStudents(res.data);
      setIsStudentModalVisible(true);
    } catch (err) {
      console.error('Failed to fetch students', err);
      message.error('Error loading students');
    }
  };

  const handleStudentSelect = (rollNo) => {
    const selected = allStudents.find((s) => s.rollNo === rollNo);
    if (selected) {
      studentForm.setFieldsValue({
        name: selected.name,
        email: selected.email,
        rollNo: selected.rollNo,
      });
    }
  };

  const handleAddStudent = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/admin/register', {
        courseId: selectedCourse.id,
        section: selectedCourse.sections,
        studentEmail: values.email,
        studentRollNo: values.rollNo,
      });
      message.success('Student added successfully');
      setIsAddStudentModalVisible(false);
      studentForm.resetFields();
      handleViewStudents(selectedCourse);
    } catch (err) {
      message.error('Failed to add student');
    }
  };

  const handleDeleteStudent = async (student) => {
    try {
      await axios.post('http://localhost:5000/api/admin/drop', {
        courseId: selectedCourse.id,
        section: selectedCourse.sections,
        studentEmail: student.email,
        studentRollNo: student.rollNo,
      });
      message.success('Student removed successfully');
      handleViewStudents(selectedCourse);
    } catch (err) {
      message.error('Failed to remove student');
    }
  };

  const courseColumns = [
    { title: 'Course Name', dataIndex: 'name', key: 'name' },
    { title: 'Course ID', dataIndex: 'id', key: 'id' },
    { title: 'Instructor ID', dataIndex: ['instructor', 'id'], key: 'instructorId' },
    { title: 'Instructor Name', dataIndex: ['instructor', 'name'], key: 'instructor' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)} style={{ marginRight: '8px' }} />
          <Button icon={<TeamOutlined />} onClick={() => handleViewStudents(record)} />
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
          title="Are you sure you want to remove this student?"
          onConfirm={() => handleDeleteStudent(record)}
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
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📚 Course Enrollments</Title>
        <Text type="secondary">View and manage enrolled students in each course section.</Text>
      </header>

      <Table
        columns={courseColumns}
        dataSource={courses}
        rowKey={(record) => `${record.id}-${record.sections}`}
        pagination={{ pageSize: 8 }}
        className="course-table"
      />

      <Modal title="Course Details" open={isDetailsModalVisible} onCancel={() => setIsDetailsModalVisible(false)} footer={null}>
        {selectedCourseDetails && (
          <Card>
            <p><strong>Course Name:</strong> {selectedCourseDetails.name}</p>
            <p><strong>Course ID:</strong> {selectedCourseDetails.id}</p>
            <p><strong>Instructor:</strong> {selectedCourseDetails.instructor?.name}</p>
            <p><strong>Instructor ID:</strong> {selectedCourseDetails.instructor?.id}</p>
            <p><strong>Semester:</strong> {selectedCourseDetails.semester}</p>
            <p><strong>Sections:</strong> {selectedCourseDetails.sections}</p>
            <p><strong>Seat Availability:</strong> {selectedCourseDetails.seatAvailability}</p>
          </Card>
        )}
      </Modal>

      <Modal
        title="Enrolled Students"
        open={isStudentModalVisible}
        onCancel={() => setIsStudentModalVisible(false)}
        footer={[<Button type="primary" onClick={() => setIsAddStudentModalVisible(true)}>Add Student</Button>]}
      >
        <Table
          columns={studentColumns}
          dataSource={students}
          rowKey="rollNo"
          pagination={{ pageSize: 5 }}
        />
      </Modal>

      <Modal
        title="Add New Student"
        open={isAddStudentModalVisible}
        onCancel={() => setIsAddStudentModalVisible(false)}
        onOk={() => studentForm.submit()}
      >
        <Form form={studentForm} layout="vertical" onFinish={handleAddStudent}>
          <Form.Item
            name="rollNo"
            label="Select Student"
            rules={[{ required: true, message: 'Please select a student' }]}
          >
            <Select
              showSearch
              placeholder="Search by Roll No, Name, or Email"
              optionFilterProp="children"
              onChange={handleStudentSelect}
              filterOption={(input, option) => option?.children?.toLowerCase().includes(input.toLowerCase())}
            >
              {allStudents.map((student) => (
                <Option key={student.rollNo} value={student.rollNo}>
                  {`${student.rollNo} - ${student.email}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="name" label="Name">
            <Input disabled />
          </Form.Item>
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Astenrolled;