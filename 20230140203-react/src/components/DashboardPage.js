import React from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ pakai named import

function DashboardPage() {
  const navigate = useNavigate();

  // Ambil nama pengguna dari token JWT
  let userName = "";
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      userName = decoded.nama || decoded.name || "Pengguna";
    }
  } catch (error) {
    console.error("Gagal decode token:", error);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FCF5EE] via-[#FFC4C4] to-[#EE6983] flex flex-col items-center justify-center p-6">
      <div className="bg-[rgb(252,245,238)]/90 rounded-2xl shadow-xl p-10 text-center max-w-lg w-full border border-[#FFC4C4] backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold text-[#850E35] mb-4 drop-shadow-sm">
          Selamat Datang 🎉
        </h1>

        <p className="text-lg text-[#850E35] mb-8">
          Hai <span className="font-semibold text-[#EE6983]">{userName}</span>,<br />
          kamu berhasil login ke Dashboard!
        </p>

        <button
          onClick={handleLogout}
          className="py-2 px-8 bg-[#850E35] text-white font-semibold rounded-md shadow-md hover:bg-[#EE6983] transition duration-200"
        >
          Logout
        </button>

        <div className="mt-8 text-sm text-[#850E35]">
          <p>💻 Aplikasi Web Full-Stack</p>
          <p className="italic text-[#EE6983]">Integrasi React & Node.js</p>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
