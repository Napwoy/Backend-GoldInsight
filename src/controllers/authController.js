const supabase = require('../config/supabase');
const { createClient } = require('@supabase/supabase-js');

/**
 * Controller untuk Registrasi User Baru
 */
const registerUser = async (req, res) => {
  try {
    const { email, password, name, address } = req.body;

    // Validasi input dasar
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi!',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password harus minimal 6 karakter!',
      });
    }

    // Melakukan pendaftaran menggunakan Supabase Auth SDK
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
          address: address || '',
        },
      },
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil! Silakan cek email Anda untuk konfirmasi (jika diaktifkan di Supabase) atau silakan langsung login.',
      user: data.user,
    });
  } catch (error) {
    console.error('Error register:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat registrasi.',
      error: error.message,
    });
  }
};

/**
 * Controller untuk Login User
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validasi input dasar
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email dan password wajib diisi!',
      });
    }

    // Melakukan login menggunakan Supabase Auth SDK
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login berhasil!',
      token: data.session.access_token, // Kirimkan token ini ke frontend
      user: data.user,
    });
  } catch (error) {
    console.error('Error login:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat login.',
      error: error.message,
    });
  }
};

/**
 * Controller untuk mendapatkan data profil user aktif
 */
const getProfile = async (req, res) => {
  try {
    // Data user sudah terisi di authMiddleware
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error('Error get profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mengambil profil.',
      error: error.message,
    });
  }
};

/**
 * Controller untuk mengupdate data profil & password user
 */
const updateProfile = async (req, res) => {
  try {
    const { email, password, name, address } = req.body;
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid atau tidak ditemukan.',
      });
    }

    const token = authHeader.split(' ')[1];

    const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder';

    const updateData = {};
    if (email) updateData.email = email;
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password harus minimal 6 karakter!',
        });
      }
      updateData.password = password;
    }
    
    // Update user metadata (name, address)
    if (name || address) {
      updateData.data = {};
      if (name) updateData.data.name = name;
      if (address) updateData.data.address = address;
    }

    // Call Supabase Auth REST API directly to bypass "Auth session missing" error
    // when using the JS SDK without an established session.
    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'apikey': supabaseAnonKey
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        message: data.msg || data.message || 'Gagal memperbarui profil.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui!',
      user: data,
    });
  } catch (error) {
    console.error('Error update profile:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server saat mengupdate profil.',
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
};
