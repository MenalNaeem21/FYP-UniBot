import React, { useState } from 'react';
import { Table, Button, Input, Select, Card, Typography, Modal, Space } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import './Tmarks.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Tmarks = () => {
  const [marksType, setMarksType] = useState(''); // Quiz, Assignment, etc.
  const [specificType, setSpecificType] = useState(''); // Quiz 1, Assignment 1, etc.
  const [totalMarks, setTotalMarks] = useState(''); // Total Marks
  const [students, setStudents] = useState([
    { rollNo: 'CS101', name: 'Alice', marks: '' },
    { rollNo: 'CS102', name: 'Bob', marks: '' },
    { rollNo: 'CS103', name: 'Charlie', marks: '' },
  ]);
  const [marksRecords, setMarksRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewDetails, setViewDetails] = useState(false);

  // Add a new marks record
  const handleAddMarks = () => {
    if (!marksType || !totalMarks) {
      alert('Please select a marks type and enter total marks!');
      return;
    }

    const newRecord = {
      id: `${marksType}-${specificType || 'General'}-${Date.now()}`,
      type: marksType,
      specificType: specificType || 'General',
      totalMarks,
      students: students.map((student) => ({
        rollNo: student.rollNo,
        name: student.name,
        marks: student.marks || '0',
      })),
    };

    setMarksRecords([...marksRecords, newRecord]);
    setMarksType('');
    setSpecificType('');
    setTotalMarks('');
    setStudents(students.map((student) => ({ ...student, marks: '' })));
  };

  // View Marks Details
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setViewDetails(true);
  };

  // Edit Student Marks
  const handleEditMarks = (student) => {
    const updatedStudents = students.map((s) =>
      s.rollNo === student.rollNo ? { ...s, marks: student.marks } : s
    );
    setStudents(updatedStudents);
  };

  const marksColumns = [
    { title: 'Roll No', dataIndex: 'rollNo', key: 'rollNo' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Marks',
      dataIndex: 'marks',
      key: 'marks',
      render: (text, record) => (
        <Input
          type="number"
          defaultValue={text}
          onChange={(e) =>
            handleEditMarks({ ...record, marks: e.target.value })
          }
        />
      ),
    },
  ];

  const recordsColumns = [
    { title: 'Type', dataIndex: 'type', key: 'type' },
    { title: 'Specific', dataIndex: 'specificType', key: 'specificType' },
    { title: 'Total Marks', dataIndex: 'totalMarks', key: 'totalMarks' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="marks-container">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📊 Teacher Marks Management</Title>
        <Text type="secondary">
        Add and manage student marks efficiently.
        </Text>
      </header>

      {/* Marks Input Section */}
      {!viewDetails && (
        <Card className="marks-input">
          <Space className="marks-controls" size="middle">
            <Select
              placeholder="Select Marks Type"
              value={marksType}
              onChange={(value) => setMarksType(value)}
              style={{ width: 150 }}
            >
              <Option value="Quiz">Quiz</Option>
              <Option value="Assignment">Assignment</Option>
              <Option value="Midterm">Midterm</Option>
              <Option value="Project">Project</Option>
              <Option value="Final">Final</Option>
            </Select>

            {(marksType === 'Quiz' || marksType === 'Assignment') && (
              <Input
                placeholder={`Enter ${marksType} Number (e.g., 1, 2, 3)`}
                value={specificType}
                onChange={(e) => setSpecificType(e.target.value)}
                style={{ width: 200 }}
              />
            )}

            <Input
              placeholder="Enter Total Marks"
              value={totalMarks}
              onChange={(e) => setTotalMarks(e.target.value)}
              type="number"
              style={{ width: 150 }}
            />
            <div className="markss-buttons">
            <Button type="primary" onClick={handleAddMarks}>
              Add Marks
            </Button>
            </div>

          </Space>
        </Card>
      )}

      {/* Records Display */}
      {!viewDetails && (
        <Card className="marks-records">
          <Title level={4}>📋 Marks Records</Title>
          <Table
            dataSource={marksRecords}
            columns={recordsColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}

      {/* Individual Record Display */}
      {viewDetails && selectedRecord && (
        <Card className="marks-details">
          <Button onClick={() => setViewDetails(false)} style={{ marginBottom: 10 }}>
            ⬅️ Back to Records
          </Button>
          <Title level={4}>
            {selectedRecord.type} {selectedRecord.specificType} Details
          </Title>
          <Text>Total Marks: {selectedRecord.totalMarks}</Text>
          <Table
            dataSource={selectedRecord.students}
            columns={marksColumns}
            rowKey="rollNo"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}
    </div>
  );
};

export default Tmarks;
