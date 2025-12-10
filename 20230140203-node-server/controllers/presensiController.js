const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const timeZone = "Asia/Jakarta";
const multer = require('multer');
const path = require('path');


// ================= MULTER STORAGE ==================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Folder penyimpanan
  },
  filename: (req, file, cb) => {
    const userId = req.user?.id || 'unknown';  // FIX: req.user.id
    cb(null, `${userId}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Hanya file gambar yang diperbolehkan!'), false);
};

exports.upload = multer({ storage, fileFilter });


// ================== CHECK IN ==================
exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const { latitude, longitude } = req.body;
    const waktuSekarang = new Date();

    // FIX: hanya simpan filename (bukan uploads/filename)
    const buktiFoto = req.file ? req.file.filename : null;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude dan longitude wajib dikirim.",
      });
    }

    // Cek apakah user sudah check-in dan belum check-out
    const existingRecord = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({
        message: "Anda sudah melakukan check-in hari ini."
      });
    }

    const newRecord = await Presensi.create({
      userId,
      nama: userName,
      checkIn: waktuSekarang,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      buktiFoto: buktiFoto
    });

    res.status(201).json({
      message: `Halo ${userName}, check-in berhasil pada pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: {
        ...newRecord.dataValues,
        checkIn: format(newRecord.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone })
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
};


// ================== CHECK OUT ==================
exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const waktuSekarang = new Date();

    const record = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (!record) {
      return res.status(404).json({
        message: "Tidak ditemukan catatan check-in aktif untuk Anda.",
      });
    }

    record.checkOut = waktuSekarang;
    await record.save();

    res.json({
      message: `Selamat jalan ${userName}, check-out berhasil pukul ${format(
        waktuSekarang,
        "HH:mm:ss",
        { timeZone }
      )} WIB`,
      data: {
        ...record.dataValues,
        checkIn: format(record.checkIn, "yyyy-MM-dd HH:mm:ssXXX", { timeZone }),
        checkOut: format(record.checkOut, "yyyy-MM-dd HH:mm:ssXXX", { timeZone })
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};


// ================== DELETE ==================
exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;

    const record = await Presensi.findByPk(presensiId);

    if (!record) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    if (record.userId !== userId) {
      return res.status(403).json({ message: "Akses ditolak: Anda bukan pemilik catatan ini." });
    }

    await record.destroy();
    res.status(204).send();

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};


// ================== UPDATE ==================
exports.updatePresensi = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const presensiId = req.params.id;
    const { checkIn, checkOut, nama } = req.body;

    const record = await Presensi.findByPk(presensiId);
    if (!record) {
      return res.status(404).json({ message: "Catatan presensi tidak ditemukan." });
    }

    if (checkIn) record.checkIn = checkIn;
    if (checkOut) record.checkOut = checkOut;
    if (nama) record.nama = nama;

    await record.save();

    res.json({ message: "Data presensi berhasil diperbarui", data: record });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};


// ================== SEARCH ==================
exports.searchByTanggal = async (req, res) => {
  try {
    const { tanggal } = req.query;

    if (!tanggal) return res.status(400).json({ message: "Parameter 'tanggal' wajib diisi (YYYY-MM-DD)" });

    const hasil = await Presensi.findAll({
      where: {
        checkIn: {
          [Op.between]: [
            new Date(`${tanggal}T00:00:00`),
            new Date(`${tanggal}T23:59:59`),
          ],
        },
      },
    });

    if (!hasil.length) {
      return res.status(404).json({ message: "Tidak ada presensi pada tanggal tersebut." });
    }

    res.json({ message: `Data presensi tanggal ${tanggal}`, data: hasil });

  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
