const { verifyToken } = require('../utils/jwt');
const ApiResponse = require('../utils/apiResponse');
const userRepository = require('../repositories/userRepository');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ApiResponse.error(
        res,
        'Akses ditolak. Token autentikasi tidak ditemukan pada header Authorization (Bearer <token>)',
        401
      );
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return ApiResponse.error(res, 'Token autentikasi tidak valid atau kosong', 401);
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return ApiResponse.error(res, 'Sesi telah berakhir (Token expired). Silakan login kembali', 401);
      }
      return ApiResponse.error(res, 'Token tidak valid atau telah dirusak', 401);
    }

    const user = await userRepository.findById(decoded.id);
    if (!user) {
      return ApiResponse.error(res, 'User dari token ini sudah tidak terdaftar', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    return ApiResponse.error(res, 'Terjadi kesalahan pada verifikasi autentikasi', 500);
  }
};

module.exports = authenticate;
