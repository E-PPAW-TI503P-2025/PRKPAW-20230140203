import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // Pastikan path ini benar sesuai struktur folder Anda
import {
  UserCircleIcon,
  PresentationChartLineIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

function DashboardPage() {
  // 1. State untuk menampung data dari Backend
  const [stats, setStats] = useState({
    totalMahasiswa: 0,
    presensiHariIni: 0,
    belumCheckOut: 0,
    persentasePresensi: 0,
    pertumbuhanBulanIni: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 2. Fetch Data saat halaman dibuka
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Panggil endpoint /dashboard (BaseURL sudah diset di api/axios.js)
        const response = await api.get("/dashboard");
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Gagal memuat dashboard:", err);
        setError("Gagal memuat data. Cek koneksi server.");
        setLoading(false);
        
        // Redirect jika token expired (Unauthorized)
        if (err.response && err.response.status === 401) {
          navigate("/login");
        }
      }
    };

    fetchDashboardData();
  }, [navigate]);

  // 3. Tampilan Loading
  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#850E35]"></div>
    </div>
  );

  // 4. Tampilan Error
  if (error) return (
    <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg border border-red-200 m-8">
      <p className="font-bold">Terjadi Kesalahan</p>
      <p>{error}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-pink-500 pb-2 inline-block">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* === CARD 1: TOTAL MAHASISWA === */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserCircleIcon className="w-24 h-24 text-[#850E35]" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 text-[#850E35]">
              <UserCircleIcon className="w-6 h-6" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Total Mahasiswa</p>
            <h4 className="text-4xl font-bold text-[#850E35] mt-1">
              {stats.totalMahasiswa}
            </h4>
            
            {/* Indikator Pertumbuhan */}
            <div className="flex items-center gap-1 mt-4 text-green-600 text-sm font-medium bg-green-50 w-fit px-2 py-1 rounded-lg">
              <PresentationChartLineIcon className="w-4 h-4" />
              <span>+{stats.pertumbuhanBulanIni}% bulan ini</span>
            </div>
          </div>
        </div>

        {/* === CARD 2: PRESENSI HARI INI === */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ClockIcon className="w-24 h-24 text-[#EE6983]" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 text-[#EE6983]">
              <ClockIcon className="w-6 h-6" />
            </div>
            <p className="text-gray-500 text-sm font-medium">Hadir Hari Ini</p>
            <h4 className="text-4xl font-bold text-[#850E35] mt-1">
              {stats.presensiHariIni}
            </h4>
            
            {/* Progress Bar Kehadiran */}
            <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-500">Persentase Kehadiran</span>
                    <span className="text-xs font-bold text-[#EE6983]">{stats.persentasePresensi}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#EE6983] h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stats.persentasePresensi}%` }}
                  ></div>
                </div>
            </div>
          </div>
        </div>

        {/* === CARD 3: BELUM CHECK-OUT (URGENT) === */}
        <div className="bg-gradient-to-br from-[#850E35] to-[#a01d4a] p-6 rounded-2xl shadow-lg text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute -bottom-4 -right-4 opacity-20">
            <ExclamationTriangleIcon className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-white" />
              </div>
              <span className="bg-red-500 border border-red-400 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider animate-pulse">
                Monitor
              </span>
            </div>
            
            <p className="text-pink-200 text-sm font-medium">Belum Check-Out</p>
            <h4 className="text-4xl font-bold mt-1">
              {stats.belumCheckOut}
            </h4>
            
            <p className="text-xs text-pink-200 mt-4 opacity-80 leading-relaxed">
              Mahasiswa yang sudah Check-In hari ini tapi belum melakukan Check-Out.
            </p>
          </div>
        </div>

      </div>
      
      {/* AREA GRAFIK ATAU TABEL RINGKASAN BISA DITAMBAHKAN DI BAWAH SINI */}
      <div className="mt-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-700 mb-2">Informasi Sistem</h3>
        <p className="text-gray-500 text-sm">
            Data di atas diperbarui secara real-time berdasarkan aktivitas presensi hari ini ({new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}).
        </p>
      </div>
    </div>
  );
}

export default DashboardPage;