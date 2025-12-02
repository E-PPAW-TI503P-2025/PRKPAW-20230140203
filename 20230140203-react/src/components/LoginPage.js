import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// Fungsi bantuan untuk membongkar (decode) isi Token JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log("Data dari Server:", data); // Debugging

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // 1. Coba cari role di body response (siapa tau ada)
        let roleUser = data.role || (data.user && data.user.role);

        // 2. Jika tidak ada di body, BONGKAR TOKEN-nya untuk cari role
        if (!roleUser && data.token) {
            const decodedToken = parseJwt(data.token);
            console.log("Isi Token setelah didecode:", decodedToken); // LIHAT INI DI CONSOLE

            if (decodedToken && decodedToken.role) {
                roleUser = decodedToken.role;
            } else {
                 // Kadang role disimpan dengan nama lain di token, misal 'isAdmin' atau 'status'
                 // Anda bisa cek log "Isi Token" untuk memastikan nama field-nya
            }
        }

        if (roleUser) {
            localStorage.setItem("role", roleUser);
            const roleCheck = roleUser.toString().toLowerCase();

            if (roleCheck === "admin") {
                navigate("/dashboard");
            } else if (roleCheck === "mahasiswa") {
                navigate("/presensi");
            } else {
                setError(`Role ditemukan ("${roleUser}"), tapi tidak dikenali sistem.`);
            }
        } else {
            console.error("Gagal menemukan role di Response Body maupun di dalam Token.");
            setError("Login berhasil, tapi sistem tidak bisa menentukan status Role Anda.");
        }

      } else {
        setError(data.message || "Email atau password salah");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FCF5EE] via-[#FFC4C4] to-[#EE6983]">
      <div className="bg-[rgb(252,245,238)]/90 p-8 rounded-2xl shadow-xl w-full max-w-md backdrop-blur-sm border border-[#FFC4C4]">
        <h2 className="text-3xl font-bold text-center mb-6 text-[#850E35]">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#850E35]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-[#FFC4C4] bg-[rgb(252,245,238)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EE6983] focus:border-[#EE6983]"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[#850E35]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full px-3 py-2 border border-[#FFC4C4] bg-[rgb(252,245,238)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#EE6983] focus:border-[#EE6983]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#850E35] text-white font-semibold rounded-md shadow-sm hover:bg-[#EE6983] transition duration-200 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 text-center text-sm">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <p className="text-center text-sm text-[#850E35] mt-6">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#EE6983] hover:text-[#850E35] transition duration-200"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;