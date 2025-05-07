import React, { useState, useEffect } from 'react';
import { Card, Typography, Switch, Select, Button, message, Space } from 'antd';
import { SettingOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import './AdminControls.css';

const { Title, Text } = Typography;
const { Option } = Select;

const AdminControls = () => {
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [semester, setSemester] = useState('Fall');
  const [graderOpen, setGraderOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchControls();
  }, []);

  const fetchControls = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/controls');
      setRegistrationOpen(response.data.registrationOpen);
      setSemester(response.data.activeSemester);
      setGraderOpen(response.data.graderOpen);
    } catch (error) {
      console.error(error);
      message.error('Failed to fetch controls');
    }
  };

  const updateControls = async () => {
    try {
      setLoading(true);
      await axios.put('http://localhost:5000/api/controls', {
        registrationOpen,
        activeSemester: semester,
        graderOpen,
      });
      message.success('Controls updated successfully');
    } catch (error) {
      console.error(error);
      message.error('Failed to update controls');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="controls-container">
      {/* Registration Control Card */}
      <Card
        title={<Title level={3}><SettingOutlined /> Student Registration Controls</Title>}
        bordered
        style={{ maxWidth: 600, margin: 'auto', marginTop: 40 }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space size="large">
            <Text strong>Enable Registration:</Text>
            <Switch
              checked={registrationOpen}
              onChange={checked => setRegistrationOpen(checked)}
            />
          </Space>

          {registrationOpen && (
            <Space size="large">
              <Text strong>Select Semester:</Text>
              <Select
                value={semester}
                onChange={(value) => setSemester(value)}
                style={{ width: 150 }}
              >
                <Option value="Fall">Fall</Option>
                <Option value="Spring">Spring</Option>
                <Option value="Summer">Summer</Option>
              </Select>
            </Space>
          )}
        </Space>
      </Card>

      {/* Grader Control Card */}
      <Card
        title={<Title level={3}><EditOutlined /> Teacher Grader Controls</Title>}
        bordered
        style={{ maxWidth: 600, margin: 'auto', marginTop: 20 }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Space size="large">
            <Text strong>Enable Teacher Grading:</Text>
            <Switch
              checked={graderOpen}
              onChange={checked => setGraderOpen(checked)}
            />
          </Space>
        </Space>
      </Card>

      {/* Save Button */}
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <Button
          type="primary"
          onClick={updateControls}
          loading={loading}
          size="large"
          style={{ width: 200 }}
        >
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminControls;
