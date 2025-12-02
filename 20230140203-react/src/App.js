import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import DashboardPage from './components/DashboardPage';
import PresensiPage from './components/PresensiPage';
import ReportPage from './components/ReportAdmin';
import MainLayout from './components/MainLayout'


function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/dashboard', '/presensi', '/report'];
  const shouldShowNavbar = !hideNavbarPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen font-sans">
      {shouldShowNavbar && (
        <nav className="absolute top-0 w-full p-6 flex justify-end space-x-8 text-[#850E35] font-bold z-50 pr-10">
          <Link to="/login" className="hover:text-[#EE6983] transition-colors duration-200 hover:underline drop-shadow-sm">
            Login
          </Link>
          <Link to="/register" className="hover:text-[#EE6983] transition-colors duration-200 hover:underline drop-shadow-sm">
            Register
          </Link>
        </nav>
      )}

      <Routes>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/presensi" element={<PresensiPage />} />
        <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/report" element={<ReportPage />} />
        </Route>
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;