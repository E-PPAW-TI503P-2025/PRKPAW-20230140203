// controllers/presensiController.js
const { Presensi } = require("../models");
const { format } = require("date-fns-tz");
const timeZone = "Asia/Jakarta";

exports.CheckIn = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude dan longitude wajib diisi." });
    }

    const existingRecord = await Presensi.findOne({
      where: { userId, checkOut: null },
    });

    if (existingRecord) {
      return res.status(400).json({ message: "Anda sudah check-in hari ini." });
    }

    const newRecord = await Presensi.create({
      userId,
      nama: userName,
      checkIn: new Date(),
      checkOut: null,
      latitude,
      longitude,
    });

    res.status(201).json({
      message: `Check-in berhasil pada pukul ${format(newRecord.checkIn, "HH:mm:ss", { timeZone })} WIB`,
      data: newRecord,
    });
  } catch (error) {
    console.error("Check-in error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.CheckOut = async (req, res) => {
  try {
    const { id: userId, nama: userName } = req.user;

    const record = await Presensi.findOne({ where: { userId, checkOut: null } });
    if (!record) return res.status(404).json({ message: "Tidak ditemukan check-in aktif." });

    record.checkOut = new Date();
    await record.save();

    res.json({
      message: `Check-out berhasil pada pukul ${format(record.checkOut, "HH:mm:ss", { timeZone })} WIB`,
      data: record,
    });
  } catch (error) {
    console.error("Check-out error:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;

    const record = await Presensi.findByPk(presensiId);
    if (!record) return res.status(404).json({ message: "Data tidak ditemukan." });
    if (record.userId !== userId) return res.status(403).json({ message: "Tidak berhak menghapus data ini." });

    await record.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};

exports.updatePresensi = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const presensiId = req.params.id;
    const { checkIn, checkOut } = req.body;

    const record = await Presensi.findByPk(presensiId);
    if (!record) return res.status(404).json({ message: "Data tidak ditemukan." });
    if (record.userId !== userId) return res.status(403).json({ message: "Tidak berhak mengubah data ini." });

    if (checkIn) record.checkIn = new Date(checkIn);
    if (checkOut) record.checkOut = new Date(checkOut);
    await record.save();

    res.json({ message: "Data presensi diperbarui", data: record });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
  }
};
