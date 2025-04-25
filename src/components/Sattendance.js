import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Typography,
  Modal,
  Tag,
  message,
  Input,
} from 'antd';
import { EyeOutlined, SearchOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Todo.css';

const { Title, Text } = Typography;

const Sattendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const profileRes = await axios.get('http://localhost:5000/api/auth/studentprofile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const student = profileRes.data;

      const res = await axios.get('http://localhost:5000/api/admin/attendance/all');
      const allRecords = res.data;

      const courseMap = new Map();

      allRecords.forEach((record) => {
        record.students.forEach((studentRecord) => {
          if (studentRecord.rollNo === student.rollNo) {
            const key = `${record.courseId}-${record.section}`;
            if (!courseMap.has(key)) {
              courseMap.set(key, {
                key,
                courseId: record.courseId,
                courseName: record.courseName || 'N/A',
                section: record.section,
                instructor: record.instructor?.name || 'N/A',
                records: [],
              });
            }
            courseMap.get(key).records.push({
              date: record.date,
              status: studentRecord.status,
              lectureTitle: record.lectureTitle,
            });
          }
        });
      });

      const data = Array.from(courseMap.values()).map((entry) => {
        const total = entry.records.length;
        const present = entry.records.filter((r) => r.status === 'P').length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(2) + '%' : '0%';
        return {
          ...entry,
          percentage,
        };
      });

      setAttendanceData(data);
      setFilteredData(data);
    } catch (err) {
      console.error('Failed to fetch attendance', err);
      message.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = attendanceData.filter(
      (item) =>
        item.courseId.toLowerCase().includes(value) ||
        item.courseName.toLowerCase().includes(value)
    );
    setFilteredData(filtered);
  };

  const attendanceColumns = [
    {
      title: 'Course ID',
      dataIndex: 'courseId',
      key: 'courseId',
    },
    {
      title: 'Course Name',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
    },
    {
      title: 'Instructor',
      dataIndex: 'instructor',
      key: 'instructor',
    },
    {
      title: 'Attendance %',
      dataIndex: 'percentage',
      key: 'percentage',
      render: (text) => {
        const num = parseFloat(text);
        let color = 'green';
        if (num < 75) color = 'red';
        else if (num < 85) color = 'orange';
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedCourseDetails(record);
            setIsModalVisible(true);
          }}
        />
      ),
    },
  ];

  const modalColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Lecture Title', dataIndex: 'lectureTitle', key: 'lectureTitle' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = status === 'P' ? 'green' : status === 'A' ? 'red' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  return (
    <div className="todo-page">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📋 Attendance</Title>
        <Text type="secondary">Manage your attendance efficiently.</Text>
      </header>

      <Card className="timetable-card">
        <Title level={3} className="timetable-title">📅 Attendance Summary</Title>
        <Input
          placeholder="Search by Course ID or Name"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
          style={{ marginBottom: '1rem', width: '300px' }}
        />
        <Table
          dataSource={filteredData}
          columns={attendanceColumns}
          rowKey="key"
          loading={loading}
          pagination={false}
          className="timetable-table"
        />
      </Card>

      <Modal
        title={`Attendance Details: ${selectedCourseDetails?.courseName} (${selectedCourseDetails?.courseId}) - Section ${selectedCourseDetails?.section}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Table
          dataSource={selectedCourseDetails?.records || []}
          columns={modalColumns}
          rowKey={(record) => `${record.date}-${record.lectureTitle}`}
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default Sattendance;
