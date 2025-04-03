// src/components/AdminReport.js

import React, { useState } from 'react';
import { Input, Button, Card, List, Collapse, Modal, Form,Typography } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import './Areport.css';

const { Search } = Input;
const { Panel } = Collapse;
const { Title, Text } = Typography;
const Areport = () => {
  const [issues, setIssues] = useState([
    { id: 1, title: 'Login Error', description: 'Unable to log in with valid credentials.', resolved: false },
    { id: 2, title: 'Page Crash', description: 'Profile page crashes on load.', resolved: true },
    { id: 3, title: 'Slow Performance', description: 'Dashboard takes too long to load.', resolved: false },
    { id: 4, title: 'Broken Link', description: 'The "Help" link in the footer is not working.', resolved: true },
  ]);
  
  const [faqs, setFaqs] = useState([
    { id: 1, question: 'How to reset password?', answer: 'Click on "Forgot Password" on the login page.' },
    { id: 2, question: 'Where to find reports?', answer: 'Navigate to the "Reports" section from the dashboard.' },
    { id: 3, question: 'How to contact support?', answer: 'Use the "Contact Us" form in the footer or email support@example.com.' },
    { id: 4, question: 'Can I export data?', answer: 'Yes, use the "Export" button in the top-right corner of the relevant page.' },
  ]);



  const [showFAQModal, setShowFAQModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);

  const [form] = Form.useForm();

  // Search Issues
  const handleSearchIssues = (value) => {
    // Implement search logic
    console.log('Search:', value);
  };

  // Toggle Resolved Status
  const toggleResolved = (id) => {
    setIssues((prev) =>
      prev.map((issue) => (issue.id === id ? { ...issue, resolved: !issue.resolved } : issue))
    );
  };

  // Delete Issue
  const deleteIssue = (id) => {
    setIssues((prev) => prev.filter((issue) => issue.id !== id));
  };

  // Add or Edit FAQ
  const handleFAQSubmit = (values) => {
    if (editingFAQ) {
      setFaqs((prev) =>
        prev.map((faq) => (faq.id === editingFAQ.id ? { ...faq, ...values } : faq))
      );
      setEditingFAQ(null);
    } else {
      setFaqs((prev) => [...prev, { id: Date.now(), ...values }]);
    }
    setShowFAQModal(false);
    form.resetFields();
  };

  // Edit FAQ
  const editFAQ = (faq) => {
    setEditingFAQ(faq);
    form.setFieldsValue(faq);
    setShowFAQModal(true);
  };

  return (
    <div className="report-container">
      {/* Section: Issues */}
      <header className="welcome-header">
        <Title level={2} className="welcome-title">🔍 Reported Issues</Title>
        <Text type="secondary" >
        Access Complaints and FAQS section.
        </Text>
      </header>
      <Search
        placeholder="Search issues by title"
        onSearch={handleSearchIssues}
        style={{ marginTop: 20,marginBottom: 20 }}
        allowClear
      />
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={issues}
        renderItem={(issue) => (
          <List.Item>
            <Card
              title={issue.title}
              extra={
                <div>
                  <div className="marks-buttons">
                  <Button
                    type={issue.resolved ? 'default' : 'primary'}
                    icon={<CheckCircleOutlined />}
                    onClick={() => toggleResolved(issue.id)}
                  >
                    {issue.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                  </Button>
                  </div>
                  <Button
                    type="danger"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteIssue(issue.id)}
                    style={{ marginLeft: 8 }}
                  />
                </div>
              }
            >
              <p>{issue.description}</p>
            </Card>
          </List.Item>
        )}
      />

      {/* Section: FAQ */}
      <h2 className="section-title">📚 FAQ Management</h2>
      <div className="marks-buttons">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setShowFAQModal(true)}
        style={{ marginBottom: 20 }}
      >
        Add FAQ
      </Button>
      </div>
      <Collapse>
        {faqs.map((faq) => (
          <Panel
            header={faq.question}
            key={faq.id}
            extra={
              <>
                <Button type="link" onClick={() => editFAQ(faq)}>
                  Edit
                </Button>
                <Button
                  type="link"
                  danger
                  onClick={() => setFaqs((prev) => prev.filter((item) => item.id !== faq.id))}
                >
                  Delete
                </Button>
              </>
            }
          >
            <p>{faq.answer}</p>
          </Panel>
        ))}
      </Collapse>

      {/* FAQ Modal */}
      <Modal
        title={editingFAQ ? 'Edit FAQ' : 'Add FAQ'}
        open={showFAQModal}
        onCancel={() => setShowFAQModal(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleFAQSubmit}>
          <Form.Item name="question" label="Question" rules={[{ required: true }]}>
            <Input placeholder="Enter FAQ question" />
          </Form.Item>
          <Form.Item name="answer" label="Answer" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Enter FAQ answer" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Areport;
