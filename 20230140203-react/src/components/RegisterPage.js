import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("mahasiswa");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post("http://localhost:3001/api/auth/register", {
        nama,
        email,
        password,
        role,
      });
      navigate("/login");
    } catch (err) {
      setError(
        err.response ? err.response.data.message : "Registrasi gagal!"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FCF5EE] via-[#FFC4C4] to-[#EE6983]">
      <div className="bg-[rgb(252,245,238)]/90 p-8 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-sm border border-[#FFC4C4]">
        <h2 className="text-3xl font-bold text-[#850E35] text-center mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#FFC4C4] bg-[rgb(252,245,238)] rounded-md focus:ring-2 focus:ring-[#EE6983] focus:border-[#EE6983] outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#FFC4C4] bg-[rgb(252,245,238)] rounded-md focus:ring-2 focus:ring-[#EE6983] focus:border-[#EE6983] outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-[#FFC4C4] bg-[rgb(252,245,238)] rounded-md focus:ring-2 focus:ring-[#EE6983] focus:border-[#EE6983] outline-none"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-[#FFC4C4] bg-[rgb(252,245,238)] rounded-md focus:ring-2 focus:ring-[#EE6983] focus:border-[#EE6983] outline-none"
          >
            <option value="mahasiswa">Mahasiswa</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-[#850E35] text-white py-2 rounded-md font-semibold hover:bg-[#EE6983] transition duration-200"
          >
            Register
          </button>

          {error && (
            <p className="text-[rgb(133,14,53)] text-sm mt-2 text-center font-medium">
              {error}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-[#850E35] mt-6">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#EE6983] hover:text-[#850E35] transition duration-200"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
