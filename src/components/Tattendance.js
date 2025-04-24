import React, { useState, useEffect } from 'react';
import {
  Table, Button, Input, DatePicker, Select, Modal, Typography, Card, message
} from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Tattendance.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Tattendance = () => {
  const [attendanceDate, setAttendanceDate] = useState(null);
  const [lectureTitle, setLectureTitle] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [currentAttendance, setCurrentAttendance] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    const tid = localStorage.getItem('tid');
    console.log('Logged-in Teacher ID:', tid);
    if (tid) fetchTeacherCourses();
  }, []);
  
  const fetchTeacherCourses = async () => {
    const tid = localStorage.getItem('tid'); // 👈 define tid here
    console.log('Logged-in Teacher ID:', tid);
  
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/teachers/${tid}/courses`);
      console.log('Fetched Courses:', res.data);
      setTeacherCourses(res.data);
    } catch (err) {
      console.error('Error loading courses:', err);
      message.error('Failed to load courses');
    }
  };
  
  

  const fetchEnrolledStudents = async (course) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/courses/${course.id}/sections/${course.sections}/students`
      );
      setStudents(res.data);
    } catch (err) {
      message.error('Failed to load students');
    }
  };

  const fetchAttendanceRecords = async (course) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/attendance/${course.id}/${course.sections}`
      );
      setAttendanceRecords(res.data);
    } catch (err) {
      message.error('Failed to load attendance records');
    }
  };

  const handleCourseChange = (value) => {
    const course = teacherCourses.find(
      (c) => `${c.id}-${c.sections}` === value
    );

    if (!course) {
      message.error("Selected course not found in list");
      return;
    }

    setSelectedCourse(course);
    fetchEnrolledStudents(course);
    fetchAttendanceRecords(course);
  };

  const handleAddAttendance = async () => {
    if (!attendanceDate || !lectureTitle || !selectedCourse) {
      message.warning('Please select a course, date and enter lecture title!');
      return;
    }

    const payload = {
      courseId: selectedCourse.id,
      section: selectedCourse.sections,
      date: attendanceDate.format('YYYY-MM-DD'),
      lectureTitle,
      students: students.map((student) => ({
        rollNo: student.rollNo,
        name: student.name,
        status: 'P'
      }))
    };

    try {
      const res = await axios.post('http://localhost:5000/api/admin/attendance', payload);
      setAttendanceRecords([res.data, ...attendanceRecords]);
      setAttendanceDate(null);
      setLectureTitle('');
      message.success('Attendance added successfully');
    } catch (err) {
      message.error('Failed to add attendance');
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setCurrentAttendance(record.students);
  };

  const handleEditAttendance = (student) => {
    setEditingRecord(student);
    setEditModalVisible(true);
  };

  const saveEditAttendance = async () => {
    const updatedStudents = currentAttendance.map((student) =>
      student.rollNo === editingRecord.rollNo ? editingRecord : student
    );
  
    const updated = {
      ...selectedRecord,
      students: updatedStudents
    };
  
    try {
      await axios.put(`http://localhost:5000/api/admin/attendance/${selectedRecord._id}`, updated);
  
      const updatedAll = attendanceRecords.map((r) =>
        r._id === updated._id ? updated : r
      );
  
      setAttendanceRecords(updatedAll);
      setSelectedRecord(updated); // ✅ Update the selected record too
      setCurrentAttendance(updatedStudents); // ✅ Update the current table immediately
      setEditModalVisible(false);
      setEditingRecord(null); // optional: reset after save
      message.success('Attendance updated');
    } catch (err) {
      message.error('Failed to update attendance');
    }
  };
  

  const attendanceColumns = [
    { title: 'Roll No', dataIndex: 'rollNo', key: 'rollNo' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '#52c41a';
        if (status === 'A') color = '#ff4d4f';
        if (status === 'L') color = '#faad14';
        return <Text style={{ color }}>{status}</Text>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button icon={<EditOutlined />} onClick={() => handleEditAttendance(record)} />
      ),
    },
  ];

  const recordsColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Lecture Title', dataIndex: 'lectureTitle', key: 'lectureTitle' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button icon={<EyeOutlined />} onClick={() => handleViewRecord(record)} />
      ),
    },
  ];

  return (
    <div className="attendance-container">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📅 Class Attendance</Title>
        <Text type="secondary">Manage attendance records effortlessly.</Text>
      </header>

      <Card className="attendance-input">
        <div className="attendance-controls">
          <Select
            placeholder="Select Course"
            style={{ width: 200 }}
            onChange={handleCourseChange}
          >
            {teacherCourses.map((course) => (
              <Option key={`${course.id}-${course.sections}`} value={`${course.id}-${course.sections}`}>
                {`${course.id} (${course.sections})`}
              </Option>
            ))}
          </Select>
          <DatePicker
            placeholder="Select Date"
            onChange={(date) => setAttendanceDate(date)}
            value={attendanceDate}
          />
          <Input
            placeholder="Lecture Title"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
          />
          <div className="markss-buttons">
            <Button type="primary" onClick={handleAddAttendance}>Add Attendance</Button>
          </div>
        </div>
      </Card>

      <Card className="attendance-records">
        <Title level={4}>📋 Attendance Records</Title>
        <Table
          dataSource={attendanceRecords}
          columns={recordsColumns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {selectedRecord && (
        <Card className="attendance-table">
          <Title level={4}>Attendance for {selectedRecord.date} - {selectedRecord.lectureTitle}</Title>
          <Table
            dataSource={currentAttendance}
            columns={attendanceColumns}
            rowKey="rollNo"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}

      <Modal
        title="Edit Attendance"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={saveEditAttendance}
      >
        {editingRecord && (
          <>
            <Text>Roll No: {editingRecord.rollNo}</Text>
            <br />
            <Text>Name: {editingRecord.name}</Text>
            <br />
            <Select
              value={editingRecord.status}
              onChange={(value) => setEditingRecord({ ...editingRecord, status: value })}
            >
              <Option value="P">Present</Option>
              <Option value="A">Absent</Option>
              <Option value="L">Late</Option>
            </Select>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Tattendance;
