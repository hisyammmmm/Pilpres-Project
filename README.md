# Dokumentasi API Sistem Voting

REST API untuk sistem voting yang dibangun dengan Node.js, Express, dan MySQL menggunakan Sequelize ORM.

## 🌍 URL Dasar
```
https://voting-backend-691768696804.us-central1.run.app/
```

## 🔧 Teknologi yang Digunakan
- **Backend:** Node.js, Express.js
- **Database:** MySQL dengan Sequelize ORM
- **Autentikasi:** JWT (Access Token & Refresh Token)
- **Upload File:** Multer (penyimpanan lokal)
- **Enkripsi Password:** bcrypt

## 📋 Daftar Isi
- [Autentikasi](#autentikasi)
- [Kandidat](#kandidat)
- [Voting](#voting)
- [Response Error](#response-error)
- [Skema Database](#skema-database)

---

## 🔐 Autentikasi

### Daftar Pengguna
**POST** `/register`

Mendaftarkan akun pengguna baru.

**Request Body:**
```json
{
  "nik": "1234567890123456",
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "id": 1,
  "nik": "1234567890123456",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Masuk (Login)
**POST** `/login`

Autentikasi pengguna dan mendapatkan access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Catatan:** Refresh token otomatis disimpan sebagai HTTP-only cookie.

### Keluar (Logout)
**DELETE** `/logout`

Logout pengguna dan menghapus token.

**Response (200):** Hanya status code

---

## 👥 Kandidat

### Ambil Semua Kandidat
**GET** `/candidates`

Mengambil semua kandidat beserta gambarnya.

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Nama Kandidat",
    "description": "Deskripsi dan visi kandidat",
    "image": "https://b-05-450916.uc.r.appspot.com/uploads/1234567890-123456789.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### Buat Kandidat Baru
**POST** `/candidates`

Membuat kandidat baru. **Khusus Admin**.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (string, wajib): Nama kandidat
- `description` (string, wajib): Deskripsi kandidat
- `image` (file, opsional): Foto kandidat (jpg, jpeg, png, gif - maksimal 2MB)

**Response (201):**
```json
{
  "id": 1,
  "name": "Kandidat Baru",
  "description": "Deskripsi kandidat",
  "image": "1234567890-123456789.jpg",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Update Kandidat
**PATCH** `/candidates/:id`

Mengupdate kandidat yang sudah ada. **Khusus Admin**.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Form Data:**
- `name` (string, opsional): Nama kandidat yang diperbarui
- `description` (string, opsional): Deskripsi yang diperbarui
- `image` (file, opsional): Foto kandidat baru

**Response (200):**
```json
{
  "msg": "Candidate updated"
}
```

### Hapus Kandidat
**DELETE** `/candidates/:id`

Menghapus kandidat. **Khusus Admin**.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
{
  "msg": "Candidate deleted"
}
```

---

## 🗳️ Voting

### Memberikan Suara
**POST** `/vote`

Memberikan suara untuk kandidat. **Khusus pengguna yang sudah login**. Setiap pengguna hanya bisa voting sekali.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "candidateId": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "userId": 1,
  "candidateId": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Ambil Semua Suara
**GET** `/votes`

Mengambil semua data voting beserta informasi kandidat dan pengguna. **Khusus pengguna yang sudah login**.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200):**
```json
[
  {
    "id": 1,
    "userId": 1,
    "candidateId": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z",
    "candidate": {
      "id": 1,
      "name": "Nama Kandidat",
      "image": "candidate-image.jpg"
    },
    "User": {
      "id": 1,
      "name": "Nama Pemilih"
    }
  }
]
```

---

## ❌ Response Error

### Kode Error Umum
- **400**: Bad Request - Data input tidak valid
- **401**: Unauthorized - Access token hilang atau tidak valid
- **403**: Forbidden - Hak akses tidak mencukupi atau pengguna sudah voting
- **404**: Not Found - Resource tidak ditemukan
- **500**: Internal Server Error - Error server

### Format Response Error
```json
{
  "msg": "Deskripsi pesan error"
}
```

### Kasus Error Spesifik

#### Error Autentikasi
```json
// Kredensial tidak valid
{
  "msg": "User not found"
}

{
  "msg": "Wrong password"
}
```

#### Error Otorisasi
```json
// Akses ditolak untuk endpoint khusus admin
{
  "msg": "Access denied"
}

// Pengguna sudah melakukan voting
{
  "msg": "User already voted"
}
```

#### Error Validasi
```json
// Error upload file
{
  "msg": "Hanya file gambar (jpg, jpeg, png, gif) yang diizinkan"
}
```

---

## 🗄️ Skema Database

### Tabel Users (Pengguna)
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nik VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role VARCHAR(255) DEFAULT 'user',
  refresh_token TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Tabel Candidates (Kandidat)
```sql
CREATE TABLE candidates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255),
  description TEXT,
  image VARCHAR(255),
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Tabel Votes (Suara)
```sql
CREATE TABLE votes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT UNIQUE,
  candidateId INT,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (candidateId) REFERENCES candidates(id)
);
```

---

## 🔑 Alur Autentikasi

1. **Daftar**: Buat akun dengan POST `/register`
2. **Login**: Dapatkan access token dengan POST `/login`
3. **Akses Route Terproteksi**: Sertakan header `Authorization: Bearer <token>`
4. **Kadaluarsa Token**: Access token berlaku selama 30 menit
5. **Refresh**: Refresh token berlaku selama 1 hari (diatur melalui HTTP-only cookies)
6. **Logout**: Hapus token dengan DELETE `/logout`

---

## 📝 Contoh Penggunaan

### Menggunakan curl

#### Mendaftar pengguna baru
```bash
curl -X POST https://voting-backend-691768696804.us-central1.run.app/register \
  -H "Content-Type: application/json" \
  -d '{
    "nik": "1234567890123456",
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Login
```bash
curl -X POST https://voting-backend-691768696804.us-central1.run.app/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

#### Ambil data kandidat
```bash
curl https://voting-backend-691768696804.us-central1.run.app/candidates
```

#### Memberikan suara
```bash
curl -X POST https://voting-backend-691768696804.us-central1.run.app/vote \
  -H "Authorization: Bearer ACCESS_TOKEN_ANDA" \
  -H "Content-Type: application/json" \
  -d '{"candidateId": 1}'
```

#### Membuat kandidat baru (Khusus Admin)
```bash
curl -X POST https://voting-backend-691768696804.us-central1.run.app/candidates \
  -H "Authorization: Bearer ACCESS_TOKEN_ADMIN_ANDA" \
  -F "name=Kandidat Baru" \
  -F "description=Deskripsi kandidat" \
  -F "image=@foto-kandidat.jpg"
```

---

## 🚀 Panduan Memulai

1. Pastikan Anda memiliki akun pengguna (daftar terlebih dahulu)
2. Login untuk mendapatkan access token
3. Gunakan token di header Authorization untuk endpoint yang terproteksi
4. Pengguna admin dapat mengelola kandidat
5. Pengguna biasa dapat melihat kandidat dan memberikan suara

## 📄 Catatan Penting

- Setiap pengguna hanya bisa voting sekali (dipaksa oleh unique constraint pada userId di tabel votes)
- Gambar disimpan secara lokal di direktori `uploads/`
- Format gambar yang didukung: JPG, JPEG, PNG, GIF (maksimal 2MB)
- Role admin diperlukan untuk operasi pengelolaan kandidat
- Access token berlaku selama 30 menit, refresh token selama 1 hari

## 🔒 Keamanan

- Password di-hash menggunakan bcrypt
- Menggunakan JWT untuk autentikasi
- Refresh token disimpan sebagai HTTP-only cookie
- Validasi input pada semua endpoint
- Proteksi file upload dengan filter tipe file

## 📊 Fitur Utama

- **Sistem Autentikasi Lengkap**: Register, login, logout dengan JWT
- **Manajemen Kandidat**: CRUD operations untuk admin
- **Sistem Voting**: Setiap user hanya bisa vote sekali
- **Upload Gambar**: Untuk foto kandidat dengan validasi
- **Role-Based Access**: Pembedaan hak akses admin dan user
- **Database Relasional**: Dengan foreign key constraints
