// src/components/TranscriptPage.js
import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Typography, Tag, message } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import axios from 'axios';
import './TranscriptPage.css';

const { Title, Text } = Typography;

const TranscriptPage = () => {
  const [transcriptData, setTranscriptData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTranscriptData();
  }, []);

  const fetchTranscriptData = async () => {
    try {
      const token = localStorage.getItem('studentToken');
      const profileRes = await axios.get('http://localhost:5000/api/auth/studentprofile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const student = profileRes.data;

      const gradesRes = await axios.get(`http://localhost:5000/api/admin/student-grades/${student.rollNo}`);
      const allGrades = gradesRes.data;

      const coursesRes = await axios.get('http://localhost:5000/api/courses');
      const allCourses = coursesRes.data;

      // Group by semester
      const semesterMap = new Map();

      allGrades.forEach((gradeRecord) => {
        const courseInfo = allCourses.find(course =>
          course.id === gradeRecord.courseId &&
          course.sections === gradeRecord.section
        );

        const semester = courseInfo?.semester || 'Unknown Semester';
        const creditHours = courseInfo?.creditHours || 3; // default 3 credit hours if missing

        if (!semesterMap.has(semester)) {
          semesterMap.set(semester, {
            semester,
            courses: [],
            totalCredits: 0,
            totalGradePoints: 0,
          });
        }

        const gradePoint = getGradePoint(gradeRecord.grade);
        const semesterEntry = semesterMap.get(semester);

        semesterEntry.courses.push({
          code: gradeRecord.courseId,
          name: gradeRecord.courseName,
          grade: gradeRecord.grade,
          gradeType: gradeRecord.gradeType || 'absolute',
          credits: creditHours,
        });

        semesterEntry.totalCredits += creditHours;
        semesterEntry.totalGradePoints += (gradePoint * creditHours);
      });

      const semestersArray = Array.from(semesterMap.values());

            // Calculate GPA, CGPA
      let totalGpaSum = 0;
      let semesterCount = semestersArray.length;

      semestersArray.forEach((sem) => {
        sem.gpa = sem.totalCredits > 0 ? (sem.totalGradePoints / sem.totalCredits).toFixed(2) : '0.00';
        totalGpaSum += parseFloat(sem.gpa);  // sum up all GPA values
        sem.creditsEarned = sem.totalCredits;
      });

      // After all semesters processed
      const finalCgpa = semesterCount > 0 ? (totalGpaSum / semesterCount).toFixed(2) : '0.00';

      // Update CGPA inside each semester (optional if you want to show per card)
      semestersArray.forEach((sem) => {
        sem.cgpa = finalCgpa;
      });

      setTranscriptData(semestersArray);

      // 🔥 Save GPA and CGPA back to student profile
      await axios.put(`http://localhost:5000/api/admin/update-student-gpa/${student.rollNo}`, {
        cgpa: finalCgpa,
        gpas: semestersArray.map(s => ({
          semester: s.semester,
          gpa: s.gpa,
        })),
      });


    } catch (error) {
      console.error('Error loading transcript data:', error);
      message.error('Failed to load transcript data.');
    } finally {
      setLoading(false);
    }
  };

  const getGradePoint = (grade) => {
    const gradeMap = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.67,
      'B+': 3.33, 'B': 3.0, 'B-': 2.67,
      'C+': 2.33, 'C': 2.0, 'C-': 1.67,
      'D+': 1.33, 'D': 1.0, 'F': 0.0,
    };
    return gradeMap[grade] ?? 0.0;
  };

  const courseColumns = [
    {
      title: 'Course Code',
      dataIndex: 'code',
      key: 'code',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Course Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Grade',
      dataIndex: 'grade',
      key: 'grade',
      render: (grade) => {
        let color = '';
        switch (grade) {
          case 'A': color = 'green'; break;
          case 'A-': color = 'cyan'; break;
          case 'B+': color = 'blue'; break;
          case 'B': color = 'orange'; break;
          default: color = 'red';
        }
        return <Tag color={color}>{grade}</Tag>;
      },
    },
    {
      title: 'Grade Type',
      dataIndex: 'gradeType',
      key: 'gradeType',
      render: (type) => <Tag color={type === 'absolute' ? 'purple' : 'volcano'}>{type}</Tag>,
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
    },
  ];

  if (loading) return <div>Loading transcript...</div>;

  return (
    <div className="transcript-page">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📑 Academic Transcript</Title>
        <Text type="secondary">
          Review your academic progress across semesters.
        </Text>
      </header>

      <main className="transcript-content">
        {transcriptData.map((semester) => (
          <Card
            key={semester.semester}
            title={
              <div className="semester-header">
                <Text strong>{semester.semester}</Text>
                <div className="semester-stats">
                  <Tag color="blue">GPA: {semester.gpa}</Tag>
                  <Tag color="green">CGPA: {semester.cgpa}</Tag>
                  <Tag color="purple">Credits: {semester.creditsEarned}</Tag>
                </div>
              </div>
            }
            className="semester-card"
          >
            <Table
              dataSource={semester.courses}
              columns={courseColumns}
              rowKey={(record) => record.code + record.name}
              pagination={false}
            />
          </Card>
        ))}
      </main>

      <Button
        type="primary"
        shape="circle"
        icon={<MessageOutlined />}
        className="chatbot-button"
        onClick={() => console.log('Chatbot opened!')}
      />
    </div>
  );
};

export default TranscriptPage;
