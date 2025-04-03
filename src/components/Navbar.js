import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'antd';
import { HomeOutlined, FileTextOutlined, CalendarOutlined, BookOutlined, UserOutlined, ProductOutlined, BarChartOutlined } from '@ant-design/icons';
import './Navbar.css';

const Navbar = ({ setAuthenticated, setAdminAuthenticated, setTeacherAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuthenticated(false);
    setAdminAuthenticated(false);
    setTeacherAuthenticated(false);
    navigate('/'); // Redirect to login page
  };

  const profileMenu = (
    <Menu>
      <Menu.Item key="profile">
        <Link to="/profile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
      <Menu.Item key="report">
        <Link to="/report">Report</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar-container">
      <Menu mode="horizontal" theme="dark" className="navbar">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/home">Home</Link>
        </Menu.Item>
        <Menu.Item key="transcript" icon={<FileTextOutlined />}>
          <Link to="/transcript">Transcript</Link>
        </Menu.Item>
        <Menu.Item key="register-courses" icon={<BookOutlined />}>
          <Link to="/registration">Register Courses</Link>
        </Menu.Item>
        <Menu.Item key="todo" icon={<ProductOutlined />}>
          <Link to="/workflow">My Workflow</Link>
        </Menu.Item>
        <Menu.Item key="marks" icon={<BarChartOutlined />}>
          <Link to="/marks">Marks</Link>
        </Menu.Item>
        <Menu.Item key="profile" className="profile-menu" style={{ marginLeft: 'auto' }}>
          <Dropdown overlay={profileMenu} trigger={['click']} placement="bottomRight">
            <Button type="link" icon={<UserOutlined />} style={{ color: 'white' }}>
              Profile
            </Button>
          </Dropdown>
        </Menu.Item>
      </Menu>
    </div>
  );
};

export default Navbar;
