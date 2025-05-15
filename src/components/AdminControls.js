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
      <header className="welcome-header">
        <Title level={2} className="welcome-title">⚙️ Admin Control Panel</Title>
        <Text type="secondary">Manage registration and grading settings here.</Text>
      </header>

      <div className="admin-controls-grid">
        <Card
          className="animated-card"
          title={<Title level={4}><SettingOutlined /> Student Registration</Title>}
          bordered={false}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Space>
              <Text strong>Enable Registration:</Text>
              <Switch
                checked={registrationOpen}
                onChange={checked => setRegistrationOpen(checked)}
              />
            </Space>

            {registrationOpen && (
              <Space>
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

        <Card
          className="animated-card"
          title={<Title level={4}><EditOutlined /> Teacher Grading</Title>}
          bordered={false}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Space>
              <Text strong>Enable Teacher Grading:</Text>
              <Switch
                checked={graderOpen}
                onChange={checked => setGraderOpen(checked)}
              />
            </Space>
          </Space>
        </Card>
      </div>

      <div className="marks-buttons">
        <Button
          type="primary"
          onClick={updateControls}
          loading={loading}
          size="large"
        >
          Save All Changes
        </Button>
      </div>
    </div>
  );
};

export default AdminControls;
