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
import AdminLoginPage from './components/AdminLoginPage';
import AdmNavbar from './components/AdmNavbar';
import AdmHomePage from './components/AdmHomePage';
import Astudent from './components/Astudent';
import Ateacher from './components/Ateacher';
import Areport from './components/Areport';
import Aregistration from './components/Aregistration';
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

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [teacherAuthenticated, setTeacherAuthenticated] = useState(false);

  
  // ✅ Inject Botpress Chatbot Script
  useEffect(() => {
    console.log("Injecting Botpress Webchat...");

    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v2.3/inject.js";
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement("script");
    script2.src = "https://files.bpcontent.cloud/2025/03/15/11/20250315113013-9VL7504E.js";
    script2.async = true;
    document.body.appendChild(script2);

    // ✅ Initialize Webchat when scripts load
    script2.onload = () => {
      window.botpressWebChat.init({
        botId: "cb4cdff1-4df4-4f99-bb7f-52e449a212cc", // Replace with your bot ID
        clientId: "975b00a9-4bdf-4f5b-97da-a6d6f621b2c7",
        host: "https://cdn.botpress.cloud/webchat",
        messagingUrl: "https://messaging.botpress.cloud",
        webhookUrl: "https://webhook.botpress.cloud/5d1d64c8-2c6d-467e-9099-0b59472df1c6",
        hideWidget: false,
        disableAnimations: false,
        enableConversationDeletion: false,
      });
      console.log("✅ Botpress Webchat Initialized!");
    };

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  return (
    <Router>
      {/* Render Navbar based on authentication type */}
      {authenticated && <Navbar setAuthenticated={setAuthenticated} />}
      {adminAuthenticated && <AdmNavbar setAdminAuthenticated={setAdminAuthenticated} />}
      {teacherAuthenticated && <TeacherNavbar setTeacherAuthenticated={setTeacherAuthenticated} />}

      <Routes>
        <Route path="/" element={<LoginLandingPage />} />
        <Route path="/login" element={<LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/adminlogin" element={<AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/teacherlogin" element={<TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="/home" element={authenticated ? <HomePage /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/transcript" element={authenticated ? <TranscriptPage /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/registration" element={authenticated ? <Regcourse /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/profile" element={authenticated ? <Profile /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/marks" element={authenticated ? <Marks /> : <LoginPage setAuthenticated={setAuthenticated} />} />
        <Route path="/admhome" element={adminAuthenticated ? <AdmHomePage /> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/astudent" element={adminAuthenticated ? <Astudent /> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/ateacher" element={adminAuthenticated ? <Ateacher /> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/areport" element={adminAuthenticated ? <Areport /> : <AdminLoginPage setAdminAuthenticated={setAdminAuthenticated} />} />
        <Route path="/teacherhome" element={teacherAuthenticated ? <TeacherHomePage /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="/tworkflow" element={teacherAuthenticated ? <Tworkflow /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="/tattendance" element={teacherAuthenticated ? <Tattendance /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="/tmarks" element={teacherAuthenticated ? <Tmarks /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="/tprofile" element={teacherAuthenticated ? <Tprofile /> : <TeacherLoginPage setTeacherAuthenticated={setTeacherAuthenticated} />} />
        <Route path="*" element={<Error />} />
      </Routes>

    </Router>
  );
};

export default App;
