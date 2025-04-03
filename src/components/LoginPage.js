import React, { useState } from 'react';
import { Button, Checkbox, Form, Input, Typography, Card, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { MailOutlined } from '@ant-design/icons';
import './LoginPage.css';

const { Title, Text } = Typography;

const LoginPage = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);

  const onFinish = (values) => {
    console.log('Success:', values);
    // Simple authentication check
    if (values.username === 'admin' && values.password === 'password') {
      setAuthenticated(true);
      navigate('/home');
    } else {
      alert('Invalid credentials');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordVisible(true);
  };

  const handleCloseModal = () => {
    setIsForgotPasswordVisible(false);
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <Title level={2} className="login-title">Welcome Back</Title>
        <Text className="login-subtitle">Sign in to continue</Text>
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

          <div className="login-options">
            <Checkbox>Remember me</Checkbox>
            <Button type="link" className="forgot-password" onClick={handleForgotPassword}>
              Forgot Password?
            </Button>
          </div>

          <Form.Item>
            <Button type="primary" htmlType="submit" block className="loginn-button">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* Forgot Password Modal */}
      <Modal
        title="Forgot Password"
        visible={isForgotPasswordVisible}
        onCancel={handleCloseModal}
        footer={[
          <Button key="close" onClick={handleCloseModal}>
            Close
          </Button>
        ]}
      >
        <p>If you have forgotten your password, please contact support:</p>
        <Text>
          <MailOutlined />{' '}
          <a href="mailto:support@example.com">support@example.com</a>
        </Text>
      </Modal>
    </div>
  );
};

export default LoginPage;
