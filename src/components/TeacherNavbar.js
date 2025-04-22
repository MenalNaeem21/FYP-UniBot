// src/components/Navbar.js
import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'antd';
import { HomeOutlined, SolutionOutlined,CalendarOutlined, UserOutlined,ProductOutlined ,BarChartOutlined} from '@ant-design/icons';
import './TeacherNavbar.css';

const TeacherNavbar = ({ setAuthenticated, setAdminAuthenticated, setTeacherAuthenticated }) => {
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
        <Link to="/tprofile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
      <Menu.Item key="report">
        <Link to="/treport">Report</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar-container">
      <Menu mode="horizontal" theme="dark" className="navbar">
      <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/teacherhome">Home</Link>
        </Menu.Item>
        <Menu.Item key="marks" icon={<BarChartOutlined />}>
          <Link to="/tmarks">Marks</Link>
        </Menu.Item>
        <Menu.Item key="attendance" icon={<CalendarOutlined />}>
          <Link to="/tattendance">Attendance</Link>
        </Menu.Item>
        <Menu.Item key="grader" icon={<SolutionOutlined />}>
          <Link to="/tgrader">Grader</Link>
        </Menu.Item>
        <Menu.Item key="workflow" icon={<ProductOutlined />}>
          <Link to="/tworkflow">My Workflow</Link>
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

export default TeacherNavbar;
