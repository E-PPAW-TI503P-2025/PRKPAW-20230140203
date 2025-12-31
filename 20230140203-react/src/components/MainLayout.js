import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  BanknotesIcon,
  ArrowRightOnRectangleIcon,
  BellIcon,
  UserCircleIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation(); // Untuk tahu kita di halaman mana
  const [userName, setUserName] = useState("Admin");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const decoded = parseJwt(token);
      if (decoded) {
        setUserName(decoded.nama || decoded.name || "Admin");
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-[#FCF5EE] font-sans text-gray-800">
      
      <aside className="w-72 bg-white shadow-2xl flex flex-col z-10 hidden md:flex sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-[#850E35] to-[#EE6983] rounded-xl flex items-center justify-center shadow-lg shadow-pink-200">
                <AcademicCapIcon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="font-bold text-2xl text-[#850E35] leading-none tracking-tight">ADMIN</h1>
            </div>
          </div>

          <nav className="flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4">Menu Utama</p>
            
            <Link
              to="/dashboard"
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 group ${
                isActive("/dashboard")
                ? "bg-[#850E35] text-white shadow-lg shadow-pink-200 translate-x-1"
                : "text-gray-500 hover:bg-pink-50 hover:text-[#850E35]"
              }`}
            >
              <UserCircleIcon className={`w-6 h-6 transition-transform duration-300 ${isActive("/dashboard") ? "scale-110" : "group-hover:scale-110"}`} /> 
              Dashboard
            </Link>

            <Link
              to="/reports"
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 group ${
                isActive("/reports")
                ? "bg-[#850E35] text-white shadow-lg shadow-pink-200 translate-x-1"
                : "text-gray-500 hover:bg-pink-50 hover:text-[#850E35]"
              }`}
            >
              <BanknotesIcon className={`w-6 h-6 transition-transform duration-300 ${isActive("/reports") ? "scale-110" : "group-hover:scale-110"}`} /> 
              Laporan Presensi
            </Link>

            <Link
              to="/monitoring"
              className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-medium transition-all duration-300 group ${
                isActive("/monitoring")
                ? "bg-[#850E35] text-white shadow-lg shadow-pink-200 translate-x-1"
                : "text-gray-500 hover:bg-pink-50 hover:text-[#850E35]"
              }`}
            >
              <BellIcon className={`w-6 h-6 transition-transform duration-300 ${isActive("/monitoring") ? "scale-110" : "group-hover:scale-110"}`} /> 
              Monitoring Suhu
            </Link>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-gray-100">
            <button onClick={handleLogout} className="flex items-center gap-3 text-[#850E35] font-semibold hover:text-[#EE6983] transition-colors w-full px-4 py-2 rounded-lg hover:bg-red-50">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            Keluar Sistem
            </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-br from-[#FCF5EE] via-[#fff0f3] to-[#ffe4e6]">
        
        <header className="h-20 px-8 flex justify-between items-center bg-white/60 backdrop-blur-md border-b border-white/50 sticky top-0 z-20">
            <div>
                <h2 className="text-xl font-bold text-[#850E35]">
                    {isActive("/dashboard") ? "Ringkasan Akademik" : "Laporan Presensi"}
                </h2>
                <p className="text-sm text-gray-500">Halo, {userName}. Selamat datang kembali.</p>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-[#850E35]">{userName}</p>
                        <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-[#850E35] to-[#EE6983] rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
            <Outlet />
        </div>

      </main>
    </div>
  );
}

export default MainLayout;