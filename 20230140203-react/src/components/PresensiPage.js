import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet Icon Issue
const markerIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function AttendancePage() {
  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ================== GET LOCATION ==================
  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation tidak didukung browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        setError("Gagal mendapatkan lokasi: " + err.message);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  // ================== CHECK IN ==================
  const handleCheckIn = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    if (!coords) {
      setError("Lokasi belum siap. Mohon izinkan lokasi.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        {
          latitude: coords.lat,
          longitude: coords.lng,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Gagal melakukan check-in"
      );
      setMessage("");
    }
  };

  // ================== CHECK OUT ==================
  const handleCheckOut = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-out",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Gagal melakukan check-out"
      );
      setMessage("");
    }
  };

  // ================== LOGOUT ==================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ================== UI ==================
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FCF5EE] via-[#FFC4C4] to-[#EE6983] p-4">
      <div className="w-full max-w-md">
        {/* ================== PETA DI ATAS ================== */}
        {coords && (
          <div className="mb-6 border rounded-lg overflow-hidden shadow-lg">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[coords.lat, coords.lng]} icon={markerIcon}>
                <Popup>Lokasi Presensi Anda</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* ================== CARD PRESENSI ================== */}
        <div className="bg-[rgb(252,245,238)]/95 p-8 rounded-2xl shadow-xl border border-[#FFC4C4] mb-4 backdrop-blur-sm">
          <h2 className="text-3xl font-bold text-[#850E35] mb-4 text-center">
            Presensi Mahasiswa
          </h2>

          {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleCheckIn}
              className="flex-1 py-3 px-4 bg-green-600 text-white font-semibold rounded-md shadow-sm hover:bg-green-700 transition"
            >
              Check-In
            </button>
            <button
              onClick={handleCheckOut}
              className="flex-1 py-3 px-4 bg-red-600 text-white font-semibold rounded-md shadow-sm hover:bg-red-700 transition"
            >
              Check-Out
            </button>
          </div>
        </div>

        {/* ================== LOGOUT BUTTON ================== */}
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-[#850E35] text-white font-semibold rounded-md shadow-sm hover:bg-[#EE6983] transition duration-200 disabled:opacity-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AttendancePage;