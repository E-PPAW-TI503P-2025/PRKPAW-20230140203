// routes/dashboard.js
const express = require("express");
const router = express.Router();
const { User, Presensi } = require("../models");
const { authenticateToken } = require("../middleware/auth");

router.get("/", authenticateToken, async (req, res) => {
  try {
    const totalMahasiswa = await User.count({ where: { role: "mahasiswa" } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const presensiHariIni = await Presensi.count({
      where: {
        checkIn: { [Op.gte]: today }
      }
    });

    const belumCheckOut = await Presensi.count({
      where: {
        checkIn: { [Op.gte]: today },
        checkOut: null
      }
    });

    const persentasePresensi = totalMahasiswa ? Math.round((presensiHariIni / totalMahasiswa) * 100) : 0;

    // contoh pertumbuhan bulan ini bisa dihitung dari data bulan ini vs bulan lalu
    const pertumbuhanBulanIni = 5; // dummy, bisa diganti logika sebenarnya

    res.json({ totalMahasiswa, presensiHariIni, belumCheckOut, persentasePresensi, pertumbuhanBulanIni });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data dashboard" });
  }
});

module.exports = router;
