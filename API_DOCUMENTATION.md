# Adopt House API Documentation

Dokumentasi lengkap untuk Adopt House Backend API.

**Base URL:** `http://localhost:3000/api`

---

## 📋 Table of Contents
1. [Authentication](#authentication)
2. [Postings](#postings)
3. [Health Info](#health-info)
4. [Favorites](#favorites)
5. [Error Handling](#error-handling)

---

## Authentication

### 1. Register
Mendaftar user baru (admin atau regular user).

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "testuser",
  "name": "Test User",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201 - Success):**
```json
{
  "status": "success",
  "message": "User berhasil terdaftar",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "testuser",
    "name": "Test User",
    "is_admin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (400 - Validation Error):**
```json
{
  "status": "error",
  "message": "Format email tidak valid"
}
```

**Response (409 - User Already Exists):**
```json
{
  "status": "error",
  "message": "Email atau username sudah terdaftar"
}
```

---

### 2. Login
Login dengan email dan password.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 - Success):**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "username": "testuser",
    "name": "Test User",
    "is_admin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (401 - Invalid Credentials):**
```json
{
  "status": "error",
  "message": "Email atau password salah"
}
```

---

### 3. Logout
Logout user dan invalidate token.

**Endpoint:** `POST /auth/logout`

**Headers:**
```
Authorization: Bearer <TOKEN>
```

**Response (200 - Success):**
```json
{
  "status": "success",
  "message": "Logout berhasil"
}
```

---

## Postings

### 1. Create Posting (Admin Only)
Membuat posting hewan adoption baru dengan 3 foto dan info kesehatan.

**Endpoint:** `POST /postings`

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
```
- name: "Fluffy" (required, string)
- age: "2" (optional, number)
- gender: "male" (optional, string: male/female)
- breed: "Golden Retriever" (optional, string)
- adoption_fee: "500000" (optional, number)
- story: "Anjing yang sangat friendly" (optional, text)
- vaksin: "true" (optional, boolean: true/false)
- sertifikat: "true" (optional, boolean: true/false)
- pictures: [file1, file2, file3] (required, exactly 3 images - jpeg/png/gif/webp, max 5MB each)
```

**Response (201 - Success):**
```json
{
  "status": "success",
  "message": "Posting berhasil dibuat",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "admin_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Fluffy",
    "age": 2,
    "gender": "male",
    "breed": "Golden Retriever",
    "adoption_fee": 500000,
    "story": "Anjing yang sangat friendly",
    "created_at": "2026-05-05T10:30:00.000Z",
    "updated_at": "2026-05-05T10:30:00.000Z",
    "admin": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Test User",
      "username": "testuser"
    },
    "pictures": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "posting_id": "550e8400-e29b-41d4-a716-446655440001",
        "url": "https://adopt-house-storage.s3.ap-southeast-1.amazonaws.com/postings/1715000400000-550e8400-e29b-41d4-a716-446655440001-1.jpg",
        "created_at": "2026-05-05T10:30:00.000Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "posting_id": "550e8400-e29b-41d4-a716-446655440001",
        "url": "https://adopt-house-storage.s3.ap-southeast-1.amazonaws.com/postings/1715000400000-550e8400-e29b-41d4-a716-446655440001-2.jpg",
        "created_at": "2026-05-05T10:30:00.000Z"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440004",
        "posting_id": "550e8400-e29b-41d4-a716-446655440001",
        "url": "https://adopt-house-storage.s3.ap-southeast-1.amazonaws.com/postings/1715000400000-550e8400-e29b-41d4-a716-446655440001-3.jpg",
        "created_at": "2026-05-05T10:30:00.000Z"
      }
    ],
    "health": {
      "id": "550e8400-e29b-41d4-a716-446655440005",
      "posting_id": "550e8400-e29b-41d4-a716-446655440001",
      "vaksin": true,
      "sertifikat": true,
      "created_at": "2026-05-05T10:30:00.000Z",
      "updated_at": "2026-05-05T10:30:00.000Z"
    }
  }
}
```

**Response (400 - Validation Error):**
```json
{
  "status": "error",
  "message": "Harus mengupload tepat 3 foto"
}
```

**Response (403 - Not Admin):**
```json
{
  "status": "error",
  "message": "Hanya admin yang bisa membuat posting"
}
```

---

### 2. Get All Postings
Mendapatkan semua postings (public access, tidak perlu token).

**Endpoint:** `GET /postings`

**Query Parameters:**
```
- limit: number (default: 10)
- offset: number (default: 0)
```

**Response (200 - Success):**
```json
{
  "status": "success",
  "message": "Data postings berhasil diambil",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "admin_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Fluffy",
      "age": 2,
      "gender": "male",
      "breed": "Golden Retriever",
      "adoption_fee": 500000,
      "story": "Anjing yang sangat friendly",
      "created_at": "2026-05-05T10:30:00.000Z",
      "updated_at": "2026-05-05T10:30:00.000Z",
      "admin": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Test User",
        "username": "testuser"
      },
      "pictures": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440002",
          "posting_id": "550e8400-e29b-41d4-a716-446655440001",
          "url": "https://adopt-house-storage.s3.ap-southeast-1.amazonaws.com/postings/...",
          "created_at": "2026-05-05T10:30:00.000Z"
        }
      ],
      "health": {
        "id": "550e8400-e29b-41d4-a716-446655440005",
        "posting_id": "550e8400-e29b-41d4-a716-446655440001",
        "vaksin": true,
        "sertifikat": true,
        "created_at": "2026-05-05T10:30:00.000Z",
        "updated_at": "2026-05-05T10:30:00.000Z"
      }
    }
  ]
}
```

---

### 3. Get Posting by ID
Mendapatkan detail posting tertentu (public access).

**Endpoint:** `GET /postings/:id`

**Response (200 - Success):**
```json
{
  "status": "success",
  "message": "Data posting berhasil diambil",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "admin_id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Fluffy",
    "age": 2,
    "gender": "male",
    "breed": "Golden Retriever",
    "adoption_fee": 500000,
    "story": "Anjing yang sangat friendly",
    "created_at": "2026-05-05T10:30:00.000Z",
    "updated_at": "2026-05-05T10:30:00.000Z",
    "admin": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Test User",
      "username": "testuser"
    },
    "pictures": [...],
    "health": {...}
  }
}
```

**Response (404 - Not Found):**
```json
{
  "status": "error",
  "message": "Posting tidak ditemukan"
}
```

---

### 4. Update Posting (Admin Only)
Update posting (hanya admin yang membuat posting).

**Endpoint:** `PUT /postings/:id`

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Fluffy Updated",
  "age": 3,
  "gender": "male",
  "breed": "Golden Retriever",
  "adoption_fee": 600000,
  "story": "Anjing yang sangat friendly dan sehat"
}
```

**Response (200 - Success):**
```json
{
  "status": "success",
  "message": "Posting berhasil diubah",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Fluffy Updated",
    "age": 3,
    "gender": "male",
    "breed": "Golden Retriever",
    "adoption_fee": 600000,
    "story": "Anjing yang sangat friendly dan sehat",
    "updated_at": "2026-05-05T10:35:00.000Z"
  }
}
```

**Response (403 - Not Owner):**
```json
{
  "status": "error",
  "message": "Hanya admin yang membuat posting ini yang bisa mengubahnya"
}
```

---

### 5. Delete Posting (Admin Only)
Hapus posting dan semua foto nya dari S3 (hanya admin yang membuat posting).

**Endpoint:** `DELETE /postings/:id`

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
```

**Response (200 - Success):**
```json
{
  "status": "success",
  "message": "Posting berhasil dihapus"
}
```

**Response (403 - Not Owner):**
```json
{
  "status": "error",
  "message": "Hanya admin yang membuat posting ini yang bisa menghapusnya"
}
```

---

## Health Info

### 1. Add Health Info (Admin Only)
Menambahkan informasi kesehatan untuk posting.

**Endpoint:** `POST /health/:posting_id`

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "vaksin": true,
  "sertifikat": true
}
```

**Response (201 - Success):**
```json
{
  "status": "success",
  "message": "Health info berhasil ditambahkan",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "posting_id": "550e8400-e29b-41d4-a716-446655440001",
    "vaksin": true,
    "sertifikat": true,
    "created_at": "2026-05-05T10:30:00.000Z",
    "updated_at": "2026-05-05T10:30:00.000Z"
  }
}
```

**Response (409 - Already Exists):**
```json
{
  "status": "error",
  "message": "Health info sudah ada untuk posting ini"
}
```

---

### 2. Update Health Info (Admin Only)
Update informasi kesehatan posting.

**Endpoint:** `PUT /health/:posting_id`

**Headers:**
```
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "vaksin": true,
  "sertifikat": false
}
```

**Response (200 - Success):**
```json
{
  "status": "success",
  "message": "Health info berhasil diubah",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "posting_id": "550e8400-e29b-41d4-a716-446655440001",
    "vaksin": true,
    "sertifikat": false,
    "created_at": "2026-05-05T10:30:00.000Z",
    "updated_at": "2026-05-05T10:30:00.000Z"
  }
}
```

---

### 3. Get Health Info by Posting ID
Mendapatkan informasi kesehatan posting (public access).

**Endpoint:** `GET /health/:posting_id`

**Response (200 - Success):**
```json
{
  "status": "success",
  "message": "Health info berhasil diambil",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "posting_id": "550e8400-e29b-41d4-a716-446655440001",
    "vaksin": true,
    "sertifikat": true,
    "created_at": "2026-05-05T10:30:00.000Z",
    "updated_at": "2026-05-05T10:30:00.000Z"
  }
}
```

**Response (404 - Not Found):**
```json
{
  "status": "error",
  "message": "Health info tidak ditemukan untuk posting ini"
}
```

---

## Favorites

### 1. Add to Favorites (User Only)
Menambahkan posting ke favorites (hanya user non-admin).

**Endpoint:** `POST /favorites`

**Headers:**
```
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "posting_id": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response (201 - Success):**
```json
{
  "status": "success",
  "message": "Posting berhasil ditambahkan ke favorites",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "user_id": "550e8400-e29b-41d4-a716-446655440020",
    "posting_id": "550e8400-e29b-41d4-a716-446655440001",
    "created_at": "2026-05-05T10:40:00.000Z"
  }
}
```

**Response (403 - Admin Not Allowed):**
```json
{
  "status": "error",
  "message": "Hanya user yang bisa menambahkan favorites"
}
```

**Response (409 - Already Favorited):**
```json
{
  "status": "error",
  "message": "Posting sudah ada di favorites"
}
```

---

### 2. Get User Favorites
Mendapatkan semua favorites milik user (user only).

**Endpoint:** `GET /favorites`

**Headers:**
```
Authorization: Bearer <USER_TOKEN>
```

**Query Parameters:**
```
- limit: number (default: 10)
- offset: number (default: 0)
```

**Response (200 - Success):**
```json
{
  "status": "success",
  "message": "Favorites berhasil diambil",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "user_id": "550e8400-e29b-41d4-a716-446655440020",
      "posting_id": "550e8400-e29b-41d4-a716-446655440001",
      "created_at": "2026-05-05T10:40:00.000Z",
      "posting": {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Fluffy",
        "age": 2,
        "gender": "male",
        "breed": "Golden Retriever",
        "adoption_fee": 500000,
        "story": "Anjing yang sangat friendly",
        "pictures": [...],
        "health": {...}
      }
    }
  ]
}
```

---

### 3. Check if Posting is Favorited
Cek apakah posting sudah di-favorite oleh user (user only).

**Endpoint:** `GET /favorites/:posting_id`

**Headers:**
```
Authorization: Bearer <USER_TOKEN>
```

**Response (200 - Yes):**
```json
{
  "status": "success",
  "message": "Posting ada di favorites",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440010",
    "user_id": "550e8400-e29b-41d4-a716-446655440020",
    "posting_id": "550e8400-e29b-41d4-a716-446655440001",
    "created_at": "2026-05-05T10:40:00.000Z"
  }
}
```

**Response (404 - No):**
```json
{
  "status": "error",
  "message": "Posting tidak ada di favorites"
}
```

---

### 4. Remove from Favorites (User Only)
Menghapus posting dari favorites (user only).

**Endpoint:** `DELETE /favorites/:posting_id`

**Headers:**
```
Authorization: Bearer <USER_TOKEN>
```

**Response (200 - Success):**
```json
{
  "status": "success",
  "message": "Posting berhasil dihapus dari favorites"
}
```

**Response (404 - Not Found):**
```json
{
  "status": "error",
  "message": "Posting tidak ada di favorites"
}
```

---

## Error Handling

### Common Error Responses

**401 - Unauthorized (Missing/Invalid Token):**
```json
{
  "status": "error",
  "message": "Token tidak ditemukan atau tidak valid"
}
```

**403 - Forbidden (Insufficient Permissions):**
```json
{
  "status": "error",
  "message": "Anda tidak memiliki akses untuk melakukan aksi ini"
}
```

**404 - Not Found:**
```json
{
  "status": "error",
  "message": "Resource tidak ditemukan"
}
```

**409 - Conflict:**
```json
{
  "status": "error",
  "message": "Resource sudah ada atau sudah digunakan"
}
```

**500 - Internal Server Error:**
```json
{
  "status": "error",
  "message": "Terjadi kesalahan pada server",
  "error": "Error message details"
}
```

---

## Authentication Details

### JWT Token Format
Token akan dikirim dalam header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration
Token berlaku selama **7 hari** (`JWT_EXPIRE=7d`).

### Admin vs User
- **Admin** (`is_admin: true`): Bisa create/update/delete postings
- **User** (`is_admin: false`): Bisa add/remove favorites

---

## File Upload Constraints

### Picture Upload
- **Allowed Types:** JPEG, PNG, GIF, WebP
- **Max File Size:** 5MB per file
- **Required Count:** Exactly 3 files per posting
- **Storage:** AWS S3 (adopt-house-storage bucket)

---

## Quick Start Examples

### 1. Register & Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "name": "Admin User",
    "password": "admin123",
    "confirmPassword": "admin123"
  }'

# Copy token dari response, gunakan untuk request berikutnya
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Create Posting with Images
```bash
curl -X POST http://localhost:3000/api/postings \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Fluffy" \
  -F "age=2" \
  -F "gender=male" \
  -F "breed=Golden Retriever" \
  -F "adoption_fee=500000" \
  -F "story=Anjing yang sangat friendly" \
  -F "vaksin=true" \
  -F "sertifikat=true" \
  -F "pictures=@photo1.jpg" \
  -F "pictures=@photo2.jpg" \
  -F "pictures=@photo3.jpg"
```

### 3. Get All Postings
```bash
curl -X GET http://localhost:3000/api/postings
```

---

## Support

Untuk pertanyaan atau issues, hubungi tim development.
