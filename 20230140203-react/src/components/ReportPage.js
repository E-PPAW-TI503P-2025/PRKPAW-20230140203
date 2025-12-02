// src/components/ReportPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function ReportPage() {
  const [reports, setReports] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ===== Cek role =====
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") navigate("/presensi");
    } catch (err) {
      navigate("/login");
    }
  }, [navigate]);

  // ===== Fetch Reports =====
  const fetchDailyReports = async (date = "") => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3001/api/reports/daily${date ? `?date=${date}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReports(response.data.data || []);
      setError(null);
    } catch (err) {
      setReports([]);
      setError(err.response?.data?.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyReports();
  }, []);

  // ===== Handle Filter Submit =====
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDailyReports(filterDate);
  };

  // ===== Filter Frontend =====
  const filteredReports = reports.filter((item) =>
    item.user?.nama?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-[#850E35] mb-6 border-b-2 border-[#EE6983] pb-2">
        Laporan Presensi Harian (Admin)
      </h1>

      {/* Form Filter & Pencarian */}
      <form onSubmit={handleSearchSubmit} className="mb-8 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cari Nama</label>
            <input
              type="text"
              placeholder="Nama Mahasiswa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EE6983]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter Tanggal</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EE6983]"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-2 px-6 bg-[#850E35] text-white font-semibold rounded-md shadow-sm hover:bg-[#600a26] transition duration-200"
            >
              Terapkan Filter
            </button>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <p className="text-red-600 bg-red-100 border border-red-300 p-4 rounded-md mb-4 text-center font-medium">
          {error}
        </p>
      )}

      {/* Table */}
      {!error && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#FCF5EE]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#850E35] uppercase tracking-wider">Nama Mahasiswa</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#850E35] uppercase tracking-wider">Waktu Masuk</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#850E35] uppercase tracking-wider">Waktu Keluar</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500 italic">Loading...</td>
                  </tr>
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((presensi, index) => (
                    <tr key={presensi.id || index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{presensi.user?.nama || "Tanpa Nama"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {presensi.checkIn ? new Date(presensi.checkIn).toLocaleString("id-ID") : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {presensi.checkOut ? new Date(presensi.checkOut).toLocaleString("id-ID") : "Belum Check-Out"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500 italic">Tidak ada data ditemukan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;
