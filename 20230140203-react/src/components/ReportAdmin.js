import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ReportAdmin() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // State untuk filter input
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState(""); 

  // Ambil data saat halaman pertama kali dimuat
  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReports = async (nama = "", date = "") => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      // Base URL API Backend
      let url = "http://localhost:3001/api/reports/daily";
      
      // Menggunakan URLSearchParams untuk menyusun query string
      const params = new URLSearchParams();
      if (nama) params.append("nama", nama);
      if (date) params.append("checkIn", date); 

      const fullUrl = `${url}?${params.toString()}`;
      
      const response = await fetch(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Mengirim Token
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Menangani format data dari backend
        const reportData = data.data || (Array.isArray(data) ? data : []);
        setReports(reportData);
        setError(""); 
      } else {
        setError(data.message || "Gagal mengambil data laporan.");
      }
    } catch (err) {
      setReports([]); 
      setError("Gagal terhubung ke server backend.");
      console.error(err);
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchReports(searchTerm, filterDate);
  };

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

      {error && (
        <p className="text-red-600 bg-red-100 border border-red-300 p-4 rounded-md mb-4 text-center font-medium">
            {error}
        </p>
      )}

      {!error && (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#FCF5EE]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#850E35] uppercase tracking-wider">
                    Nama Mahasiswa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#850E35] uppercase tracking-wider">
                    Waktu Masuk
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#850E35] uppercase tracking-wider">
                    Waktu Keluar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.length > 0 ? (
                  reports.map((presensi, index) => (
                    <tr key={presensi.id || index} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {presensi.user?.nama || presensi.nama || "Tanpa Nama"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {presensi.checkIn 
                          ? new Date(presensi.checkIn).toLocaleString("id-ID") 
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {presensi.checkOut
                          ? new Date(presensi.checkOut).toLocaleString("id-ID")
                          : "Belum Check-Out"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500 italic">
                      Tidak ada data ditemukan.
                    </td>
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

export default ReportAdmin;