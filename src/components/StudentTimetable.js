import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Select, Button, message, Typography, Space, Tooltip } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import './StudentTimetable.css';

const { Option } = Select;
const { Title, Text } = Typography;

const StudentTimetable = () => {
  const [courseOptions, setCourseOptions] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [timetableData, setTimetableData] = useState([]);
  const [days, setDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await axios.get('/api/timetable/course-options');
        setCourseOptions(res.data);
      } catch (err) {
        message.error('Failed to load course options');
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  const handleChange = (value) => {
    if (value.length > 5) {
      message.warning('You can select up to 5 courses only');
      return;
    }
    setSelectedCourses(value);
  };

  const handleSubmit = async () => {
    const payload = selectedCourses.map(str => {
      const [courseName, section] = str.split('||');
      return { courseName, section };
    });

    try {
      const res = await axios.post('/api/timetable/student-view', {
        selectedCourses: payload
      });

      const data = res.data.timetable || [];
      setTimetableData(data);

      const uniqueDays = [...new Set(data.map(item => item.Day))];
      const uniqueTimes = [...new Set(data.map(item => extractStartTime(item.Time)))];

      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const sortedDays = uniqueDays.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
      setDays(sortedDays);

      setTimeSlots(uniqueTimes.sort((a, b) => convertTo24Hour(a) - convertTo24Hour(b)));
    } catch (err) {
      console.error(err);
      message.error('Failed to fetch timetable');
    }
  };

  const handleDownload = async () => {
    try {
      const res = await axios.post('/api/timetable/student-view/export', {
        timetable: timetableData
      }, { responseType: 'blob' });

      const blob = new Blob([res.data], { type: res.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'StudentTimetable.xlsx';
      a.click();
    } catch (err) {
      console.error(err);
      message.error('Download failed');
    }
  };

  const extractStartTime = (timeStr) => timeStr?.split('-')[0]?.trim();

  const convertTo24Hour = (timeStr) => {
    const [time, meridian] = timeStr.split(' ');
    let [hour, minute] = time.split(':').map(Number);
    if (meridian === 'PM' && hour !== 12) hour += 12;
    if (meridian === 'AM' && hour === 12) hour = 0;
    return hour * 60 + minute;
  };

  const getSlotKey = (day, time) => `${day}_${time}`;

  // Detect multiple courses in same time slot
  const gridMap = {};
  timetableData.forEach(entry => {
    const slot = getSlotKey(entry.Day, extractStartTime(entry.Time));
    if (!gridMap[slot]) {
      gridMap[slot] = [];
    }
    gridMap[slot].push(entry);
  });

  return (
    <div className="course-management-container">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">📚 My TimeTable</Title>
        <Text type="secondary">View and manage your TimeTable accordingly.</Text>
      </header>

      <Space direction="vertical" style={{ width: '100%' }}>
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Select up to 5 courses"
          onChange={handleChange}
          value={selectedCourses}
        >
          {courseOptions.map((course, index) => (
            <Option key={`${course.courseName}||${course.section}`}>
              {course.courseName} - {course.section}
            </Option>
          ))}
        </Select>
        <div className="marks-buttons">
        <Button type="primary" onClick={handleSubmit}>
          Generate Timetable
        </Button>
        </div>
      </Space>

      {timetableData.length > 0 && (
        <>
          <div className="timetable-grid">
            <div className="grid-header">
              <div className="grid-cell header-cell" />
              {days.map(day => (
                <div key={day} className="grid-cell header-cell">{day}</div>
              ))}
            </div>

            {timeSlots.map(time => (
              <div key={time} className="grid-row">
                <div className="grid-cell time-cell">{time}</div>
                {days.map(day => {
                  const slotKey = getSlotKey(day, time);
                  const entries = gridMap[slotKey] || [];

                  const isClash = entries.length > 1;
                  const className = isClash
                    ? 'grid-cell course-cell clash'
                    : entries.length === 1
                    ? 'grid-cell course-cell filled'
                    : 'grid-cell course-cell';

                  return (
                    <div key={slotKey} className={className}>
                      {entries.length > 0 && (
                        <Tooltip
                          title={entries.map(e => `${e['Course Name']} (${e.Section}) | ${e.Room}`).join(' | ')}
                        >
                          <div className="course-block">
                            {entries.map((e, i) => (
                              <div key={i} className="course-name">{e['Course Name']}</div>
                            ))}
                          </div>
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <Button
            type="default"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            style={{ marginTop: 24 }}
          >
            Download Excel
          </Button>
        </>
      )}
    </div>
  );
};

export default StudentTimetable;
