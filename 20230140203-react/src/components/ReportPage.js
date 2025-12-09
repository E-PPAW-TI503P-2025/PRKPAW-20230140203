import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";

function ReportPage() {
  const [reports, setReports] = useState([]);
  
  // PENTING: Default harus string kosong "", JANGAN new Date()
  const [filterDate, setFilterDate] = useState(""); 
  
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");
    try {
      const decoded = jwtDecode(token);
      if (decoded.role !== "admin") navigate("/presensi");
    } catch { navigate("/login"); }
  }, [navigate]);

  // Fungsi Fetch
  const fetchReports = async (dateParam) => {
    setLoading(true);
    try {
      // Jika dateParam kosong, URL jadi /reports/daily (tanpa ?date=...)
      // Backend akan membaca ini sebagai request "Ambil Semua"
      const url = dateParam ? `/reports/daily?date=${dateParam}` : `/reports/daily`;
      
      const response = await api.get(url);
      setReports(response.data.data || []);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoading(false);
    }
  };

  // PENTING: useEffect ini hanya jalan sekali saat komponen dipasang
  useEffect(() => {
    fetchReports(""); // Panggil dengan STRING KOSONG agar backend ambil semua
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReports(filterDate); // Baru kirim tanggal kalau tombol ditekan
  };

  const handleReset = () => {
    setFilterDate("");
    setSearchTerm("");
    fetchReports(""); // Reset ke string kosong
  };

  // Filter Nama (Client Side)
  const filteredReports = reports.filter((item) => {
    const realName = item.nama || item.user?.nama || "";
    return realName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Format Helper
  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'}) : "-";
  const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit', second:'2-digit', hour12: false}) : "-";

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-pink-600 pb-2">
        Laporan Riwayat Presensi
      </h1>

      {/* FILTER */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Cari Nama..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          {/* Input Date: Pastikan value terikat state filterDate */}
          <input 
            type="date" 
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-pink-700 text-white px-6 py-2 rounded">Terapkan Filter</button>
          <button type="button" onClick={handleReset} className="bg-gray-500 text-white px-6 py-2 rounded">Reset / Tampilkan Semua</button>
        </form>
      </div>

      {/* TABEL */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">No</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nama</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tanggal</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Jam Masuk</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase">Jam Keluar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
               <tr><td colSpan="5" className="text-center py-6">Loading...</td></tr>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{item.nama || item.user?.nama || "Tanpa Nama"}</td>
                  <td className="px-6 py-4 text-gray-600">{formatDate(item.checkIn)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">{formatTime(item.checkIn)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.checkOut ? 
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">{formatTime(item.checkOut)}</span> 
                      : <span className="text-gray-400 italic text-xs">Belum Checkout</span>
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center py-6 text-gray-500">Tidak ada data riwayat.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-right text-gray-500 text-sm">Total baris data: {filteredReports.length}</div>
    </div>
  );
}

export default ReportPage;