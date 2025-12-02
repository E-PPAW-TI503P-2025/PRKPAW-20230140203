import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import AttendancePage from './components/PresensiPage';
import ReportPage from './components/ReportAdmin';

function App() {
  return (
    <Router>
      <div>
        <nav className="p-4 bg-gradient-to-r from-rose-100 to-pink-100 shadow-md">
        </nav>
        
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/presensi" element={<AttendancePage />} />
          <Route path="/reports" element={<ReportPage />} />
          <Route path="/" element={<LoginPage />} /> 
        </Routes>
      </div>
    </Router>
  );
}
export default App;