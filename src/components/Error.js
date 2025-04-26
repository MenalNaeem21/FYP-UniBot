import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Typography, List, Divider, message } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Error.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const Error = () => {
  const [faqItems, setFaqItems] = useState([]);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/all-faqs');
      setFaqItems(res.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      message.error('Failed to load FAQs');
    }
  };

  const onFinish = async (values) => {
    try {
      const token = localStorage.getItem('studentToken');
      const profileRes = await axios.get('http://localhost:5000/api/auth/studentprofile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const student = profileRes.data;

      await axios.post('http://localhost:5000/api/admin/submit-complaint', {
        email: student.email,
        errorTitle: values.title,
        errorDetail: values.description,
      });

      message.success('Complaint submitted successfully!');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      message.error('Failed to submit complaint.');
    }
  };

  return (
    <div className="error-container">
      <div className="error-layout">
        {/* Report Form */}
        <Card className="error-card">
          <Title level={3} className="error-title">Report an Issue</Title>
          <Form layout="vertical" onFinish={onFinish} className="error-form">
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
            pagination={{
              pageSize: 4,
              size: 'small',
              align: 'center',
              showSizeChanger: false,
            }}
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
