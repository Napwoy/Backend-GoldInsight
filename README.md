# 🌟 GoldInsight Backend 🌟

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

> **Robust, secure, and scalable REST API for the GoldInsight project.** 🚀

Backend ini dikembangkan menggunakan arsitektur modern berbasis **Express.js** dan memanfaatkan **Supabase Auth** untuk autentikasi dan manajemen akses pengguna yang aman dan mulus.

---

## 🎯 Fitur Utama

- **🔐 Autentikasi Super Aman:** Integrasi mulus dengan SDK Supabase Auth.
- **⚡ Kinerja Tinggi & Ringan:** Dibangun di atas fondasi Express.js yang sangat cepat.
- **☁️ Siap Serverless:** Sudah dikonfigurasi secara _out-of-the-box_ untuk deploy di Vercel (didukung file `vercel.json`).
- **🛡️ Terproteksi & Modular:** Rute dan endpoint yang dipisahkan secara rapi lengkap dengan _middleware_ untuk memfilter akses (_Protected Routes_).

---

## 🛠️ Teknologi yang Digunakan

- **Runtime:** Node.js (>= 18)
- **Framework:** Express.js
- **Database & Auth:** Supabase (PostgreSQL & GoTrue)
- **Environment:** dotenv (untuk manajemen *secrets*)
- **Keamanan:** cors (konfigurasi lintas-domain)
- **Development Tool:** nodemon (untuk *live reload* saat coding)

---

## 🚀 Cara Menjalankan Project (Local)

1. **Clone repository ini**
   ```bash
   git clone https://github.com/Napwoy/Backend-GoldInsight.git
   cd Backend-GoldInsight
   ```

2. **Install semua dependensi**
   ```bash
   npm install
   ```

3. **Atur Variabel Lingkungan (.env)**
   Buat file bernama `.env` di root folder dan isi dengan kredensial Supabase Anda:
   ```env
   PORT=5000
   SUPABASE_URL=https://<project-id>.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR...
   ```

4. **Jalankan Server Development**
   ```bash
   npm run dev
   ```
   > Server akan berjalan secara lokal di `http://localhost:5000` dan akan otomatis restart jika ada perubahan file!

---

## 📡 API Endpoints

Berikut adalah daftar endpoint yang bisa dites via **Postman**:

| Metode | Endpoint               | Deskripsi                                 | Butuh Token? |
|--------|------------------------|-------------------------------------------|--------------|
| `GET`  | `/`                    | Health check & Status Server API          | ❌ Tidak      |
| `POST` | `/api/auth/register`   | Mendaftarkan akun baru                    | ❌ Tidak      |
| `POST` | `/api/auth/login`      | Login pengguna dan dapatkan token         | ❌ Tidak      |
| `GET`  | `/api/auth/me`         | Mengambil detail profil user yang login   | ✅ Ya (Bearer)|

### Contoh Payload Login & Register:
```json
{
  "email": "user@example.com",
  "password": "secretpassword"
}
```

---

## 📂 Struktur Folder
```text
📦 Backend-GoldInsight
 ┣ 📂 api               # (Entry point untuk Vercel Serverless)
 ┃ ┗ 📜 index.js
 ┣ 📂 src
 ┃ ┣ 📂 config          # (Konfigurasi eksternal, ex: Supabase client)
 ┃ ┣ 📂 controllers     # (Logika utama di balik setiap rute endpoint)
 ┃ ┣ 📂 middlewares     # (Fungsi penengah seperti verifikasi token)
 ┃ ┗ 📂 routes          # (Definisi daftar endpoint API)
 ┣ 📜 .env.example
 ┣ 📜 vercel.json       # (Pengaturan build & deploy Vercel)
 ┗ 📜 package.json
```

---

*Dibuat untuk Capstone Project dengan penuh dedikasi. Happy Coding! ☕*
