import React from 'react';
import { Card, Form, Input, Button, Typography, List, Divider } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import './Error.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Error = () => {
  const onFinish = (values) => {
    console.log('Submitted Report:', values);
    // Add your API call here
  };

  const faqItems = [
    { question: 'How can I reset my password?', answer: 'You can reset your password from the profile page.' },
    { question: 'What should I do if I find incorrect data?', answer: 'Use this form to report incorrect data.' },
    { question: 'How long does it take to resolve a report?', answer: 'Reports are usually resolved within 3-5 business days.' },
  ];

  return (
    <div className="error-container">
      <div className="error-layout">
        {/* Report Form */}
        <Card className="error-card">
          <Title level={3} className="error-title">Report an Issue</Title>
          <Form
            layout="vertical"
            onFinish={onFinish}
            className="error-form"
          >
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: 'Please enter a title for the error.' }]}
            >
              <Input placeholder="Enter the error title" className="error-input" />
            </Form.Item>
            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please provide a detailed description.' }]}
            >
              <TextArea 
                rows={4} 
                placeholder="Provide a detailed description of the issue" 
                className="error-textarea"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="error-submit-button">
                Submit Report
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* FAQ Section */}
        <Card className="faq-card">
          <Title level={4} className="faq-title">Frequently Asked Questions</Title>
          <List
            itemLayout="vertical"
            dataSource={faqItems}
            renderItem={(item) => (
              <List.Item>
                <Paragraph strong>{item.question}</Paragraph>
                <Paragraph>{item.answer}</Paragraph>
              </List.Item>
            )}
          />
        </Card>

        {/* Contact Information */}
        <Card className="contact-card">
          <Title level={4} className="contact-title">Need More Help?</Title>
          <Paragraph>
            If you need further assistance, feel free to reach out to our support team:
          </Paragraph>
          <Paragraph>
            <strong>Email:</strong> support@university.edu
          </Paragraph>
          <Paragraph>
            <strong>Phone:</strong> +1 800 123 456
          </Paragraph>
        </Card>
      </div>

      {/* Chatbot Button */}
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

export default Error;
