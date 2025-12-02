const { Presensi } = require("../models");
const { Op } = require("sequelize");
const { format } = require("date-fns-tz");

const timeZone = "Asia/Jakarta";

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;

    let options = { where: {} };

    // ========== FILTER NAMA (opsional) ==========
    if (nama) {
      options.where.nama = { [Op.like]: `%${nama}%` };
    }

    // ========== FILTER TANGGAL (opsional) ==========
    // Bisa hanya tanggalMulai, atau hanya tanggalSelesai, atau keduanya
    if (tanggalMulai || tanggalSelesai) {
      const mulai = tanggalMulai
        ? new Date(`${tanggalMulai}T00:00:00`)
        : new Date("1970-01-01T00:00:00");

      const selesai = tanggalSelesai
        ? new Date(`${tanggalSelesai}T23:59:59`)
        : new Date("3000-12-31T23:59:59");

      options.where.checkIn = {
        [Op.between]: [mulai, selesai],
      };
    }

    // ========== QUERY DATABASE ==========
    const records = await Presensi.findAll(options);

    // ========== FORMAT WAKTU WIB ==========
    const currentDateWIB = format(new Date(), "yyyy-MM-dd HH:mm:ssXXX", {
      timeZone,
    });

    res.json({
      reportGeneratedAt: currentDateWIB,
      filter: { nama, tanggalMulai, tanggalSelesai },
      total: records.length,
      data: records,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil laporan",
      error: error.message,
    });
  }
};

// routes/reports.js
const express = require("express");
const router = express.Router();
const { Presensi, User } = require("../models");
const { authenticateToken } = require("../middleware/auth");
const { Op } = require("sequelize");

router.get("/daily", authenticateToken, async (req, res) => {
  try {
    const { date } = req.query;

    let startDate, endDate;
    if (date) {
      startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
    } else {
      const today = new Date();
      startDate = new Date(today.setHours(0, 0, 0, 0));
      endDate = new Date(today.setHours(23, 59, 59, 999));
    }

    const data = await Presensi.findAll({
      where: {
        checkIn: { [Op.between]: [startDate, endDate] }
      },
      include: [{ model: User, attributes: ["nama"] }],
      order: [["checkIn", "ASC"]]
    });

    res.json({ reportDate: startDate.toISOString().split("T")[0], data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil laporan harian" });
  }
});

module.exports = router;
