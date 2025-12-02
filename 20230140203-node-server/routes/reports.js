// routes/reports.js
const express = require("express");
const router = express.Router();
const { Presensi, User } = require("../models");
const { authenticateToken } = require("../middleware/authMiddleware");
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


