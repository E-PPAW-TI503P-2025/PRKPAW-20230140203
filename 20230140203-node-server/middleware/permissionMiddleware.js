const jwt = require('jsonwebtoken');
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN';

exports.addUserData = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: 'Token tidak ditemukan. Silakan login terlebih dahulu.' 
            });
        }

        const token = authHeader.substring(7);
        
        const decoded = jwt.verify(token, JWT_SECRET);
        
        req.user = {
            id: decoded.id,
            nama: decoded.nama,
            role: decoded.role
        };
        
        console.log(`User authenticated: ${decoded.nama} (ID: ${decoded.id}, Role: ${decoded.role})`);
        next();
        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token tidak valid.' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token telah kadaluarsa. Silakan login kembali.' });
        }
        return res.status(500).json({ 
            message: 'Terjadi kesalahan saat memverifikasi token.',
            error: error.message 
        });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        console.log('Access granted: Admin');
        next();
    } else {
        res.status(403).json({ 
            message: 'Akses ditolak. Hanya admin yang dapat mengakses resource ini.' 
        });
    }
};