const express = require("express");
const router = express.Router();
const { User, Presensi } = require("../models");
const { authenticateToken } = require("../middleware/authMiddleware");
const { Op } = require("sequelize"); // ✅ WAJIB: Import Op

router.get("/", authenticateToken, async (req, res) => {
  try {
    // 1. Setup Tanggal Hari Ini (00:00:00 s/d 23:59:59)
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    // Setup Awal Bulan (Untuk hitung pertumbuhan user baru)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 2. Jalankan Query Secara Paralel (Biar Cepat)
    const [totalMahasiswa, presensiHariIni, belumCheckOut, mahasiswaBaruBulanIni] = await Promise.all([
      
      // A. Hitung Total Mahasiswa (Role 'user', BUKAN 'admin')
      User.count({ 
        where: { role: "user" } 
      }),

      // B. Hitung Presensi Masuk Hari Ini
      Presensi.count({
        where: {
          checkIn: { [Op.between]: [startOfDay, endOfDay] }
        }
      }),

      // C. Hitung Yang Belum Check-Out (checkOut masih null)
      Presensi.count({
        where: {
          checkIn: { [Op.between]: [startOfDay, endOfDay] },
          checkOut: null 
        }
      }),

      // D. Hitung Mahasiswa Baru Bulan Ini
      User.count({
        where: {
          role: "user",
          createdAt: { [Op.gte]: startOfMonth }
        }
      })
    ]);

    // 3. Hitung Persentase (Hindari pembagian dengan 0)
    const persentasePresensi = totalMahasiswa > 0 
      ? Math.round((presensiHariIni / totalMahasiswa) * 100) 
      : 0;

    // 4. Hitung Pertumbuhan (User baru / Total User * 100)
    const pertumbuhanBulanIni = totalMahasiswa > 0
      ? Math.round((mahasiswaBaruBulanIni / totalMahasiswa) * 100)
      : 0;

    // 5. Kirim Response
    res.json({ 
      totalMahasiswa, 
      presensiHariIni, 
      belumCheckOut, 
      persentasePresensi, 
      pertumbuhanBulanIni 
    });

  } catch (err) {
    console.error("Error Dashboard:", err);
    res.status(500).json({ message: "Gagal mengambil data dashboard" });
  }
});

module.exports = router;