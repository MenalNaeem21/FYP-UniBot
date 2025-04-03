import React, { useState } from 'react';
import { Card, Typography, Button, Table, Modal, Statistic } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import './Marks.css';

const { Title, Text } = Typography;

const Marks = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const courses = [
    {
      key: '1',
      course: 'CS101 - Intro to Programming',
      instructor: 'Dr. John Doe',
      quizzes: [
        { name: 'Quiz 1', marks: 8, weightage: '10%' },
        { name: 'Quiz 2', marks: 7, weightage: '10%' },
      ],
      assignments: [
        { name: 'Assignment 1', marks: 15, weightage: '15%' },
      ],
      mid: { name: 'Midterm Exam', marks: 35, weightage: '30%' },
      final: { name: 'Final Exam', marks: 50, weightage: '45%' },
      GrandTotal: {name:'Grand Total',marks: 66,weightage: ''},
    },
    {
      key: '2',
      course: 'MATH201 - Calculus II',
      instructor: 'Prof. Jane Smith',
      quizzes: [
        { name: 'Quiz 1', marks: 9, weightage: '10%' },
        { name: 'Quiz 2', marks: 8, weightage: '10%' },
      ],
      assignments: [
        { name: 'Assignment 1', marks: 18, weightage: '15%' },
      ],
      mid: { name: 'Midterm Exam', marks: 40, weightage: '30%' },
      final: { name: 'Final Exam', marks: 55, weightage: '45%' },
      GrandTotal: {name:'Grand Total',marks: 88,weightage: ''},
    },
  ];

  const showCategoryMarks = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const getCategoryMarks = (course) => {
    if (!selectedCategory) return [];
    return course[selectedCategory] instanceof Array
      ? course[selectedCategory]
      : [course[selectedCategory]];
  };

  const getTotalMarks = (course) => {
    const data = getCategoryMarks(course);
    const totalMarks = data.reduce((sum, item) => sum + item.marks, 0);
    return totalMarks;
  };

  const getClassAverage = (course) => {
    const data = getCategoryMarks(course);
    const totalMarks = data.reduce((sum, item) => sum + item.marks, 0);
    const average = totalMarks / data.length;
    return average;
  };

  const renderCategoryTable = () => {
    const selectedCourse = courses[0]; // Show marks for the first course for simplicity
    const data = getCategoryMarks(selectedCourse);

    return (
      <Table
        dataSource={data}
        columns={[
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Marks', dataIndex: 'marks', key: 'marks' },
          { title: 'Weightage', dataIndex: 'weightage', key: 'weightage' },
        ]}
        pagination={false}
        rowKey="name"
      />
    );
  };

  return (
    <div className="marks-page">
      {/* Header */}
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📑 Semester Marks Overview</Title>
        <Text type="secondary">
          Review your marks for each course.
        </Text>
      </header>
      
      
      {/* Marks Table */}
      <main className="marks-content">
        {courses.map((course) => (
          <Card key={course.key} className="marks-card">
            <Title level={4} className="course-title">{course.course}</Title>
            <Text type="secondary">Instructor: {course.instructor}</Text>
            <div className="marks-buttons">
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => showCategoryMarks('quizzes')}
              >
                Quizzes
              </Button>
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => showCategoryMarks('assignments')}
              >
                Assignments
              </Button>
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => showCategoryMarks('mid')}
              >
                Midterm
              </Button>
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => showCategoryMarks('final')}
              >
                Final Exam
              </Button>
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={() => showCategoryMarks('GrandTotal')}
              >
                Grand Total
              </Button>
            </div>

            {/* Total Marks and Class Average */}
            {selectedCategory && (
              <div className="marks-summary">
                <Statistic
                  title="Total Marks"
                  value={getTotalMarks(course)}
                  suffix="/ 100"
                />
                <Statistic
                  title="Class Average"
                  value={getClassAverage(course)}
                  precision={2}
                  suffix=" %"
                />
              </div>
            )}
          </Card>
        ))}
      </main>

      {/* Modal for Category Marks */}
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
