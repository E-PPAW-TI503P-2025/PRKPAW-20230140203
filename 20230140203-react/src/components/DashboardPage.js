import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ sesuai versi terbaru

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  BanknotesIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  MegaphoneIcon,
  BellIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

function DashboardPage() {
  const navigate = useNavigate();

  // Ambil nama pengguna dari token JWT
  let userName = "";
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      userName = decoded.nama || decoded.name || "Mahasiswa";
    }
  } catch (error) {
    console.error("Gagal decode token:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-[#FCF5EE] via-[#FFC4C4] to-[#EE6983]">
      {/* Sidebar */}
      <aside className="w-64 bg-white/20 backdrop-blur-md shadow-lg flex flex-col justify-between p-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#850E35] mb-10">
            🎓
          </h1>
          <nav className="flex flex-col gap-4">
            <button className="flex items-center gap-3 text-[#850E35] font-semibold hover:text-[#EE6983] transition">
              <HomeIcon className="w-5 h-5" /> Dashboard
            </button>
            <button className="flex items-center gap-3 text-[#850E35] hover:text-[#EE6983] transition">
              <ClipboardDocumentListIcon className="w-5 h-5" /> Presensi
            </button>
            <button className="flex items-center gap-3 text-[#850E35] hover:text-[#EE6983] transition">
              <CalendarDaysIcon className="w-5 h-5" /> Jadwal Kuliah
            </button>
            <button className="flex items-center gap-3 text-[#850E35] hover:text-[#EE6983] transition">
              <ChartBarIcon className="w-5 h-5" /> Nilai
            </button>
            <button className="flex items-center gap-3 text-[#850E35] hover:text-[#EE6983] transition">
              <BanknotesIcon className="w-5 h-5" /> Pembayaran
            </button>
            <button className="flex items-center gap-3 text-[#850E35] hover:text-[#EE6983] transition">
              <UserGroupIcon className="w-5 h-5" /> Dosen & Kelas
            </button>
            <button className="flex items-center gap-3 text-[#850E35] hover:text-[#EE6983] transition">
              <MegaphoneIcon className="w-5 h-5" /> Pengumuman
            </button>
          </nav>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white bg-[#850E35] px-4 py-2 rounded-lg hover:bg-[#EE6983] transition"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-[#850E35]">
              Selamat Datang, {userName} 👋
            </h2>
            <p className="text-[#EE6983]">
              Berikut ringkasan aktivitas akademikmu hari ini.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <BellIcon className="w-6 h-6 text-[#850E35] hover:text-[#EE6983] cursor-pointer transition" />
            <UserCircleIcon className="w-9 h-9 text-[#850E35]" />
          </div>
        </header>

        {/* Dashboard Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[minmax(150px,_auto)]">
          {/* Presensi */}
          <div className="md:col-span-2 xl:col-span-2 bg-white/50 rounded-2xl shadow-lg p-6 border border-[#FFC4C4] hover:shadow-xl transition-all duration-300">
            <h3 className="text-[#850E35] font-bold text-xl mb-2">📋 Presensi Hari Ini</h3>
            <p className="text-[#850E35]/80 mb-3 text-sm">
              Kamu telah hadir di <span className="font-semibold text-[#EE6983]">3</span> dari 4 kelas hari ini.
            </p>
            <button className="text-sm text-white bg-[#EE6983] px-4 py-2 rounded-md hover:bg-[#850E35] transition">
              Lihat Detail Presensi
            </button>
          </div>

          {/* Jadwal Kuliah */}
          <div className="xl:col-span-1 bg-white/50 rounded-2xl shadow-lg p-6 border border-[#FFC4C4] hover:shadow-xl transition-all duration-300">
            <h3 className="text-[#850E35] font-bold text-lg mb-2">📅 Jadwal Kuliah</h3>
            <ul className="text-[#850E35]/80 text-sm space-y-1">
              <li>08:00 - Algoritma & Pemrograman</li>
              <li>10:00 - Struktur Data</li>
              <li>13:00 - Basis Data</li>
            </ul>
          </div>

          {/* Nilai */}
          <div className="xl:col-span-1 bg-white/50 rounded-2xl shadow-lg p-6 border border-[#FFC4C4] hover:shadow-xl transition-all duration-300">
            <h3 className="text-[#850E35] font-bold text-lg mb-2">📊 Nilai Semester Ini</h3>
            <p className="text-[#850E35]/80 mb-3">
              Rata-rata IPK sementara: <span className="font-semibold text-[#EE6983]">3.85</span>
            </p>
            <button className="text-sm text-white bg-[#EE6983] px-4 py-2 rounded-md hover:bg-[#850E35] transition">
              Lihat Transkrip
            </button>
          </div>

          {/* Pembayaran */}
          <div className="bg-white/50 rounded-2xl shadow-lg p-6 border border-[#FFC4C4] hover:shadow-xl transition-all duration-300">
            <h3 className="text-[#850E35] font-bold text-lg mb-2">💰 Status Pembayaran</h3>
            <p className="text-[#850E35]/80 text-sm">
              UKT Semester Ganjil: <span className="text-green-600 font-semibold">Lunas ✅</span>
            </p>
          </div>

          {/* Pengumuman */}
          <div className="md:col-span-2 xl:col-span-2 bg-white/50 rounded-2xl shadow-lg p-6 border border-[#FFC4C4] hover:shadow-xl transition-all duration-300">
            <h3 className="text-[#850E35] font-bold text-lg mb-3">📢 Pengumuman Terbaru</h3>
            <ul className="text-[#850E35]/80 text-sm space-y-2">
              <li>📆 KRS dibuka tanggal 5 Desember.</li>
              <li>🧾 UTS dimulai minggu depan.</li>
              <li>🎯 Deadline tugas PBO: 15 November.</li>
            </ul>
          </div>

          {/* Dosen & Kelas */}
          <div className="xl:col-span-1 bg-white/50 rounded-2xl shadow-lg p-6 border border-[#FFC4C4] hover:shadow-xl transition-all duration-300">
            <h3 className="text-[#850E35] font-bold text-lg mb-2">👩‍🏫 Dosen & Kelas</h3>
            <p className="text-[#850E35]/80 text-sm">
              Kamu tergabung dalam 5 mata kuliah aktif dengan 4 dosen pengampu.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;
