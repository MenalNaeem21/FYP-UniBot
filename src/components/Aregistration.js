import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, message } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Aregistration.css';

const { Option } = Select;

const Aregistration = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewingCourse, setViewingCourse] = useState(null);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [form] = Form.useForm();

  // Fetch courses and teachers from backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
    
    axios.get('http://localhost:5000/api/teachers')
      .then(response => setTeachers(response.data))
      .catch(error => console.error('Error fetching teachers:', error));
     
    axios.get('http://localhost:5000/api/courses')
      .then(response => {
        setCourses(response.data); // your current table data
        setAvailableCourses(response.data); // for prerequisites
      })
      .catch(error => console.error('Error fetching courses:', error));
      
  }, []);
  const handleView = (record) => {
    setViewingCourse(record);
    setIsViewModalVisible(true);
  };
  
  // Handle Add/Edit Course
  const handleSaveCourse = async (values) => {
    try {
      const selectedTeacher = teachers.find(t => t.tid === values.instructor.value);

      if (!selectedTeacher) {
        message.error('Invalid instructor selected.');
        return;
      }

      const payload = {
        id: values.id,
        name: values.name,
        instructor: {
          id: selectedTeacher.tid,
          name: selectedTeacher.name,
        },
        semester: values.semester,
        sections: values.sections,
        seatAvailability: Number(values.seatAvailability),
        creditHours: Number(values.creditHours),
        prerequisites: values.prerequisites || [],
      };

      let response;
      if (editingCourse) {
        response = await axios.put(`http://localhost:5000/api/courses/${editingCourse._id}`, payload);
        setCourses(courses.map(course => course._id === editingCourse._id ? response.data : course));
        message.success('Course updated successfully');
      } else {
        response = await axios.post('http://localhost:5000/api/admin/registercourse', payload);
        setCourses([...courses, response.data]);
        message.success('Course added successfully');
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
      message.error('Error saving course');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      setCourses(courses.filter(course => course._id !== id));
      message.success('Course deleted successfully');
    } catch (error) {
      message.error('Error deleting course');
    }
  };

  const handleEdit = (record) => {
    setEditingCourse(record);
    form.setFieldsValue({
      id: record.id,
      name: record.name,
      semester: record.semester,
      sections: record.sections,
      seatAvailability: record.seatAvailability,
      creditHours: record.creditHours,
      instructor: {
        value: record.instructor?.id,
        label: `${record.instructor?.name} (${record.instructor?.id})`
      },
      prerequisites: record.prerequisites || [],
    });
    setIsModalVisible(true);
  };

  const columns = [
    { title: 'Course Name', dataIndex: 'name' },
    { title: 'Course ID', dataIndex: 'id' },
    { title: 'Section', dataIndex: 'sections' },
    {
      title: 'Instructor',
      render: (_, record) => record.instructor?.name || 'N/A'
    },
    {
      title: 'Actions',
      render: (_, record) => (
        <>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginLeft: '8px' }} />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} danger style={{ marginLeft: '8px' }} />
        </>
      ),
    },
  ];

  return (
    <div className="admin-courses-container">
      <header className="welcome-header">
        <h2>📚 Course Management</h2>
        <p>Add and manage courses efficiently.</p>
      </header>

      <header className="admin-header">
        <Input
          placeholder="Search by Course Name or ID"
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
        <div className="marks-buttons">
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setEditingCourse(null);
            form.resetFields();
            setIsModalVisible(true);
          }}>
            Add New Course
          </Button>
        </div>
      </header>

      <Table
        columns={columns}
        dataSource={courses.filter(course =>
          (course.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
          (course.id?.toLowerCase() || '').includes(searchQuery.toLowerCase())
        )}
        rowKey="_id"
        pagination={{ pageSize: 7 }}
        className="course-table"
      />
      <Modal
  title="Course Details"
  visible={isViewModalVisible}
  onCancel={() => {
    setIsViewModalVisible(false);
    setViewingCourse(null);
  }}
  footer={[
    <Button key="close" onClick={() => setIsViewModalVisible(false)}>
      Close
    </Button>
  ]}
>
  {viewingCourse && (
    <div>
      <p><strong>Course ID:</strong> {viewingCourse.id}</p>
      <p><strong>Course Name:</strong> {viewingCourse.name}</p>
      <p><strong>Instructor:</strong> {viewingCourse.instructor?.name} ({viewingCourse.instructor?.id})</p>
      <p><strong>Semester:</strong> {viewingCourse.semester}</p>
      <p><strong>Section:</strong> {viewingCourse.sections}</p>
      <p><strong>Seats Available:</strong> {viewingCourse.seatAvailability}</p>
      <p><strong>Credit Hours:</strong> {viewingCourse.creditHours}</p>
      <p><strong>Prerequisites:</strong> {
      viewingCourse.prerequisites?.length > 0
        ? viewingCourse.prerequisites
            .map(pid => {
              const match = availableCourses.find(c => c.id === pid);
              return match ? `${match.name} (${match.id})` : pid;
            })
            .join(', ')
        : 'None'
    }</p>

    </div>
  )}
</Modal>

      <Modal
        title={editingCourse ? 'Edit Course' : 'Add Course'}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingCourse(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveCourse}>
          <Form.Item name="id" label="Course ID" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name" label="Course Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="semester" label="Semester" rules={[{ required: true }]}>
            <Select>
              <Option value="Fall">Fall</Option>
              <Option value="Spring">Spring</Option>
              <Option value="Summer">Summer</Option>
            </Select>
          </Form.Item>
          <Form.Item name="sections" label="Section" rules={[{ required: true }]}>
          <Select>
              <Option value="A">A</Option>
              <Option value="B">B</Option>
              <Option value="C">C</Option>
              <Option value="D">D</Option>
              <Option value="E">E</Option>
              <Option value="F">F</Option>
              <Option value="G">G</Option>
              <Option value="H">H</Option>
            </Select>
          </Form.Item>
          <Form.Item name="seatAvailability" label="Seats Available" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="creditHours" label="Credit Hours" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="instructor" label="Instructor" rules={[{ required: true }]}>
            <Select labelInValue>
              {teachers.map(teacher => (
                <Option key={teacher.tid} value={teacher.tid}>
                  {teacher.name} ({teacher.tid})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="prerequisites" label="Prerequisites">
          <Select
            mode="multiple"
            placeholder="Select prerequisite courses"
            optionLabelProp="label"
          >
            {availableCourses.map(course => (
              <Option key={course.id} value={course.id} label={`${course.name} (${course.id})`}>
                {course.name} ({course.id})
              </Option>
            ))}
          </Select>
        </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Aregistration;
