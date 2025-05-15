import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, Typography, Button, Row, Col, Statistic, Avatar, List, Tag, message
} from 'antd';
import {
  BookOutlined, ScheduleOutlined, UserOutlined, CheckCircleOutlined, DashboardOutlined,
  FireOutlined, ExportOutlined, MessageOutlined, FileTextOutlined, ProfileOutlined,
  CalendarOutlined, ReadOutlined, FallOutlined
} from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import './HomePage.css';

const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [submittedCount, setSubmittedCount] = useState(0);
  const [missedCount, setMissedCount] = useState(0);
  const [deadlines, setDeadlines] = useState([]);
  const [lowestAttendanceCourse, setLowestAttendanceCourse] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('studentToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchStudentProfile(token);
    }
  }, []);

  const fetchStudentProfile = async (token) => {
    try {
      const res = await axios.get('http://localhost:5000/api/auth/studentprofile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const studentData = res.data;
      setStudent(studentData);
      fetchClasswork(studentData.rollNo);
      fetchAttendance(studentData.rollNo);
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch student profile.');
    }
  };

  const fetchClasswork = async (rollNo) => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/classwork/student', {
        params: { rollNo },
      });

      const enriched = res.data.map(task => ({
        ...task,
        dueDateFormatted: dayjs(task.dueDate).format('YYYY-MM-DD'),
        isSubmitted: task.submissions?.some(sub => sub.rollNo === rollNo),
      }));

      const now = dayjs();
      const pending = enriched.filter(task => !task.isSubmitted && now.isBefore(task.dueDate));
      const missed = enriched.filter(task => !task.isSubmitted && now.isAfter(task.dueDate));
      const submitted = enriched.filter(task => task.isSubmitted);

      setTasks(enriched);
      setPendingCount(pending.length);
      setMissedCount(missed.length);
      setSubmittedCount(submitted.length);
      setDeadlines(pending.slice(0, 3)); // show top 3 upcoming only
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch classwork.');
    }
  };

  const fetchAttendance = async (rollNo) => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/attendance/all');
      const allRecords = res.data;

      const courseMap = new Map();

      allRecords.forEach((record) => {
        record.students.forEach((studentRecord) => {
          if (studentRecord.rollNo === rollNo) {
            const key = `${record.courseId}-${record.section}`;
            if (!courseMap.has(key)) {
              courseMap.set(key, {
                courseId: record.courseId,
                courseName: record.courseName || 'N/A',
                section: record.section,
                records: [],
              });
            }
            courseMap.get(key).records.push({
              date: record.date,
              status: studentRecord.status,
              lectureTitle: record.lectureTitle,
            });
          }
        });
      });

      const attendanceList = Array.from(courseMap.values()).map((entry) => {
        const total = entry.records.length;
        const present = entry.records.filter((r) => r.status === 'P').length;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(2) : 0;
        return {
          courseId: entry.courseId,
          courseName: entry.courseName,
          percentage: Number(percentage),
        };
      });

      if (attendanceList.length > 0) {
        const lowest = attendanceList.reduce((min, curr) => (curr.percentage < min.percentage ? curr : min));
        setLowestAttendanceCourse(lowest);
      }
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch attendance.');
    }
  };

  return (
    <div className="student-home-container">
      {/* 🎓 Welcome */}
      <Card className="hero-banner" bordered={false}>
        <Row justify="space-between" align="middle">
          <Col span={16}>
            <Title level={1} className="hero-title">
              🎓 Welcome Back{student?.name ? `, ${student.name}` : ''}!
            </Title>
            <Text className="hero-subtitle">
              Your academic journey awaits – track your progress, manage tasks, and unlock your potential.
            </Text>
          </Col>
          <Col span={8} className="hero-avatar">
            <Avatar size={128} icon={<UserOutlined />} />
          </Col>
        </Row>
      </Card>

      {/* 📊 Stats */}
      <Card className="quick-stats-card" bordered={false}>
        <Row gutter={[16, 16]} justify="center" align="middle">
          <Col span={4}>
            <Statistic title="Current GPA" value={student?.gpas?.[0]?.gpa || 'N/A'} suffix="/4.0" />
          </Col>
          <Col span={4}>
            <Statistic title="Cumulative GPA" value={student?.cgpa || 'N/A'} suffix="/4.0" />
          </Col>
          <Col span={4}>
            <Statistic title="Registered Courses" value={student?.registeredCourses?.length || 0} prefix={<ReadOutlined />} />
          </Col>
          <Col span={4}>
            <Statistic title="Pending Tasks" value={pendingCount} prefix={<ScheduleOutlined />} />
          </Col>
          <Col span={4}>
            <Statistic
              title="Lowest Attendance"
              value={
                lowestAttendanceCourse
                  ? `${lowestAttendanceCourse.courseName} (${lowestAttendanceCourse.percentage}%)`
                  : 'None'
              }
              prefix={<FallOutlined />}
              valueStyle={{
                color: lowestAttendanceCourse?.percentage < 75 ? '#cf1322' : undefined,
              }}
            />
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} className="quick-nav" justify="space-between">
  <Col span={4}>
    <Card hoverable className="nav-card" onClick={() => navigate('/transcript')}>
      <FileTextOutlined className="nav-icon" />
      <Title level={5}>Transcript</Title>
      <Text>Check GPA, CGPA,credits earned and academic performance</Text>
    </Card>
  </Col>
  <Col span={4}>
    <Card hoverable className="nav-card" onClick={() => navigate('/workflow')}>
      <CalendarOutlined className="nav-icon" />
      <Title level={5}>Workflow</Title>
      <Text>Manage Workflows, access timetable and see attendance </Text>
    </Card>
  </Col>
  <Col span={4}>
    <Card hoverable className="nav-card" onClick={() => navigate('/registration')}>
      <BookOutlined className="nav-icon" />
      <Title level={5}>Register Courses</Title>
      <Text>Choose Subjects, access waitlist and register</Text>
    </Card>
  </Col>
  <Col span={4}>
    <Card hoverable className="nav-card" onClick={() => navigate('/marks')}>
      <CheckCircleOutlined className="nav-icon" />
      <Title level={5}>Marks</Title>
      <Text>Check in-depth marks for each course and analyze class average</Text>
    </Card>
  </Col>
  <Col span={4}>
    <Card hoverable className="nav-card" onClick={() => navigate('/profile')}>
      <ProfileOutlined className="nav-icon" />
      <Title level={5}>Profile</Title>
      <Text>Manage account details including personal info, academic info and other</Text>
    </Card>
  </Col>
</Row>

{/* 🔥 AI Recommendations */}
<Card className="ai-recommendations-card" bordered={false}>
  <Row justify="space-between" align="middle">
    <Col>
      <FireOutlined style={{ fontSize: '36px', color: '#fa541c' }} />
      <Title level={2}>AI Recommendations</Title>
      <Text>Insights tailored for your academic progress:</Text>
      <ul className="ai-list">

        {/* 📘 Suggested Course */}
        {student?.cgpa < 2.5 ? (
          <li>📘 Suggested Course: Communication & Soft Skills – improve team collaboration and confidence</li>
        ) : (
          <li>📘 Suggested Course: Data Visualization with Python – great for GPA builders</li>
        )}

        {/* ⚠️ Low Attendance */}
        {lowestAttendanceCourse && (
          <li>
            ⚠️ Attendance Alert: <strong>{lowestAttendanceCourse.courseName}</strong> is at{" "}
            <strong>{lowestAttendanceCourse.percentage}%</strong>. Attend next lectures to avoid short attendance!
          </li>
        )}

        {/* 📅 Pending this week */}
        {tasks.filter(task =>
          !task.isSubmitted &&
          dayjs(task.dueDate).isBefore(dayjs().add(7, 'day'))
        ).length > 0 && (
          <li>
            📅 You have{" "}
            <strong>
              {tasks.filter(task =>
                !task.isSubmitted &&
                dayjs(task.dueDate).isBefore(dayjs().add(7, 'day'))
              ).length}
            </strong>{" "}
            tasks due this week – stay ahead of deadlines!
          </li>
        )}

        {/* 💡 Motivation */}
        {submittedCount >= 4 && (
          <li>💡 Great job! You’ve submitted <strong>{submittedCount}</strong> tasks already. Keep the streak going! 🚀</li>
        )}

        {/* 🧠 Study Strategy (fun one) */}
        <li>🧠 Tip of the Day: Break your study into 25-min sprints. It's called the Pomodoro technique 🍅</li>
      </ul>
    </Col>
    <Button
      type="primary"
      icon={<ExportOutlined />}
      size="large"
      className="explore-insights-button"
      onClick={() => navigate('/workflow')}
    >
      Explore Insights
    </Button>
  </Row>
</Card>


      {/* 📅 Deadlines */}
      <Card className="deadlines-card" bordered={false}>
        <Title level={4}>📅 Upcoming Deadlines</Title>
        <List>
          {deadlines.length === 0 ? (
            <List.Item>No upcoming deadlines.</List.Item>
          ) : (
            deadlines.map((item, idx) => (
              <List.Item key={idx}>
                📝 {item.title} ({item.courseName}) - Due: <Tag color="orange">{item.dueDateFormatted}</Tag>
              </List.Item>
            ))
          )}
        </List>
      </Card>

      
    </div>
  );
};

export default HomePage;
