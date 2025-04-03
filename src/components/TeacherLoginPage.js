// src/components/LoginPage.js
import React from 'react';
import { Button, Checkbox, Form, Input, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import './TeacherLoginPage.css';

const { Title } = Typography;

const TeacherLoginPage = ({ setTeacherAuthenticated }) => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Success:', values);
    // Simple authentication check
    if (values.username === 'admin' && values.password === 'password') {
      setTeacherAuthenticated(true);
      navigate('/teacherhome');
    } else {
      alert('Invalid credentials');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <Title level={2} className="login-title">Welcome Back</Title>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="loggin-button">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TeacherLoginPage;
