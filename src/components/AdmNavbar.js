// src/components/Navbar.js
import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Button } from 'antd';
import { HomeOutlined, FileTextOutlined, CalendarOutlined, BookOutlined, UserOutlined,ProductOutlined ,BarChartOutlined,LineChartOutlined} from '@ant-design/icons';
import './AdmNavbar.css';

const AdmNavbar = ({ setAuthenticated, setAdminAuthenticated, setTeacherAuthenticated }) => {
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
        <Link to="/aprofile">Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="navbar-container">
      <Menu mode="horizontal" theme="dark" className="navbar">
        <Menu.Item key="home" icon={<HomeOutlined />}>
          <Link to="/admhome">Home</Link>
        </Menu.Item>
        <Menu.Item key="teacher" icon={<FileTextOutlined />}>
          <Link to="/ateacher">Teacher</Link>
        </Menu.Item>
        <Menu.Item key="student" icon={<BookOutlined />}>
          <Link to="/astudent">Student</Link>
        </Menu.Item>
        <Menu.Item key="report" icon={<LineChartOutlined />}>
          <Link to="/areport">Reports</Link>
        </Menu.Item>
        <Menu.Item key="registration" icon={<BarChartOutlined />}>
          <Link to="/aregistration">Registration</Link>
        </Menu.Item>
        <Menu.Item key="workflow" icon={<ProductOutlined />}>
          <Link to="/aworkflow">My Workflow</Link>
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

export default AdmNavbar;
