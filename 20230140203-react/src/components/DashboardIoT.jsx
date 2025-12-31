import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Thermometer,
  Droplets,
  Sun,
  ShieldAlert,
  ShieldCheck,
  Activity,
} from "lucide-react";

// Registrasi Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardIoT = () => {
  const [loading, setLoading] = useState(true);
  const [latestData, setLatestData] = useState(null); // Data tunggal terakhir
  const [chartData, setChartData] = useState({ labels: [], datasets: [] }); // Data grafik
  const [motionLogs, setMotionLogs] = useState([]); // Data khusus log gerakan

  // --- 1. FUNGSI AMBIL DATA ---
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/iot/history");
      const dataRaw = response.data.data; // Array dari backend

      if (dataRaw.length > 0) {
        // A. Set Data Terakhir (Kartu Atas)
        const terbaru = dataRaw[dataRaw.length - 1];
        setLatestData(terbaru);

        // B. Siapkan Data Grafik
        const labels = dataRaw.map((item) =>
          new Date(item.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })
        );
        const suhu = dataRaw.map((item) => item.suhu);
        const lembab = dataRaw.map((item) => item.kelembaban);

        setChartData({
          labels,
          datasets: [
            {
              label: "Suhu (°C)",
              data: suhu,
              borderColor: "rgb(239, 68, 68)", // Merah
              backgroundColor: "rgba(239, 68, 68, 0.5)",
              tension: 0.4,
            },
            {
              label: "Kelembaban (%)",
              data: lembab,
              borderColor: "rgb(59, 130, 246)", // Biru
              backgroundColor: "rgba(59, 130, 246, 0.5)",
              tension: 0.4,
            },
          ],
        });

        // C. Filter Log Gerakan (Ambil yang motion == true saja)
        // Kita balik urutan agar yang terbaru ada di atas
        const logs = dataRaw.filter((item) => item.motion === true).reverse();
        setMotionLogs(logs);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  // --- 2. AUTO REFRESH (Interval) ---
  useEffect(() => {
    fetchData(); // Load pertama
    const interval = setInterval(fetchData, 2000); // Refresh tiap 2 detik
    return () => clearInterval(interval);
  }, []);

  // --- 3. LOGIKA UI HELPER ---
  // Tentukan status cahaya (Asumsi LDR: Besar = Terang, Kecil = Gelap)
  // Sesuaikan threshold 2000 dengan kondisi ruangan Anda
  const getLightStatus = (val) => (val > 90 ? "Terang" : "Redup/Gelap");

  if (loading)
    return <div className="p-10 text-center">Menghubungkan ke Alat IoT...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-blue-600" /> Dashboard Monitoring IoT
          </h1>
          <span className="text-sm text-gray-500">
            Last Update: {new Date().toLocaleTimeString()}
          </span>
        </div>

        {/* --- BAGIAN 1: KARTU STATUS (GRID) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* KARTU SUHU */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Suhu Ruangan</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {latestData?.suhu || 0}°C
              </h2>
            </div>
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <Thermometer size={32} />
            </div>
          </div>

          {/* KARTU KELEMBABAN */}
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500 flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Kelembaban</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {latestData?.kelembaban || 0}%
              </h2>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Droplets size={32} />
            </div>
          </div>

          {/* KARTU CAHAYA (UPDATED) */}
          <div
            className={`p-6 rounded-xl shadow-sm border-l-4 flex items-center justify-between transition-colors ${
              latestData?.cahaya > 90
                ? "bg-yellow-50 border-yellow-500" // Warna Siang/Terang
                : "bg-gray-100 border-gray-500" // Warna Malam/Gelap
            }`}
          >
            <div>
              <p className="text-gray-500 text-sm">Intensitas Cahaya</p>
              <h2
                className={`text-xl font-bold ${
                  latestData?.cahaya > 90 ? "text-yellow-700" : "text-gray-700"
                }`}
              >
                {/* Panggil fungsi status yang sudah diperbaiki */}
                {latestData ? getLightStatus(latestData.cahaya) : "-"}
              </h2>
              <p className="text-xs text-gray-400">
                Level: {latestData?.cahaya}%
              </p>
            </div>
            <div
              className={`p-3 rounded-full ${
                latestData?.cahaya > 90
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              <Sun size={32} />
            </div>
          </div>

          {/* KARTU KEAMANAN (MOTION) */}
          <div
            className={`p-6 rounded-xl shadow-sm border-l-4 flex items-center justify-between transition-colors duration-500 ${
              latestData?.motion
                ? "bg-red-50 border-red-600"
                : "bg-green-50 border-green-600"
            }`}
          >
            <div>
              <p
                className={`${
                  latestData?.motion ? "text-red-600" : "text-green-700"
                } text-sm font-semibold`}
              >
                STATUS KEAMANAN
              </p>
              <h2
                className={`text-2xl font-bold ${
                  latestData?.motion
                    ? "text-red-700 animate-pulse"
                    : "text-green-800"
                }`}
              >
                {latestData?.motion ? "⚠️ ADA GERAKAN!" : "✅ AMAN"}
              </h2>
            </div>
            <div
              className={`p-3 rounded-full ${
                latestData?.motion
                  ? "bg-red-200 text-red-700"
                  : "bg-green-200 text-green-700"
              }`}
            >
              {latestData?.motion ? (
                <ShieldAlert size={32} />
              ) : (
                <ShieldCheck size={32} />
              )}
            </div>
          </div>
        </div>

        {/* --- BAGIAN 2: GRAFIK & LOG (GRID UTAMA) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* KOLOM KIRI: GRAFIK (Lebar 2/3) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Grafik Suhu & Kelembaban
            </h3>
            <div className="h-80">
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: false, // Matikan animasi agar tidak berat saat refresh 2 detik
                  plugins: {
                    legend: { position: "top" },
                  },
                  scales: {
                    y: { beginAtZero: true },
                  },
                }}
              />
            </div>
          </div>

          {/* KOLOM KANAN: RIWAYAT GERAKAN (Lebar 1/3) */}
          <div className="bg-white p-6 rounded-xl shadow-sm overflow-hidden flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <ShieldAlert size={20} className="text-red-500" /> Riwayat
              Penyusup
            </h3>

            <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
              {motionLogs.length === 0 ? (
                <p className="text-gray-400 text-center italic mt-10">
                  Belum ada gerakan terdeteksi.
                </p>
              ) : (
                <ul className="space-y-3">
                  {motionLogs.slice(0, 10).map(
                    (
                      log,
                      index // Tampilkan 10 terakhir saja
                    ) => (
                      <li
                        key={index}
                        className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100"
                      >
                        <div>
                          <p className="text-xs text-gray-500">
                            Waktu Terdeteksi
                          </p>
                          <p className="font-bold text-gray-800">
                            {new Date(log.createdAt).toLocaleString("id-ID")}
                          </p>
                        </div>
                        <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded">
                          ALERT
                        </span>
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIoT;
