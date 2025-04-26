// src/components/Tgrader.js

import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Typography, Modal, Space, Progress, InputNumber, Select, Radio, message } from 'antd';
import { BarChartOutlined, CalculatorOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Tgrader.css';

const { Title, Text } = Typography;
const { Option } = Select;

const gradeScaleAbsoluteDefault = [
  { grade: 'A+', min: 90 },
  { grade: 'A', min: 85 },
  { grade: 'A-', min: 80 },
  { grade: 'B+', min: 75 },
  { grade: 'B', min: 70 },
  { grade: 'B-', min: 65 },
  { grade: 'C+', min: 60 },
  { grade: 'C', min: 55 },
  { grade: 'C-', min: 50 },
  { grade: 'D+', min: 45 },
  { grade: 'D', min: 40 },
  { grade: 'F', min: 0 },
];

// GPA Mapping
const gradeToGpa = {
  'A+': 4.0,
  'A': 4.0,
  'A-': 3.67,
  'B+': 3.33,
  'B': 3.0,
  'B-': 2.67,
  'C+': 2.33,
  'C': 2.0,
  'C-': 1.67,
  'D+': 1.33,
  'D': 1.0,
  'F': 0.0
};

const Tgrader = () => {
  const [students, setStudents] = useState([]);
  const [teacherCourses, setTeacherCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [gradeDistribution, setGradeDistribution] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  const [gradingMethod, setGradingMethod] = useState('absolute'); // absolute or relative
  const [gradingScale, setGradingScale] = useState([...gradeScaleAbsoluteDefault]);

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
    const [courseId, section] = value.split('-');
    setSelectedCourse({ id: courseId, section });
  
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/student-grades/${courseId}/${section}`);
      
      if (res.data && res.data.length > 0) {
        setStudents(res.data);  // Students exist
      } else {
        setStudents([]); // No students but still successful
      }
    } catch (error) {
      console.error('Error loading student grades:', error);
      message.error('Error loading student grades. Please try again.');
    }
  };
  

  const generateGrades = async () => {
    if (!students.length) {
      return message.warning('No students found.');
    }

    let gradedStudents = [];

    if (gradingMethod === 'absolute') {
      gradedStudents = students.map(student => {
        const gradeObj = gradingScale.find(scale => student.weightedScore >= scale.min) || { grade: 'F' };
        return { ...student, grade: gradeObj.grade, gpa: gradeToGpa[gradeObj.grade] || 0 };
      });
    } else if (gradingMethod === 'relative') {
      const scores = students.map(s => Number(s.weightedScore));
      const mean = scores.reduce((sum, val) => sum + val, 0) / scores.length;
      const stdDev = Math.sqrt(scores.reduce((sum, val) => sum + (val - mean) ** 2, 0) / scores.length);

      gradedStudents = students.map(student => {
        const zScore = (student.weightedScore - mean) / stdDev;

        let grade = 'F';
        if (zScore >= 1.0) grade = 'A+';
        else if (zScore >= 0.5) grade = 'A';
        else if (zScore >= 0.0) grade = 'B+';
        else if (zScore >= -0.5) grade = 'B';
        else if (zScore >= -1.0) grade = 'C+';
        else if (zScore >= -1.5) grade = 'C';
        else if (zScore >= -2.0) grade = 'D';
        else grade = 'F';

        return { ...student, grade, gpa: gradeToGpa[grade] || 0 };
      });
    }

    setStudents(gradedStudents);
    calculateGradeDistribution(gradedStudents);

    // Update grades and GPA to DB
    await Promise.all(gradedStudents.map(async (student) => {
      await axios.post('http://localhost:5000/api/admin/student-grades', {
        rollNo: student.rollNo,
        name: student.name,
        courseId: selectedCourse.id,
        courseName: student.courseName || 'Unnamed Course',
        section: selectedCourse.section,
        weightedScore: student.weightedScore,
        grade: student.grade,
        gpa: student.gpa
      });
    }));

    message.success('Grades generated and saved successfully!');
  };

  const calculateGradeDistribution = (gradedStudents) => {
    let distribution = {};
    gradedStudents.forEach(student => {
      distribution[student.grade] = (distribution[student.grade] || 0) + 1;
    });
    setGradeDistribution(distribution);
  };

  const updateGradingScale = (grade, min) => {
    setGradingScale((prevScale) =>
      prevScale.map((item) => (item.grade === grade ? { ...item, min } : item))
    );
  };

  const columns = [
    { title: 'Roll No', dataIndex: 'rollNo', key: 'rollNo' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Total Weighted Score', dataIndex: 'weightedScore', key: 'weightedScore' },
    { title: 'Grade', dataIndex: 'grade', key: 'grade', render: text => text || 'Pending' },
    { title: 'GPA', dataIndex: 'gpa', key: 'gpa', render: text => text ?? '-' },
  ];

  return (
    <div className="grader-container">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📊 Grade Management</Title>
        <Text type="secondary">
          Manage and generate student grades effortlessly.
        </Text>
      </header>

      <Card className="grader-actions">
        <Space size="middle" wrap>
          <Select placeholder="Select Course" style={{ width: 250 }} onChange={handleCourseChange}>
            {teacherCourses.map(course => (
              <Option key={`${course.id}-${course.sections}`} value={`${course.id}-${course.sections}`}>
                {course.id} ({course.sections})
              </Option>
            ))}
          </Select>

          <Radio.Group value={gradingMethod} onChange={e => setGradingMethod(e.target.value)}>
            <Radio.Button value="absolute">Absolute</Radio.Button>
            <Radio.Button value="relative">Relative</Radio.Button>
          </Radio.Group>

          <Button type="primary" icon={<CalculatorOutlined />} onClick={generateGrades}>
            Generate Grades
          </Button>

          <Button type="default" icon={<BarChartOutlined />} onClick={() => setShowReport(true)}>
            View Detailed Grade Report
          </Button>

          <Button type="dashed" icon={<SettingOutlined />} onClick={() => setShowConfig(true)}>
            Grader Configuration
          </Button>
        </Space>
      </Card>

      <Card className="grades-table">
        <Title level={4}>📋 Student Grades</Title>
        <Table
          dataSource={students}
          columns={columns}
          rowKey="rollNo"
          pagination={{ pageSize: 5 }}
        />
      </Card>

      {/* Detailed Grade Report Modal */}
      <Modal
        title="📊 Detailed Grade Report"
        visible={showReport}
        onCancel={() => setShowReport(false)}
        footer={null}
      >
        <div className="grade-report">
          {Object.keys(gradeDistribution).length > 0 ? (
            Object.entries(gradeDistribution).map(([grade, count]) => (
              <div key={grade} className="grade-stat">
                <Text strong>{grade}: {count} students</Text>
                <Progress percent={(count / students.length) * 100} status="active" />
              </div>
            ))
          ) : (
            <Text>No grades generated yet.</Text>
          )}
        </div>
      </Modal>

      {/* Grader Configuration Modal */}
      <Modal
        title="⚙️ Grader Configuration"
        visible={showConfig}
        onCancel={() => setShowConfig(false)}
        footer={[
          <Button key="close" onClick={() => setShowConfig(false)}>
            Close
          </Button>,
        ]}
      >
        <div className="grader-config">
          {gradingMethod === 'absolute' ? (
            gradingScale.map((item) => (
              <div key={item.grade} className="grade-config-row">
                <Text strong>{item.grade}:</Text>
                <InputNumber
                  min={0}
                  max={100}
                  value={item.min}
                  onChange={(value) => updateGradingScale(item.grade, value)}
                />
              </div>
            ))
          ) : (
            <Text>Relative grading uses mean and standard deviation automatically. No manual thresholds.</Text>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Tgrader;
