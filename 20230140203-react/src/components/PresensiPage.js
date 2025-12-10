import React, { useState, useEffect, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet Icon Issue
const markerIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function AttendancePage() {
  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- STATE BARU UNTUK MODAL ---
  const [showModal, setShowModal] = useState(false);

  const [image, setImage] = useState(null);
  const webcamRef = useRef(null);

  // Capture Image
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  // Get Token helper
  const getToken = () => localStorage.getItem("token");

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
    // Check for token on load
    const token = getToken();
    if (!token) navigate("/login");
  }, [navigate]);

  // ================== CHECK IN ==================
  const handleCheckIn = async () => {
    const token = getToken();
    if (!token) return navigate("/login");

    if (!coords) {
      setError("Lokasi belum siap. Mohon izinkan lokasi.");
      return;
    }
    if (!image) {
      setError("Foto wajib ada!");
      return;
    }

    try {
      // Convert base64 image to blob
      const blob = await (await fetch(image)).blob();

      const formData = new FormData();
      formData.append("latitude", coords.lat);
      formData.append("longitude", coords.lng);
      formData.append("image", blob, "foto.jpg");

      const response = await axios.post(
        "http://localhost:3001/api/presensi/check-in",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage(response.data.message);
      setError("");
      // Reset image after successful check-in? Optional
      // setImage(null); 
    } catch (err) {
      console.error(err);
      setError(
        err.response ? err.response.data.message : "Gagal melakukan check-in"
      );
      setMessage("");
    }
  };

  // ================== CHECK OUT ==================
  const handleCheckOut = async () => {
    const token = getToken();
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FCF5EE] via-[#FFC4C4] to-[#EE6983] p-4 relative">
      
      {/* ================== MODAL POPUP (NEW) ================== */}
      {showModal && image && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity"
          onClick={() => setShowModal(false)} // Klik background untuk tutup
        >
          <div className="relative max-w-3xl w-full animate-scale-up">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-2xl font-bold"
            >
              ✕ Tutup
            </button>
            <img 
              src={image} 
              alt="Full Preview" 
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl border-2 border-white"
            />
          </div>
        </div>
      )}

      <div className="w-full max-w-md z-10">
        
        {/* ================== PETA ================== */}
        {coords && (
          <div className="mb-6 border rounded-lg overflow-hidden shadow-lg z-0 relative">
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: "200px", width: "100%" }}
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
        <div className="bg-[rgb(252,245,238)]/95 p-6 rounded-2xl shadow-xl border border-[#FFC4C4] mb-4 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-[#850E35] mb-4 text-center">
            Presensi Mahasiswa
          </h2>

          {message && <p className="text-green-600 font-medium mb-4 text-center bg-green-100 p-2 rounded">{message}</p>}
          {error && <p className="text-red-600 font-medium mb-4 text-center bg-red-100 p-2 rounded">{error}</p>}

          {/* ================== KAMERA / FOTO ================== */}
          <div className="mb-4 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-black relative group">
             {image ? (
                // --- UPDATE: BISA DIKLIK UNTUK MEMPERBESAR ---
                <div 
                  className="relative cursor-pointer" 
                  onClick={() => setShowModal(true)}
                >
                    <img 
                        src={image} 
                        alt="Selfie" 
                        className="w-full h-64 object-cover" 
                    />
                    {/* Overlay Hover */}
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-white font-semibold flex items-center gap-2">
                           🔍 Klik untuk memperbesar
                        </span>
                    </div>
                </div>
             ) : (
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-64 object-cover"
                  videoConstraints={{ facingMode: "user" }}
                />
             )}
          </div>

          {/* Tombol Ambil Foto / Ulang */}
          <div className="mb-6">
            {!image ? (
              <button
                onClick={capture}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200 flex items-center justify-center gap-2"
              >
                <span>📸</span> Ambil Foto
              </button>
            ) : (
              <button
                onClick={() => setImage(null)}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-200 flex items-center justify-center gap-2"
              >
                <span>🔄</span> Foto Ulang
              </button>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleCheckIn}
              className="flex-1 py-3 px-4 bg-green-600 text-white font-bold rounded-lg shadow hover:bg-green-700 transition duration-200 transform hover:scale-105"
            >
              Check-In
            </button>
            <button
              onClick={handleCheckOut}
              className="flex-1 py-3 px-4 bg-red-600 text-white font-bold rounded-lg shadow hover:bg-red-700 transition duration-200 transform hover:scale-105"
            >
              Check-Out
            </button>
          </div>
        </div>

        {/* ================== LOGOUT BUTTON ================== */}
        <button
          onClick={handleLogout}
          className="w-full py-3 px-4 bg-[#850E35] text-white font-bold rounded-lg shadow hover:bg-[#a01240] transition duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default AttendancePage;