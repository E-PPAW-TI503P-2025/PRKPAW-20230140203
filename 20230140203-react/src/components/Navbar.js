import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (err) {
      console.error("Token invalid");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="p-4 bg-gray-800 shadow-md flex space-x-6 text-gray-200">
      <Link className="hover:text-gray-400" to="/dashboard">
        Dashboard
      </Link>

      <Link className="hover:text-gray-400" to="/presensi">
        Presensi
      </Link>

      {user?.role === "admin" && (
        <Link className="hover:text-gray-400" to="/reports">
          Laporan Admin
        </Link>
      )}

      <span className="ml-auto font-medium">
        {user ? `👤 ${user.nama}` : ""}
      </span>

      <button
        onClick={handleLogout}
        className="ml-4 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;