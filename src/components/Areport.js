import React, { useState, useEffect } from 'react';
import { Input, Button, Card, List, Collapse, Modal, Form, Typography, message } from 'antd';
import { CheckCircleOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Areport.css';

const { Search } = Input;
const { Panel } = Collapse;
const { Title, Text } = Typography;

const Areport = () => {
  const [issues, setIssues] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchComplaints();
    fetchFaqs();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/all-complaints');
      setIssues(res.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      message.error('Failed to load complaints');
    }
  };

  const fetchFaqs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/all-faqs');
      setFaqs(res.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      message.error('Failed to load FAQs');
    }
  };

  const handleSearchIssues = (value) => {
    if (!value) {
      fetchComplaints();
    } else {
      const filtered = issues.filter(issue => 
        issue.errorTitle.toLowerCase().includes(value.toLowerCase())
      );
      setIssues(filtered);
    }
  };

  const resolveComplaint = async (id) => {
    Modal.confirm({
      title: 'Mark this complaint as resolved and delete?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/admin/delete-complaint/${id}`);
          message.success('Complaint resolved and deleted');
          fetchComplaints();
        } catch (error) {
          console.error('Error resolving complaint:', error);
          message.error('Failed to resolve complaint');
        }
      }
    });
  };

  const handleFAQSubmit = async (values) => {
    try {
      if (editingFAQ) {
        await axios.put(`http://localhost:5000/api/admin/edit-faq/${editingFAQ._id}`, values);
        message.success('FAQ updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/admin/add-faq', values);
        message.success('FAQ added successfully');
      }
      fetchFaqs();
      setEditingFAQ(null);
      setShowFAQModal(false);
      form.resetFields();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      message.error('Failed to save FAQ');
    }
  };

  const editFAQ = (faq) => {
    setEditingFAQ(faq);
    form.setFieldsValue(faq);
    setShowFAQModal(true);
  };

  const deleteFAQ = async (id) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this FAQ?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:5000/api/admin/delete-faq/${id}`);
          message.success('FAQ deleted');
          fetchFaqs();
        } catch (error) {
          console.error('Error deleting FAQ:', error);
          message.error('Failed to delete FAQ');
        }
      }
    });
  };

  return (
    <div className="report-container">
      <header className="welcome-header">
        <Title level={2} className="welcome-title">🔍 Reported Issues</Title>
        <Text type="secondary">Access Complaints and FAQS section.</Text>
      </header>

      <Search
        placeholder="Search issues by title"
        onSearch={handleSearchIssues}
        style={{ marginTop: 20, marginBottom: 20 }}
        allowClear
      />

      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={issues}
        renderItem={(issue) => (
          <List.Item>
            <Card
              title={issue.errorTitle}
              extra={
                <div className="marks-buttons">
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => resolveComplaint(issue._id)}
                  >
                    Resolve
                  </Button>
                </div>
              }
            >
              <p><strong>Email:</strong> {issue.email}</p>
              <p>{issue.errorDetail}</p>
            </Card>
          </List.Item>
        )}
      />

      {/* FAQ Section */}
      <h2 className="section-title">📚 FAQ Management</h2>
      <div className="marks-buttons">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingFAQ(null);
            setShowFAQModal(true);
          }}
          style={{ marginBottom: 20 }}
        >
          Add FAQ
        </Button>
      </div>

      <Collapse>
        {faqs.map((faq) => (
          <Panel
            header={faq.question}
            key={faq._id}
            extra={
              <>
                <Button type="link" onClick={() => editFAQ(faq)}>
                  Edit
                </Button>
                <Button type="link" danger onClick={() => deleteFAQ(faq._id)}>
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
