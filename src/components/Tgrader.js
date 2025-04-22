import React, { useState } from 'react';
import { Table, Button, Card, Typography, Modal, Space, Progress, InputNumber } from 'antd';
import { BarChartOutlined, CalculatorOutlined, SettingOutlined } from '@ant-design/icons';
import './Tgrader.css';

const { Title, Text } = Typography;

const Tgrader = () => {
  const [students, setStudents] = useState([
    { rollNo: 'CS101', name: 'Alice', marks: 85, grade: '' },
    { rollNo: 'CS102', name: 'Bob', marks: 78, grade: '' },
    { rollNo: 'CS103', name: 'Charlie', marks: 92, grade: '' },
    { rollNo: 'CS104', name: 'David', marks: 60, grade: '' },
    { rollNo: 'CS105', name: 'Eve', marks: 50, grade: '' },
    { rollNo: 'CS106', name: 'Frank', marks: 40, grade: '' },
  ]);

  const [gradeDistribution, setGradeDistribution] = useState({});
  const [showReport, setShowReport] = useState(false);
  const [showConfig, setShowConfig] = useState(false);

  // Default grading configuration
  const [gradingScale, setGradingScale] = useState([
    { grade: 'A', min: 85 },
    { grade: 'B', min: 75 },
    { grade: 'C', min: 65 },
    { grade: 'D', min: 50 },
    { grade: 'F', min: 0 },
  ]);

  // Function to generate grades based on configured thresholds
  const generateGrades = () => {
    let updatedStudents = students.map((student) => {
      let assignedGrade = gradingScale.find(scale => student.marks >= scale.min)?.grade || 'F';
      return { ...student, grade: assignedGrade };
    });

    setStudents(updatedStudents);
    calculateGradeDistribution(updatedStudents);
  };

  // Calculate grade distribution statistics
  const calculateGradeDistribution = (gradedStudents) => {
    let distribution = {};
    gradedStudents.forEach(student => {
      distribution[student.grade] = (distribution[student.grade] || 0) + 1;
    });
    setGradeDistribution(distribution);
  };

  // Update grading configuration
  const updateGradingScale = (grade, min) => {
    setGradingScale((prevScale) =>
      prevScale.map((item) => (item.grade === grade ? { ...item, min } : item))
    );
  };

  // Table columns
  const columns = [
    { title: 'Roll No', dataIndex: 'rollNo', key: 'rollNo' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Marks', dataIndex: 'marks', key: 'marks' },
    { title: 'Grade', dataIndex: 'grade', key: 'grade', render: text => text || 'Pending' },
  ];

  return (
    <div className="grader-container">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📊 Grade Management</Title>
        <Text type="secondary">
        Manage and generate student grades effortlessly.
        </Text>
      </header>  
      {/* Actions (Generate Grades, View Report, Configure Grading) */}
      <Card className="grader-actions">
        <Space size="middle">
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

      {/* Student Grades Table */}
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
          {gradingScale.map((item) => (
            <div key={item.grade} className="grade-config-row">
              <Text strong>{item.grade}:</Text>
              <InputNumber
                min={0}
                max={100}
                value={item.min}
                onChange={(value) => updateGradingScale(item.grade, value)}
              />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Tgrader;
