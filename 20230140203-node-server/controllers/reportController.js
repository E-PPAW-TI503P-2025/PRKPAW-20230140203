const { Presensi } = require("../models");
const { Op } = require("sequelize");
exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;
    const { id: userId, role } = req.user;

    let options = { where: {} };

    // Jika bukan admin, hanya bisa melihat data sendiri
    if (role !== 'admin') {
      options.where.userId = userId;
    }

    // Filter berdasarkan nama (jika ada)
    // Note: User biasa tetap bisa filter nama, tapi hanya akan mencari di datanya sendiri (karena ada where.userId)
    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      reportDate: new Date().toLocaleDateString(),
      data: records,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil laporan", error: error.message });
  }
};