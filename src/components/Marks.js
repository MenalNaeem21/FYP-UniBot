// src/components/Marks.js
import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Table, Modal, message } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Marks.css';

const { Title, Text } = Typography;

const Marks = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentGrades, setStudentGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentMarks();
  }, []);

  const fetchStudentMarks = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const profileRes = await axios.get('http://localhost:5000/api/auth/studentprofile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const student = profileRes.data;

      const marksRes = await axios.get('http://localhost:5000/api/admin/marks/all');
      const allMarks = marksRes.data;

      const gradesRes = await axios.get(`http://localhost:5000/api/admin/student-grades/${student.rollNo}`);
      const grades = gradesRes.data;
      setStudentGrades(grades);
  
      const courseMap = new Map();
  
      allMarks.forEach((record) => {
        record.students.forEach((studentRecord) => {
          if (studentRecord.rollNo === student.rollNo) {
            const key = `${record.courseId}-${record.section}`;
            if (!courseMap.has(key)) {
              const matchedGrade = grades.find(
                (g) => g.courseId === record.courseId && g.section === record.section
              );
  
              courseMap.set(key, {
                key,
                courseId: record.courseId,
                courseName: matchedGrade ? matchedGrade.courseName : 'N/A',
                section: record.section,
                instructor: record.instructor?.name || 'N/A',
                quizzes: [],
                assignments: [],
                mid: null,
                sessional2: null,
                project: null,
                final: null,
                weightages: {
                  quizzes: 0,
                  assignments: 0,
                  others: 0,
                }
              });
            }
            const courseEntry = courseMap.get(key);

            if (record.type === 'Quiz') {
              courseEntry.quizzes.push({
                name: record.specificType,
                marks: studentRecord.marks,
                totalMarks: record.totalMarks,
                weightage: `${record.weightage}%`,
              });
              courseEntry.weightages.quizzes = Number(record.weightage);  // Only first quiz weightage taken
            } else if (record.type === 'Assignment') {
              courseEntry.assignments.push({
                name: record.specificType,
                marks: studentRecord.marks,
                totalMarks: record.totalMarks,
                weightage: `${record.weightage}%`,
              });
              courseEntry.weightages.assignments = Number(record.weightage);  // Only first assignment weightage taken
            } else if (record.type === 'Sessional 1') {
              courseEntry.mid = {
                name: record.type,
                marks: studentRecord.marks,
                totalMarks: record.totalMarks,
                weightage: `${record.weightage}%`,
              };
              courseEntry.weightages.others += Number(record.weightage);
            } else if (record.type === 'Sessional 2') {
              courseEntry.sessional2 = {
                name: record.type,
                marks: studentRecord.marks,
                totalMarks: record.totalMarks,
                weightage: `${record.weightage}%`,
              };
              courseEntry.weightages.others += Number(record.weightage);
            } else if (record.type === 'Project') {
              courseEntry.project = {
                name: record.type,
                marks: studentRecord.marks,
                totalMarks: record.totalMarks,
                weightage: `${record.weightage}%`,
              };
              courseEntry.weightages.others += Number(record.weightage);
            } else if (record.type === 'Final') {
              courseEntry.final = {
                name: record.type,
                marks: studentRecord.marks,
                totalMarks: record.totalMarks,
                weightage: `${record.weightage}%`,
              };
              courseEntry.weightages.others += Number(record.weightage);
            }
          }
        });
      });

      setCourses(Array.from(courseMap.values()));
    } catch (error) {
      console.error('Error fetching student marks:', error);
      message.error('Failed to load marks');
    } finally {
      setLoading(false);
    }
  };

  const showCategoryMarks = (course, category) => {
    setSelectedCourse(course);
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const getCategoryMarks = () => {
    if (!selectedCourse || !selectedCategory) return [];

    if (selectedCategory === 'quizzes') return selectedCourse.quizzes;
    if (selectedCategory === 'assignments') return selectedCourse.assignments;
    if (selectedCategory === 'mid') return selectedCourse.mid ? [selectedCourse.mid] : [];
    if (selectedCategory === 'sessional2') return selectedCourse.sessional2 ? [selectedCourse.sessional2] : [];
    if (selectedCategory === 'project') return selectedCourse.project ? [selectedCourse.project] : [];
    if (selectedCategory === 'final') return selectedCourse.final ? [selectedCourse.final] : [];

    if (selectedCategory === 'GrandTotal') {
      const matched = studentGrades.find(g =>
        g.courseId === selectedCourse.courseId && g.section === selectedCourse.section
      );
      const courseTotalWeightage =
        selectedCourse.weightages.quizzes +
        selectedCourse.weightages.assignments +
        selectedCourse.weightages.others;
      
      return matched ? [{
        name: 'Grand Total',
        marks: matched.weightedScore,
        totalMarks: courseTotalWeightage,
        weightage: '100%'
      }] : [];
    }

    return [];
  };

  const renderCategoryTable = () => {
    const data = getCategoryMarks();
    if (!selectedCourse) return null; 
    return (
      <Table
        dataSource={data}
        columns={[
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Obtained Marks', dataIndex: 'marks', key: 'marks' },
          { title: 'Total Marks', dataIndex: 'totalMarks', key: 'totalMarks' },
          { title: 'Weightage', dataIndex: 'weightage', key: 'weightage' },
        ]}
        pagination={false}
        rowKey="name"
      />
    );
  };

  if (loading) return <div>Loading marks...</div>;

  return (
    <div className="marks-page">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📑 Semester Marks Overview</Title>
        <Text type="secondary">
          Review your marks for each course.
        </Text>
      </header>

      <main className="marks-content">
        {courses.map((course) => (
          <Card key={course.key} className="marks-card">
            <Title level={4} className="course-title">
              {course.courseId} ({course.section}) — {course.courseName}
            </Title>
            <Text type="secondary">Instructor: {course.instructor}</Text>

            <div className="marks-buttons">
              <Button type="primary" icon={<FileTextOutlined />} onClick={() => showCategoryMarks(course, 'quizzes')}>Quizzes</Button>
              <Button type="primary" icon={<FileTextOutlined />} onClick={() => showCategoryMarks(course, 'assignments')}>Assignments</Button>
              <Button type="primary" icon={<FileTextOutlined />} onClick={() => showCategoryMarks(course, 'mid')}>Sessional 1</Button>
              <Button type="primary" icon={<FileTextOutlined />} onClick={() => showCategoryMarks(course, 'sessional2')}>Sessional 2</Button>
              <Button type="primary" icon={<FileTextOutlined />} onClick={() => showCategoryMarks(course, 'project')}>Project</Button>
              <Button type="primary" icon={<FileTextOutlined />} onClick={() => showCategoryMarks(course, 'final')}>Final Exam</Button>
              <Button type="primary" icon={<FileTextOutlined />} onClick={() => showCategoryMarks(course, 'GrandTotal')}>Grand Total</Button>
            </div>
          </Card>
        ))}
      </main>

      <Modal
        title={`Marks Details — ${selectedCategory?.toUpperCase()}`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {renderCategoryTable()}
      </Modal>
    </div>
  );
};

export default Marks;
