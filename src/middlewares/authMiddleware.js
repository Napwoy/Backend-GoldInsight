const supabase = require('../config/supabase');

/**
 * Middleware untuk memvalidasi token JWT dari Supabase
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Cek apakah header Authorization dikirimkan
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Akses ditolak! Token tidak ditemukan atau format salah (Gunakan format: Bearer <token>).',
      });
    }

    // Ekstrak token JWT
    const token = authHeader.split(' ')[1];

    // Verifikasi token menggunakan Supabase Auth SDK
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        message: 'Sesi tidak valid atau telah kedaluwarsa. Silakan login kembali.',
        error: error ? error.message : null,
      });
    }

    // Pasang objek user hasil verifikasi ke request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada verifikasi token.',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
