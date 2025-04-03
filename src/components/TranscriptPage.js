import React from 'react';
import { Button,Card, Table, Typography, Tag } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import './TranscriptPage.css';

const { Title, Text } = Typography;

// Sample data for transcript
const transcriptData = [
  {
    semester: 'Fall 2023',
    gpa: 3.8,
    cgpa: 3.7,
    creditsEarned: 15,
    courses: [
      {
        code: 'CS101',
        name: 'Introduction to Programming',
        grade: 'A',
        credits: 3,
      },
      {
        code: 'MATH201',
        name: 'Calculus II',
        grade: 'A-',
        credits: 4,
      },
      {
        code: 'ENG101',
        name: 'English Composition',
        grade: 'B+',
        credits: 2,
      },
    ],
  },
  {
    semester: 'Spring 2024',
    gpa: 3.9,
    cgpa: 3.75,
    creditsEarned: 18,
    courses: [
      {
        code: 'CS202',
        name: 'Data Structures and Algorithm',
        grade: 'A',
        credits: 4,
      },
      {
        code: 'PHYS101',
        name: 'Physics I',
        grade: 'B',
        credits: 3,
      },
      {
        code: 'HIST101',
        name: 'World History',
        grade: 'A-',
        credits: 2,
      },
    ],
  },
];

const TranscriptPage = () => {
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
          case 'A':
            color = 'green';
            break;
          case 'A-':
            color = 'cyan';
            break;
          case 'B+':
            color = 'blue';
            break;
          case 'B':
            color = 'orange';
            break;
          default:
            color = 'red';
        }
        return <Tag color={color}>{grade}</Tag>;
      },
    },
    {
      title: 'Credits',
      dataIndex: 'credits',
      key: 'credits',
    },
  ];

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
              rowKey="code"
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
