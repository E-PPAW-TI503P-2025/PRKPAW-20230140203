const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const presensiController = require('../controllers/presensiController');
const { verifyToken } = require('../middleware/authMiddleware'); // <-- pakai JWT, bukan dummy!

// Endpoint check-in dan check-out
router.post('/check-in', verifyToken, presensiController.CheckIn);
router.post('/check-out', verifyToken, presensiController.CheckOut);

// Endpoint hapus data presensi
router.delete('/:id', verifyToken, presensiController.deletePresensi);

// Endpoint update dengan validasi format tanggal
router.put(
  '/:id',
  verifyToken,
  [
    body('checkIn')
      .optional()
      .isISO8601()
      .withMessage('checkIn harus berupa format tanggal yang valid (ISO8601)'),
    body('checkOut')
      .optional()
      .isISO8601()
      .withMessage('checkOut harus berupa format tanggal yang valid (ISO8601)'),
  ],
  presensiController.updatePresensi
);

// Search
router.get('/search', verifyToken, presensiController.searchByTanggal);

module.exports = router;