const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const presensiController = require('../controllers/presensiController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/check-in', [authenticateToken, presensiController.upload.single('image')], presensiController.CheckIn);
router.post('/check-out', authenticateToken, presensiController.CheckOut);
router.delete('/:id', authenticateToken, presensiController.deletePresensi);

router.put(
  '/:id',
  authenticateToken,
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

router.get('/search', authenticateToken, presensiController.searchByTanggal);

module.exports = router;
