import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import TranscriptPage from './components/TranscriptPage';
import Regcourse from './components/Regcourse';
import Navbar from './components/Navbar';
import LoginLandingPage from './components/LoginLandingPage';
import Marks from './components/Marks';
import Error from './components/Error';
import Profile from './components/Profile';
import Todo from './components/Todo';
import Sattendance from './components/Sattendance';
import AdminLoginPage from './components/AdminLoginPage';
import AdmNavbar from './components/AdmNavbar';
import AdmHomePage from './components/AdmHomePage';
import Astudent from './components/Astudent';
import Ateacher from './components/Ateacher';
import Areport from './components/Areport';
import Aregistration from './components/Aregistration';
import Astenrolled from './components/Astenrolled';
import Aprofile from './components/Aprofile';
import Aworkflow from './components/Aworkflow';
import TeacherLoginPage from './components/TeacherLoginPage';
import TeacherHomePage from './components/TeacherHomePage';
import TeacherNavbar from './components/TeacherNavbar';
import Tworkflow from './components/Tworkflow';
import Tattendance from './components/Tattendance';
import Tmarks from './components/Tmarks';
import Tprofile from './components/Tprofile';
import Treport from './components/Treport';
import Tgrader from './components/Tgrader';
import ChatBot from './components/ChatBot';
const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [teacherAuthenticated, setTeacherAuthenticated] = useState(false);
  const token = localStorage.getItem("token");
let user = null;
let role = "guest";

if (token) {
  const decoded = JSON.parse(atob(token.split('.')[1])); // Simple JWT decode
  user = decoded.name;
  role = decoded.role;
}


  

  return (
    
    <Router>
      {/* Render Navbar based on authentication type */}
      {authenticated && <Navbar 
          setAuthenticated={setAuthenticated} 
          setAdminAuthenticated={setAdminAuthenticated} 
          setTeacherAuthenticated={setTeacherAuthenticated} 
      />}
      {adminAuthenticated && <AdmNavbar 
          setAuthenticated={setAuthenticated} 
          setAdminAuthenticated={setAdminAuthenticated} 
          setTeacherAuthenticated={setTeacherAuthenticated} 
      />}
      {teacherAuthenticated && <TeacherNavbar 
          setAuthenticated={setAuthenticated} 
          setAdminAuthenticated={setAdminAuthenticated} 
          setTeacherAuthenticated={setTeacherAuthenticated} 
      />}
      <ChatBot></ChatBot>

     

      <Routes>
        <Route path="/" element={<LoginLandingPage />} />
        <Route path="/login" element={<LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/adminlogin" element={<AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/teacherlogin" element={<TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />

        <Route path="/home" element={authenticated ? <HomePage /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/transcript" element={authenticated ? <TranscriptPage /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/registration" element={authenticated ? <Regcourse /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/profile" element={authenticated ? <Profile /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/report" element={authenticated ? <Error /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/workflow" element={authenticated ? <Todo /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/marks" element={authenticated ? <Marks /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/attendance" element={authenticated ? <Sattendance /> : <LoginPage setAuthenticated={setAuthenticated} />} />

        <Route path="/admhome" element={adminAuthenticated ? <AdmHomePage /> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/astudent" element={adminAuthenticated ? <Astudent /> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/ateacher" element={adminAuthenticated ? <Ateacher/> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/areport" element={adminAuthenticated ? <Areport /> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/aregistration" element={adminAuthenticated ? <Aregistration /> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/aprofile" element={adminAuthenticated ? <Aprofile /> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/aworkflow" element={adminAuthenticated ? <Aworkflow /> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/Astenrolled" element={adminAuthenticated ? <Astenrolled /> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />

        <Route path="/teacherhome" element={teacherAuthenticated ? <TeacherHomePage /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="/tworkflow" element={teacherAuthenticated ? <Tworkflow /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="/tattendance" element={teacherAuthenticated ? <Tattendance /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="/tmarks" element={teacherAuthenticated ? <Tmarks /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="/tprofile" element={teacherAuthenticated ? <Tprofile /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="/treport" element={teacherAuthenticated ? <Treport /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="/tgrader" element={teacherAuthenticated ? <Tgrader /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="*" element={<Error />} />
      </Routes>

    </Router>
  );
};

export default App;