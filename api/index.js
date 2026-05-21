const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('../src/routes/authRoutes');

const app = express();

// Konfigurasi CORS agar frontend teman Anda bisa mengakses backend ini
app.use(cors({
  origin: '*', // Izinkan semua origin (sangat membantu saat development & testing)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parser untuk request body bertipe JSON
app.use(express.json());

// Rute dasar (Health Check)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Capstone Project Express.js Backend API! 🚀',
    status: 'Server is active and running',
    version: '1.0.0'
  });
});

// Menghubungkan rute autentikasi
app.use('/api/auth', authRoutes);

// Penanganan rute 404 (Not Found)
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Rute tidak ditemukan!'
  });
});

// Penanganan global error
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan internal server!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Jalankan server jika dijalankan secara lokal (bukan sebagai serverless function di Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server berjalan lokal di http://localhost:${PORT}`);
  });
}

// Export aplikasi Express untuk Vercel Serverless Function
module.exports = app;
