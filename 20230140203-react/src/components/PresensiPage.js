import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PresensiPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 🔄 Update waktu setiap detik
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 📍 Ambil lokasi pengguna
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          console.log("Lokasi berhasil didapatkan:", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.error("Gagal mendapatkan lokasi:", err);
          setError(
            "Gagal mendapatkan lokasi. Pastikan GPS aktif dan izinkan akses lokasi."
          );
        }
      );
    } else {
      setError("Geolocation tidak didukung oleh browser ini.");
    }
  }, []);

  // 🔹 Handle Check-In
  const handleCheckIn = async () => {
    setError("");
    setMessage("");

    if (!coords) {
      setError("Lokasi belum tersedia. Izinkan akses lokasi dan coba lagi.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        { latitude: coords.lat, longitude: coords.lng },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Check-in berhasil:", response.data);
      setMessage(response.data.message);
    } catch (err) {
      console.error("Check-in error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Check-in gagal");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Check-Out
  const handleCheckOut = async () => {
    setError("");
    setMessage("");

    if (!coords) {
      setError("Lokasi belum tersedia. Izinkan akses lokasi dan coba lagi.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        { latitude: coords.lat, longitude: coords.lng },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Check-out berhasil:", response.data);
      setMessage(response.data.message);
    } catch (err) {
      console.error("Check-out error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Check-out gagal");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FCF5EE] via-[#FFC4C4] to-[#EE6983]">
      <div className="bg-[rgb(252,245,238)]/95 p-8 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-sm border border-[#FFC4C4]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#850E35] mb-2">
            Presensi Mahasiswa
          </h2>
          <p className="text-[#EE6983] font-medium">
            {currentTime.toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-2xl font-bold text-[#850E35] mt-2">
            {currentTime.toLocaleTimeString("id-ID")}
          </p>
        </div>

        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleCheckIn}
            disabled={loading}
            className="w-full py-4 px-4 bg-[#850E35] text-white font-bold rounded-xl shadow-lg hover:bg-[#600a26] hover:scale-105 transition transform duration-200 disabled:opacity-50 flex flex-col items-center"
          >
            {loading ? "..." : "check-in"}
          </button>

          <button
            onClick={handleCheckOut}
            disabled={loading}
            className="w-full py-4 px-4 bg-[#EE6983] text-white font-bold rounded-xl shadow-lg hover:bg-[#d4566f] hover:scale-105 transition transform duration-200 disabled:opacity-50 flex flex-col items-center"
          >
            {loading ? "..." : "check-out"}
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-2 text-[#850E35] font-semibold hover:text-[#600a26] transition duration-200 text-sm"
        >
          Logout / Keluar
        </button>
      </div>
    </div>
  );
}

export default PresensiPage;