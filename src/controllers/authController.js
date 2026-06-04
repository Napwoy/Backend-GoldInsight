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

    // Create a user-scoped Supabase client using the provided token
    // This allows us to securely call updateUser on behalf of the user
    const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'placeholder';
    
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    });

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
      // Fetch existing metadata to merge it properly if needed, but updating 'data' merges by default
      updateData.data = {};
      if (name) updateData.data.name = name;
      if (address) updateData.data.address = address;
    }

    // Call Supabase Auth to update user
    const { data, error } = await userClient.auth.updateUser(updateData);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Profil berhasil diperbarui!',
      user: data.user,
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
