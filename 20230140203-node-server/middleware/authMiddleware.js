const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("AUTH HEADER:", authHeader); // ✅ debug

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header tidak ada" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT ERROR:", err.message);
      return res.status(403).json({ message: "Token tidak valid" });
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
