//const presensiRecords = require("../data/presensiData");
const { Presensi } = require("../models");
const { Op } = require("sequelize");
//exports.getDailyReport = (req, res) => {
  //console.log("Controller: Mengambil data laporan harian dari array...");
  //res.json({
    //reportDate: new Date().toLocaleDateString(),
    //data: presensiRecords,
  //});
//};

exports.getDailyReport = async (req, res) => {
  try {
    const { nama, checkIn, checkOut } = req.query;
    let options = { where: {} };

    if (nama) {
      options.where.nama = {
        [Op.like]: `%${nama}%`,
      };
    }
    if (checkIn ) {
      options.where.checkIn = {
        [Op.between]: [checkIn],
      };
    }

    if (checkIn) {
      
      const tanggalAwal = new Date(checkIn);
      const tanggalAkhir = new Date(checkIn);
      tanggalAkhir.setDate(tanggalAkhir.getDate() + 1);

      options.where.checkIn = { [Op.between]: [tanggalAwal, tanggalAkhir] };
    }

    if (checkOut) {
      const tanggalAwal = new Date(checkOut);
      const tanggalAkhir = new Date(checkOut);
      tanggalAkhir.setDate(tanggalAkhir.getDate() + 1);

      options.where.checkOut = { [Op.between]: [tanggalAwal, tanggalAkhir] };
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
