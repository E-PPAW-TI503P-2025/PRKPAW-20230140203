const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // ambil token dari header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // format: Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan' });
  }

  // verifikasi token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid' });
    }

    // simpan data user di request
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
