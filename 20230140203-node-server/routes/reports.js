const express = require("express");
const router = express.Router();
const { Presensi, User } = require("../models");
const { authenticateToken } = require("../middleware/authMiddleware");
const { Op } = require("sequelize");

router.get("/daily", authenticateToken, async (req, res) => {
  try {
    // 1. Cek Admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    const { date } = req.query;
    
    // --- DEBUGGING: Cek apa yang diterima backend ---
    console.log("=== REQUEST MASUK ===");
    console.log("Parameter Date:", date); 

    // 2. SETUP WHERE CLAUSE
    // PENTING: Inisialisasi KOSONG dulu.
    let whereClause = {}; 

    // HANYA JIKA date ada isinya, baru kita isi filter
    if (date && date !== "" && date !== "undefined") {
      console.log("FILTER AKTIF: Memfilter tanggal", date);
      const startDate = new Date(`${date}T00:00:00`);
      const endDate = new Date(`${date}T23:59:59`);
      
      whereClause.checkIn = {
        [Op.between]: [startDate, endDate]
      };
    } else {
      console.log("FILTER MATI: Mengambil SEMUA data");
      // whereClause tetap {}, artinya SELECT * FROM ...
    }

    // 3. Query Database
    const data = await Presensi.findAll({
      where: whereClause, // <--- Ini kuncinya
      include: [{
        model: User,
        as: "user", 
        attributes: ["nama", "email"]
      }],
      order: [["checkIn", "DESC"]] 
    });

    console.log(`Ditemukan ${data.length} data.`);

    res.json({
      status: "success",
      total: data.length,
      data: data
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ message: "Gagal mengambil data", error: err.message });
  }
});

module.exports = router;