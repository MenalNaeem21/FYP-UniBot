// src/components/Tmarks.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, Card, Typography, Space, message, InputNumber, Popconfirm } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Tmarks.css';
import * as XLSX from 'xlsx';

const { Title, Text } = Typography;
const { Option } = Select;

const Tmarks = () => {
  const [marksType, setMarksType] = useState('');
  const [specificType, setSpecificType] = useState('');
  const [totalMarks, setTotalMarks] = useState('');
  const [weightage, setWeightage] = useState('');
  const [students, setStudents] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [marksRecords, setMarksRecords] = useState([]);
  const [viewDetails, setViewDetails] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [bestOf, setBestOf] = useState(null);

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

  const getTotalWeightage = () => {
    let total = 0;
    const grouped = {};

    marksRecords.forEach(r => {
      if (r.type === 'Quiz' || r.type === 'Assignment') {
        grouped[r.type] = grouped[r.type] || [];
        grouped[r.type].push(r);
      } else {
        total += Number(r.weightage || 0);
      }
    });

    // Only add first quiz/assignment full weightage
    ['Quiz', 'Assignment'].forEach(type => {
      if (grouped[type]?.length) {
        total += Number(grouped[type][0].weightage || 0);
      }
    });

    return total;
  };

  const getStudentSummaryFrom = (records = []) => {
    if (!records.length) return [];
  
    const summary = {};
    const grouped = { Quiz: [], Assignment: [], Other: [] };
  
    // Group records
    records.forEach(r => {
      if (r.type === 'Quiz') grouped.Quiz.push(r);
      else if (r.type === 'Assignment') grouped.Assignment.push(r);
      else grouped.Other.push(r);
    });
  
    // Handle Others (Sessionals, Project, Final)
    grouped.Other.forEach(record => {
      const tm = Number(record.totalMarks || 0);
      record.students.forEach(s => {
        if (!summary[s.rollNo]) {
          summary[s.rollNo] = { name: s.name, totalWeighted: 0, totalRaw: 0, quizzes: [], assignments: [] };
        }
        const percent = (s.marks / tm) * Number(record.weightage || 0);
        summary[s.rollNo].totalWeighted += isNaN(percent) ? 0 : percent;
        summary[s.rollNo].totalRaw += Number(s.marks);
      });
    });
  
    // Handle Quizzes
    grouped.Quiz.forEach(record => {
      const tm = Number(record.totalMarks || 0);
      record.students.forEach(s => {
        if (!summary[s.rollNo]) {
          summary[s.rollNo] = { name: s.name, totalWeighted: 0, totalRaw: 0, quizzes: [], assignments: [] };
        }
        summary[s.rollNo].quizzes.push({ score: s.marks, totalMarks: tm });
        summary[s.rollNo].totalRaw += Number(s.marks);
      });
    });
  
    // Handle Assignments
    grouped.Assignment.forEach(record => {
      const tm = Number(record.totalMarks || 0);
      record.students.forEach(s => {
        if (!summary[s.rollNo]) {
          summary[s.rollNo] = { name: s.name, totalWeighted: 0, totalRaw: 0, quizzes: [], assignments: [] };
        }
        summary[s.rollNo].assignments.push({ score: s.marks, totalMarks: tm });
        summary[s.rollNo].totalRaw += Number(s.marks);
      });
    });
  
    Object.entries(summary).forEach(([rollNo, data]) => {
      const calcBest = (list, totalWeightage) => {
        if (!list.length) return 0;
    
        // 🛡 Normalize every record properly before sorting
        const normalized = list.map(entry => ({
          score: Number(entry.score) || 0,
          totalMarks: Number(entry.totalMarks) || 1  // avoid divide by 0
        }));
    
        const sorted = [...normalized].sort((a, b) => 
          (b.score / b.totalMarks) - (a.score / a.totalMarks)
        );
    
        const selected = bestOf && bestOf < sorted.length ? sorted.slice(0, bestOf) : sorted;
    
        const studentTotal = selected.reduce((sum, entry) => sum + entry.score, 0);
        const maxTotal = selected.reduce((sum, entry) => sum + entry.totalMarks, 0);
    
        if (maxTotal === 0) return 0;
        return (studentTotal / maxTotal) * totalWeightage;
      };
    
      // Calculate based on total course weightages
      const quizTotalWeightage = grouped.Quiz.length ? Number(grouped.Quiz[0].weightage || 0) : 0;
      const assignTotalWeightage = grouped.Assignment.length ? Number(grouped.Assignment[0].weightage || 0) : 0;
    
      data.totalWeighted += calcBest(data.quizzes, quizTotalWeightage);
      data.totalWeighted += calcBest(data.assignments, assignTotalWeightage);
    });
    
  
    return Object.entries(summary).map(([rollNo, val]) => ({
      rollNo,
      name: val.name,
      totalRaw: val.totalRaw.toFixed(2),
      totalWeighted: val.totalWeighted.toFixed(2)
    }));
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
  
    let wt = Number(weightage);
  
    if (marksType === 'Quiz' || marksType === 'Assignment') {
      const sameTypeRecords = marksRecords.filter(r => r.type === marksType);
      if (sameTypeRecords.length === 0) {
        if (isNaN(wt) || wt <= 0) return message.error('Enter a valid weightage for first quiz/assignment');
      } else {
        wt = sameTypeRecords[0].weightage; // Important: use first record's weightage
      }
    } else {
      if (isNaN(wt) || wt <= 0) return message.error('Enter a valid weightage');
    }
  
    const existingTotal = getTotalWeightage();
    let updatedTotal = isEditing ? (existingTotal - (marksRecords.find(r => r._id === editingId)?.weightage || 0) + wt) : (existingTotal + wt);
  
    if (updatedTotal > 100) {
      return message.error('Total course weightage exceeds 100%');
    }
  
    const payload = {
      courseId: selectedCourse.id,
      section: selectedCourse.sections,
      type: marksType,
      specificType: specificType || 'General',
      totalMarks,
      weightage: wt,
      instructor: {
        id: selectedCourse.instructor?.id,
        name: selectedCourse.instructor?.name
      },
      students,
    };
  
    try {
      let updatedRecords;
      if (isEditing) {
        const res = await axios.put(`http://localhost:5000/api/admin/marks/${editingId}`, payload);
        updatedRecords = marksRecords.map(r => r._id === editingId ? res.data : r);
        setMarksRecords(updatedRecords);
        message.success('Marks updated');
      } else {
        const res = await axios.post(`http://localhost:5000/api/admin/marks`, payload);
        updatedRecords = [res.data, ...marksRecords];
        setMarksRecords(updatedRecords);
        message.success('Marks added');
      }
  
      await fetchMarksRecords(selectedCourse.id, selectedCourse.sections);   // ✅ re-fetch marks records
      await fetchStudents(selectedCourse.id, selectedCourse.sections);       // ✅ re-fetch students (important)
      
      const studentSummaries = getStudentSummaryFrom(updatedRecords);
  
      await Promise.all(studentSummaries.map(async (summary) => {
        const gradePayload = {
          rollNo: summary.rollNo,
          name: summary.name,
          courseId: selectedCourse.id,
          courseName: selectedCourse.name || 'Unnamed Course',
          section: selectedCourse.sections,
          weightedScore: summary.totalWeighted
        };
        await axios.post('http://localhost:5000/api/admin/student-grades', gradePayload);
      }));
  
      resetForm();
    } catch {
      message.error('Failed to save marks');
    }
  };
  


  const handleDeleteRecord = async (recordId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/marks/${recordId}`);
      setMarksRecords(prev => prev.filter(r => r._id !== recordId));
      message.success('Marks record deleted successfully!');
    } catch {
      message.error('Failed to delete marks record.');
    }
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingId(record._id);
    setMarksType(record.type);
    setSpecificType(record.specificType !== 'General' ? record.specificType : '');
    setTotalMarks(record.totalMarks);
    
    if (!(record.type === 'Quiz' || record.type === 'Assignment')) {
      setWeightage(record.weightage);
    } else {
      setWeightage(''); // ❗ Clear weightage input for quiz/assignment while editing
    }
    
    setStudents(record.students.map(s => ({ ...s })));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  

  const fetchMarksRecords = async (courseId, section) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/marks/${courseId}/${section}`);
      setMarksRecords(res.data);
    } catch {
      setMarksRecords([]);
    }
  };

  const fetchStudents = async (courseId, section) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/courses/${courseId}/sections/${section}/students`);
      setStudents(res.data.map(s => ({ ...s, marks: '' })));
    } catch {
      message.error('Failed to reload students');
    }
  };
  
  

  const resetForm = () => {
    setMarksType('');
    setSpecificType('');
    setTotalMarks('');
    setWeightage('');
    // ❌ DON'T clear students here
    setIsEditing(false);
    setEditingId(null);
  };
  

  const exportToCSV = () => {
    if (marksRecords.length === 0) {
      return message.warning('No marks records to export.');
    }
    const allRows = marksRecords.flatMap(record =>
      record.students.map(student => ({
        Course: `${selectedCourse?.id || ''} (${selectedCourse?.sections || ''})`,
        Type: record.type,
        SpecificType: record.specificType,
        TotalMarks: record.totalMarks,
        Weightage: record.weightage,
        RollNo: student.rollNo,
        Name: student.name,
        Marks: student.marks
      }))
    );
    const worksheet = XLSX.utils.json_to_sheet(allRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Marks");
    XLSX.writeFile(workbook, "Marks_Records.xlsx");
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
    { title: 'Weightage', dataIndex: 'weightage' },
    {
      title: 'Actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => {
            setSelectedRecord(record);
            setViewDetails(true);
          }}>View</Button>
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Popconfirm title="Confirm delete this record?" onConfirm={() => handleDeleteRecord(record._id)}>
            <Button danger icon={<DeleteOutlined />}>Delete</Button>
          </Popconfirm>
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
            <>
              <Input placeholder={`${marksType} Number`} value={specificType} onChange={(e) => setSpecificType(e.target.value)} style={{ width: 120 }} />
              {/* Only show weightage input for first quiz/assignment or always for other types */}
              {(marksType !== 'Quiz' && marksType !== 'Assignment') || marksRecords.filter(r => r.type === marksType).length === 0 ? (
                <Input
                  placeholder="Weightage (%)"
                  type="number"
                  value={weightage}
                  onChange={e => setWeightage(e.target.value)}
                  style={{ width: 140 }}
                />
              ) : null}
              <InputNumber min={1} placeholder="Best Of (optional)" value={bestOf} onChange={(value) => setBestOf(value)} style={{ width: 150 }} />
              <Button icon={<ReloadOutlined />} onClick={() => setBestOf(null)}>Reset Best Of</Button>
            </>
          )}

          <Input placeholder="Total Marks" type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} style={{ width: 120 }} />
          <Input
            placeholder="Weightage (%)"
            type="number"
            value={weightage}
            onChange={(e) => setWeightage(e.target.value)}
            style={{ width: 140 }}
            disabled={(marksType === 'Quiz' || marksType === 'Assignment') && isEditing}
          />


          <Button type="primary" onClick={handleAddMarks}>
            {isEditing ? 'Update Marks' : 'Add Marks'}
          </Button>
        </Space>
      </Card>

      {/* Rest below remains same */}



      {selectedCourse && (
        <Card style={{ marginTop: 20 }}>
          <Title level={4}>🧑‍🎓 Enter Marks</Title>
          <Table dataSource={students} columns={marksColumns} rowKey="rollNo" pagination={false} />
        </Card>
      )}

      <Card className="marks-records" style={{ marginTop: 20 }}>
        <Space style={{ marginBottom: 10, justifyContent: 'space-between', width: '100%' }}>
          <Title level={4}>📋 Marks Records</Title>
          <Button icon={<DownloadOutlined />} onClick={exportToCSV}>Export to Excel</Button>
        </Space>
        <Table dataSource={marksRecords} columns={recordsColumns} rowKey="_id" pagination={{ pageSize: 5 }} />
      </Card>

      <Card className="marks-summary" style={{ marginTop: 20 }}>
        <Title level={4}>📈 Student Summary</Title>
        <Table
          dataSource={getStudentSummaryFrom(marksRecords)} // <-- FIXED HERE
          columns={[
            { title: 'Roll No', dataIndex: 'rollNo' },
            { title: 'Name', dataIndex: 'name' },
            { title: 'Total Marks', dataIndex: 'totalRaw' },
            { title: 'Weighted Score (%)', dataIndex: 'totalWeighted' },
          ]}
          rowKey="rollNo"
          pagination={false}
        />
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
