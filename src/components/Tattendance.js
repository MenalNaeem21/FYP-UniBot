import React, { useState } from 'react';
import { Table, Button, Input, DatePicker, Select, Modal, Typography, Card } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import './Tattendance.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Tattendance = () => {
  const [attendanceDate, setAttendanceDate] = useState(null);
  const [lectureTitle, setLectureTitle] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]); // Stores attendance for all dates
  const [currentAttendance, setCurrentAttendance] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const handleAddAttendance = () => {
    if (!attendanceDate || !lectureTitle) {
      alert('Please select a date and enter lecture title!');
      return;
    }

    // Example student data
    const students = [
      { rollNo: 'CS101', name: 'Alice' },
      { rollNo: 'CS102', name: 'Bob' },
      { rollNo: 'CS103', name: 'Charlie' },
    ];

    const newRecord = {
      id: `${attendanceDate.format('YYYY-MM-DD')}`,
      date: attendanceDate.format('YYYY-MM-DD'),
      lectureTitle,
      students: students.map((student) => ({
        rollNo: student.rollNo,
        name: student.name,
        status: 'P', // Default status is Present
      })),
    };

    setAttendanceRecords([...attendanceRecords, newRecord]);
    setAttendanceDate(null);
    setLectureTitle('');
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setCurrentAttendance(record.students);
  };

  const handleEditAttendance = (student) => {
    setEditingRecord(student);
    setEditModalVisible(true);
  };

  const saveEditAttendance = () => {
    const updatedStudents = currentAttendance.map((student) =>
      student.rollNo === editingRecord.rollNo ? editingRecord : student
    );

    const updatedRecords = attendanceRecords.map((record) =>
      record.id === selectedRecord.id ? { ...record, students: updatedStudents } : record
    );

    setAttendanceRecords(updatedRecords);
    setEditModalVisible(false);
    setEditingRecord(null);
  };

  const attendanceColumns = [
    { title: 'Roll No', dataIndex: 'rollNo', key: 'rollNo' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '#52c41a'; // Green for P
        if (status === 'A') color = '#ff4d4f'; // Red for A
        if (status === 'L') color = '#faad14'; // Yellow for L
        return <Text style={{ color }}>{status}</Text>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEditAttendance(record)}
        />
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
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewRecord(record)}
        />
      ),
    },
  ];

  return (
    <div className="attendance-container">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📅 Class Attendance</Title>
        <Text type="secondary">
        Manage attendance records effortlessly.
        </Text>
      </header>
      {/* Input Section */}
      <Card className="attendance-input">
        <div className="attendance-controls">
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
          <Button type="primary" onClick={handleAddAttendance}>
            Add Attendance
          </Button>
          </div>
        </div>
      </Card>

      {/* Records Section */}
      <Card className="attendance-records">
        <Title level={4}>📋 Attendance Records</Title>
        <Table
          dataSource={attendanceRecords}
          columns={recordsColumns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Individual Attendance Display */}
      {selectedRecord && (
        <Card className="attendance-table">
          <Title level={4}>
            Attendance for {selectedRecord.date} - {selectedRecord.lectureTitle}
          </Title>
          <Table
            dataSource={currentAttendance}
            columns={attendanceColumns}
            rowKey="rollNo"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}

      {/* Edit Modal */}
      <Modal
        title="Edit Attendance"
        visible={editModalVisible}
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
              onChange={(value) =>
                setEditingRecord({ ...editingRecord, status: value })
              }
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
