// src/components/Tmarks.js

import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Card, Typography, Space, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Tmarks.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Tmarks = () => {
  const [marksType, setMarksType] = useState('');
  const [specificType, setSpecificType] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [students, setStudents] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [marksRecords, setMarksRecords] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const tid = localStorage.getItem('tid');

  useEffect(() => {
    if (tid) fetchCourses();
  }, [tid]);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/teachers/${tid}/courses`);
      setTeacherCourses(res.data);
    } catch {
      message.error('Failed to load courses');
    }
  };

  const handleCourseChange = async (value) => {
    const course = teacherCourses.find(c => `${c.id}-${c.sections}` === value);
    if (!course) return;

    setSelectedCourse(course);
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/courses/${course.id}/sections/${course.sections}/students`);
      setStudents(res.data.map(s => ({ ...s, marks: '' })));
    } catch {
      message.error('Failed to load students');
    }

    try {
      const res = await axios.get(`http://localhost:5000/api/admin/marks/${course.id}/${course.sections}`);
      setMarksRecords(res.data);
    } catch {
      setMarksRecords([]);
    }
  };

  const handleAddMarks = async () => {
    if (!marksType || !totalMarks || !selectedCourse) {
      return message.warning('Fill all required fields');
    }

    const isDuplicate = marksRecords.some(r =>
      r.type === marksType &&
      (marksType === 'Quiz' || marksType === 'Assignment'
        ? r.specificType === (specificType || 'General')
        : true)
    );

    if (isDuplicate && !isEditing) {
      return message.error(`${marksType} ${specificType || ''} already exists.`);
    }

    const invalid = students.find(s => isNaN(s.marks) || s.marks < 0 || s.marks > totalMarks);
    if (invalid) return message.error('Marks must be between 0 and total marks');

    const payload = {
      courseId: selectedCourse.id,
      section: selectedCourse.sections,
      type: marksType,
      specificType: specificType || 'General',
      totalMarks,
      students,
    };

    try {
      if (isEditing) {
        const res = await axios.put(`http://localhost:5000/api/admin/marks/${editingId}`, payload);
        setMarksRecords(marksRecords.map(r => r._id === editingId ? res.data : r));
        message.success('Marks updated');
      } else {
        const res = await axios.post(`http://localhost:5000/api/admin/marks`, payload);
        setMarksRecords([res.data, ...marksRecords]);
        message.success('Marks added');
      }
      resetForm();
    } catch {
      message.error('Failed to save marks');
    }
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingId(record._id);
    setMarksType(record.type);
    setSpecificType(record.specificType !== 'General' ? record.specificType : '');
    setTotalMarks(record.totalMarks);
    setStudents(record.students.map(s => ({ ...s })));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setMarksType('');
    setSpecificType('');
    setTotalMarks('');
    setStudents([]);
    setIsEditing(false);
    setEditingId(null);
  };

  const marksColumns = [
    { title: 'Roll No', dataIndex: 'rollNo' },
    { title: 'Name', dataIndex: 'name' },
    {
      title: 'Marks',
      render: (_, record) => {
        const idx = students.findIndex(s => s.rollNo === record.rollNo);
        return (
          <Input
            type="number"
            min={0}
            max={totalMarks}
            value={students[idx]?.marks}
            onChange={e => {
              const updated = [...students];
              updated[idx].marks = e.target.value;
              setStudents(updated);
            }}
          />
        );
      }
    }
  ];

  const recordsColumns = [
    { title: 'Type', dataIndex: 'type' },
    { title: 'Specific', dataIndex: 'specificType' },
    { title: 'Total Marks', dataIndex: 'totalMarks' },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => {
            setSelectedRecord(record);
            setViewDetails(true);
          }}>View</Button>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="marks-container">
      <header className="welcome-header">
        <Title level={2}>📊 Teacher Marks Management</Title>
        <Text type="secondary">Add and manage student marks efficiently.</Text>
      </header>

      <Card className="marks-input">
        <Space wrap>
          <Select placeholder="Select Course" style={{ width: 200 }} onChange={handleCourseChange}>
            {teacherCourses.map(course => (
              <Option key={`${course.id}-${course.sections}`} value={`${course.id}-${course.sections}`}>
                {course.id} ({course.sections})
              </Option>
            ))}
          </Select>

          <Select placeholder="Select Marks Type" value={marksType} onChange={setMarksType} style={{ width: 150 }}>
            <Option value="Quiz">Quiz</Option>
            <Option value="Assignment">Assignment</Option>
            <Option value="Sessional 1">Sessional 1</Option>
            <Option value="Sessional 2">Sessional 2</Option>
            <Option value="Project">Project</Option>
            <Option value="Final">Final</Option>
          </Select>

          {(marksType === 'Quiz' || marksType === 'Assignment') && (
            <Input placeholder={`${marksType} Number`} value={specificType} onChange={(e) => setSpecificType(e.target.value)} style={{ width: 120 }} />
          )}

          <Input placeholder="Total Marks" type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} style={{ width: 120 }} />

          <Button type="primary" onClick={handleAddMarks}>
            {isEditing ? 'Update Marks' : 'Add Marks'}
          </Button>
        </Space>
      </Card>

      {selectedCourse && (
        <Card style={{ marginTop: 20 }}>
          <Title level={4}>🧑‍🎓 Enter Marks</Title>
          <Table dataSource={students} columns={marksColumns} rowKey="rollNo" pagination={false} />
        </Card>
      )}

      <Card className="marks-records" style={{ marginTop: 20 }}>
        <Title level={4}>📋 Marks Records</Title>
        <Table dataSource={marksRecords} columns={recordsColumns} rowKey="_id" pagination={{ pageSize: 5 }} />
      </Card>

      {viewDetails && selectedRecord && (
        <Card className="marks-details">
          <Button onClick={() => setViewDetails(false)} style={{ marginBottom: 10 }}>⬅ Back</Button>
          <Title level={4}>{selectedRecord.type} {selectedRecord.specificType} - Total: {selectedRecord.totalMarks}</Title>
          <Table
            dataSource={selectedRecord.students}
            columns={[
              { title: 'Roll No', dataIndex: 'rollNo' },
              { title: 'Name', dataIndex: 'name' },
              { title: 'Marks', dataIndex: 'marks' },
            ]}
            rowKey="rollNo"
            pagination={{ pageSize: 5 }}
          />
        </Card>
      )}
    </div>
  );
};

export default Tmarks;
