# Authentication Portal REST API - PT Widya Informasi Nusantara (Widya Robotics)

REST API Portal Autentikasi untuk Knowledge Test Software Engineer PT Widya Informasi Nusantara. Dibangun menggunakan **Express.js (JavaScript murni)**, **PostgreSQL**, dan **Knex.js** sebagai SQL Query Builder & Migration Tool.

---

## 📋 Daftar Isi
1. [Fitur & Pemenuhan Kebutuhan](#-fitur--pemenuhan-kebutuhan)
2. [Arsitektur & Desain Aplikasi](#-arsitektur--desain-aplikasi)
3. [Tech Stack](#-tech-stack)
4. [Struktur Direktori](#-struktur-direktori)
5. [Prasyarat Sistem](#-prasyarat-sistem)
6. [Panduan Menjalankan di Local](#-panduan-menjalankan-di-local)
7. [Dokumentasi API](#-dokumentasi-api)
8. [Automated Testing](#-automated-testing)
9. [Deployment Guide (VPS / Heroku / Cloud)](#-deployment-guide)

---

## 🎯 Fitur & Pemenuhan Kebutuhan

Sesuai dengan spesifikasi tugas:
- [x] **Pembuatan Akun (Register)**: Menerima data nama (`name`), email (`email`), password (`password`), dan jenis kelamin (`gender`).
- [x] **Validasi Input**: Validasi schema menggunakan Joi (format email, panjang password min. 6 karakter, enum gender).
- [x] **Hashing Password Aman**: Password di-hash menggunakan algoritma `bcryptjs` dengan salt round 10 sebelum disimpan ke database.
- [x] **Pencegahan Email Duplikat**: Memberikan respon HTTP 409 Conflict jika email sudah terdaftar.
- [x] **Login Akun**: Otentikasi email dan password, menghasilkan token **JSON Web Token (JWT)** berjangka waktu (default 24 jam).
- [x] **Penyimpanan Data di Database**: Menggunakan database relasional **PostgreSQL** dengan skema migrasi dan seeder via **Knex.js**.
- [x] **Akses Profil User (Protected Endpoint)**: Endpoint profil hanya dapat diakses dengan menyertakan token JWT pada header `Authorization: Bearer <token>`, mengembalikan response dalam format JSON standar.
- [x] **Dokumentasi API (Nilai Tambah)**: Swagger UI interaktif di `/api-docs` dan file `postman_collection.json`.
- [x] **Automated Unit & Integration Test**: Pengujian end-to-end menggunakan **Jest** dan **Supertest**.
- [x] **Docker Ready (Nilai Tambah)**: Tersedia `docker-compose.yml` untuk PostgreSQL dan `Dockerfile` untuk deployment container.

---

## 🏗 Arsitektur & Desain Aplikasi

Aplikasi ini mengadopsi pola **Layered Architecture (N-Tier Architecture)** untuk memisahkan tanggung jawab kode (*Separation of Concerns*) dan memudahkan perawatan (*maintainability*):

```
Client (HTTP Request)
         │
         ▼
[Middlewares] ──► CORS, Helmet, Morgan, Joi Validator, JWT Authenticator
         │
         ▼
[Routes] ────────► Mendefinisikan endpoint URL & pemetaan controller
         │
         ▼
[Controllers] ───► Menerima HTTP request, memanggil service, mengembalikan HTTP response
         │
         ▼
[Services] ──────► Berisi Business Logic (verifikasi password, sign JWT, rule validasi bisnis)
         │
         ▼
[Repositories] ──► Abstraksi database query menggunakan Knex.js
         │
         ▼
[PostgreSQL Database]
```

### Standar Format Response JSON
Seluruh response API distandarisasi menggunakan class helper `ApiResponse`:

**Format Berhasil (Success):**
```json
{
  "success": true,
  "message": "Pesan deskripsi aksi",
  "data": { ... }
}
```

**Format Gagal (Error):**
```json
{
  "success": false,
  "message": "Pesan deskripsi kesalahan",
  "errors": [ ... ] // Opsional (misal: rincian validasi input)
}
```

---

## 💻 Tech Stack

- **Runtime & Bahasa**: Node.js, JavaScript (CommonJS)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Query Builder & Migrations**: Knex.js (`pg` driver)
- **Autentikasi & Keamanan**:
  - `jsonwebtoken` (JWT sign & verify)
  - `bcryptjs` (Password hashing)
  - `helmet` (HTTP security headers)
  - `cors` (Cross-Origin Resource Sharing)
- **Validasi Data**: `joi`
- **Dokumentasi**: `swagger-ui-express`, `yamljs` (OpenAPI 3.0)
- **Testing**: `jest`, `supertest`

---

## 📁 Struktur Direktori

```text
test-interview/
├── .env.example              # Template variabel lingkungan
├── .gitignore                # File abaian git
├── Dockerfile                # Dockerfile untuk containerization
├── docker-compose.yml        # Docker compose untuk PostgreSQL
├── knexfile.js               # Konfigurasi database Knex (dev, test, prod)
├── package.json              # Konfigurasi dependency & script
├── postman_collection.json   # Koleksi Postman API siap import
├── README.md                 # Dokumentasi proyek
├── src/
│   ├── config/
│   │   ├── database.js       # Inisialisasi koneksi Knex
│   │   └── env.js            # Sentralisasi konfigurasi .env
│   ├── controllers/
│   │   ├── authController.js # Handler HTTP untuk register & login
│   │   └── userController.js # Handler HTTP untuk profile user
│   ├── database/
│   │   ├── migrations/       # File migrasi DDL tabel users
│   │   └── seeds/            # Seeder data pengguna awal
│   ├── docs/
│   │   ├── openapi.yaml      # Spesifikasi OpenAPI 3.0
│   │   └── swagger.js        # Konfigurasi Swagger UI
│   ├── middlewares/
│   │   ├── authMiddleware.js # Verifikasi JWT token (Bearer)
│   │   ├── errorMiddleware.js# 404 handler & centralized error handler
│   │   └── validationMiddleware.js # Wrapper validasi schema Joi
│   ├── repositories/
│   │   └── userRepository.js # Query database Knex ke tabel users
│   ├── routes/
│   │   ├── authRoutes.js     # Routing /api/v1/auth
│   │   ├── userRoutes.js     # Routing /api/v1/users
│   │   └── index.js          # Main router & health check
│   ├── services/
│   │   ├── authService.js    # Logika bisnis autentikasi
│   │   └── userService.js    # Logika bisnis user
│   ├── utils/
│   │   ├── apiResponse.js    # Standarisasi respon JSON
│   │   ├── jwt.js            # Generator & verifikator token JWT
│   │   └── password.js       # Hash & komparasi password bcrypt
│   ├── validations/
│   │   └── authValidation.js # Schema validasi request Joi
│   ├── app.js                # Definisi & middleware Express app
│   └── server.js             # Entrypoint server (listener)
└── tests/
    ├── api.test.js           # Integration test endpoint HTTP
    └── utils.test.js         # Unit test helper JWT & bcrypt
```

---

## ⚙️ Prasyarat Sistem

- **Node.js** v18+ (atau v20+)
- **NPM** v9+
- **PostgreSQL** v14+ atau **Docker & Docker Compose**

---

## 🚀 Panduan Menjalankan di Local

### 1. Clone Repositori
```bash
git clone <URL_GIT_REPOSITORY>
cd test-interview
```

### 2. Install Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env`)
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```
Sesuaikan konfigurasi database jika diperlukan:
```ini
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=widya_auth_db

JWT_SECRET=super_secret_jwt_key_widya_robotics_2026
JWT_EXPIRES_IN=24h
```

### 4. Menjalankan Database PostgreSQL
**Pilihan A: Menggunakan Docker Compose (Sangat direkomendasikan)**
```bash
docker-compose up -d
```
*Perintah ini akan menyalakan container PostgreSQL `widya_postgres` pada port 5432.*

**Pilihan B: Menggunakan PostgreSQL Lokal yang Terinstall di Komputer**
Pastikan service PostgreSQL berjalan dan buat database bernama `widya_auth_db`:
```sql
CREATE DATABASE widya_auth_db;
```

### 5. Menjalankan Migrasi Database & Seeder
Jalankan migrasi tabel `users`:
```bash
npm run migrate
```

*(Opsional)* Jalankan seeder untuk mengisi data user dummy untuk testing:
```bash
npm run seed
```
> Data user bawaan seeder:
> - Email: `user@widya.ai` | Password: `password123`
> - Email: `engineer@widya.ai` | Password: `password123`

### 6. Menjalankan Server
**Mode Development (dengan Hot Reload nodemon):**
```bash
npm run dev
```

**Mode Production:**
```bash
npm start
```
Server akan aktif di: **`http://localhost:3000`**

---

## 📑 Dokumentasi API

### 1. Swagger UI Interaktif (Web Browser)
Buka browser dan kunjungi:
👉 **`http://localhost:3000/api-docs`**

Anda dapat langsung mencoba semua endpoint (Register, Login, Authorize dengan Token Bearer, dan Get Profile) secara interaktif langsung dari antarmuka Swagger UI.

### 2. Postman Collection
Import file **`postman_collection.json`** yang ada di root direktori proyek ke Postman.
Koleksi ini sudah dilengkapi script otomatis untuk menyimpan token JWT ke environment variable saat Anda melakukan login!

### 3. Ringkasan Endpoint

| No | Method | Endpoint | Proteksi | Deskripsi |
|:---|:---|:---|:---|:---|
| 1 | `GET` | `/api/v1/health` | Public | Cek kesehatan server dan database |
| 2 | `POST` | `/api/v1/auth/register` | Public | Pendaftaran user baru |
| 3 | `POST` | `/api/v1/auth/login` | Public | Login akun & mendapatkan JWT token |
| 4 | `GET` | `/api/v1/users/profile` | Bearer JWT | Mengambil profil user yang sedang login |
| 5 | `GET` | `/api/v1/profile` | Bearer JWT | Alias langsung untuk endpoint profil |

#### Contoh Request & Response:

#### A. Registrasi Akun
`POST /api/v1/auth/register`
```json
// Request Body:
{
  "name": "Budi Santoso",
  "email": "budi.santoso@widya.ai",
  "password": "Password123!",
  "gender": "laki-laki"
}

// Response (201 Created):
{
  "success": true,
  "message": "Registrasi berhasil. Akun Anda telah dibuat",
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi.santoso@widya.ai",
    "gender": "laki-laki",
    "created_at": "2026-11-01T12:00:00.000Z",
    "updated_at": "2026-11-01T12:00:00.000Z"
  }
}
```

#### B. Login
`POST /api/v1/auth/login`
```json
// Request Body:
{
  "email": "budi.santoso@widya.ai",
  "password": "Password123!"
}

// Response (200 OK):
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Budi Santoso",
      "email": "budi.santoso@widya.ai",
      "gender": "laki-laki"
    }
  }
}
```

#### C. Get Profile
`GET /api/v1/users/profile`  
*Header:* `Authorization: Bearer <token_jwt>`
```json
// Response (200 OK):
{
  "success": true,
  "message": "Data profile user berhasil diambil",
  "data": {
    "id": 1,
    "name": "Budi Santoso",
    "email": "budi.santoso@widya.ai",
    "gender": "laki-laki",
    "created_at": "2026-11-01T12:00:00.000Z",
    "updated_at": "2026-11-01T12:00:00.000Z"
  }
}
```

---

## 🧪 Automated Testing

Aplikasi ini dilengkapi pengujian otomatis dengan **Jest** dan **Supertest** mencakup unit test dan integration test (validasi, autentikasi, status code, error handling).

Jalankan perintah pengujian:
```bash
npm test
```

Hasil pengujian:
- ✅ Unit test hashing bcrypt & verifikasi
- ✅ Unit test pembuatan token JWT & verifikasi
- ✅ Integration test validasi request (missing fields, format email salah)
- ✅ Integration test deteksi email duplikat (409 Conflict)
- ✅ Integration test registrasi user berhasil (201 Created)
- ✅ Integration test login gagal jika kredensial salah (401 Unauthorized)
- ✅ Integration test proteksi rute profil (401 jika tanpa token / token tidak valid)
- ✅ Integration test akses profil berhasil dengan token valid (200 OK)

---

## 🌐 Deployment Guide

Aplikasi telah dirancang agar *cloud-ready* dan dapat dideploy ke berbagai platform (Heroku, Railway, Render, VPS, AWS EC2):

1. **Variabel Lingkungan di Cloud:**
   - Atur `NODE_ENV=production`
   - Atur `PORT` (otomatis disediakan oleh Heroku / Railway / Render)
   - Atur `DATABASE_URL` (URL koneksi PostgreSQL yang disediakan oleh penyedia cloud database)
   - Atur `DB_SSL=true` jika penyedia cloud database mewajibkan SSL
   - Atur `JWT_SECRET` dengan string rahasia yang kuat

2. **Migrasi Otomatis saat Deploy:**
   Tambahkan release command atau jalankan di console platform cloud:
   ```bash
   npm run migrate
   ```

3. **Deploy via Docker:**
   Gunakan file `Dockerfile` yang telah disediakan di root proyek untuk membangun image dan menjalankan container pada server VPS.
