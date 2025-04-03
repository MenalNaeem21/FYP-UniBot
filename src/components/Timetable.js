import React from 'react';
import { Button, Table, Card, Typography } from 'antd';
import { MessageOutlined } from '@ant-design/icons';
import './Timetable.css';



const Timetable = () => (
  <div className="tt-container">
    <Button 
      type="primary" 
      shape="circle" 
      icon={<MessageOutlined />} 
      className="chatbot-button" 
      onClick={() => console.log('Chatbot opened!')}
    />
  </div>
);

export default Timetable;
