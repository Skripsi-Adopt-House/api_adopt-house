# API Testing Guide

## 🧪 Testing dengan Postman atau cURL

### 1. REGISTER USER

**Request:**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "johndoe",
  "name": "John Doe",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response Success (201):**
```json
{
  "status": "success",
  "message": "User berhasil terdaftar",
  "data": {
    "id": "uuid-here",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "is_admin": false,
    "token": "jwt-token-here"
  }
}
```

---

### 2. REGISTER ADMIN USER

**Request:**
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "admin@example.com",
  "username": "admin",
  "name": "Admin User",
  "password": "adminpass123",
  "confirmPassword": "adminpass123"
}
```

**Note:** Buat user, kemudian ubah `is_admin` ke `true` di database secara manual jika diperlukan.

---

### 3. LOGIN

**Request:**
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": {
    "id": "uuid-here",
    "email": "user@example.com",
    "username": "johndoe",
    "name": "John Doe",
    "is_admin": false,
    "token": "jwt-token-here"
  }
}
```

---

### 4. LOGOUT

**Request:**
```
POST http://localhost:3000/api/auth/logout
Authorization: Bearer jwt-token-here
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Logout berhasil"
}
```

---

### 5. GET ALL POSTINGS (Public)

**Request:**
```
GET http://localhost:3000/api/postings
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Data postings berhasil diambil",
  "data": [
    {
      "id": "posting-uuid",
      "admin_id": "admin-uuid",
      "name": "Fluffy",
      "age": 2,
      "gender": "Female",
      "breed": "Persian Cat",
      "adoption_fee": "500000",
      "story": "Friendly and playful cat",
      "created_at": "2026-05-02T10:00:00.000Z",
      "updated_at": "2026-05-02T10:00:00.000Z",
      "admin": {
        "id": "admin-uuid",
        "name": "Admin User",
        "username": "admin"
      },
      "pictures": [
        {
          "id": "pic-uuid-1",
          "posting_id": "posting-uuid",
          "url": "https://bucket.s3.amazonaws.com/postings/...",
          "created_at": "2026-05-02T10:00:00.000Z",
          "updated_at": "2026-05-02T10:00:00.000Z"
        }
      ],
      "health": {
        "id": "health-uuid",
        "posting_id": "posting-uuid",
        "vaksin": true,
        "sertifikat": "https://...",
        "created_at": "2026-05-02T10:00:00.000Z",
        "updated_at": "2026-05-02T10:00:00.000Z"
      }
    }
  ]
}
```

---

### 6. CREATE POSTING (Admin Only)

**Request:**
```
POST http://localhost:3000/api/postings
Authorization: Bearer admin-jwt-token
Content-Type: multipart/form-data

Form Data:
- name: "Fluffy"
- age: 2
- gender: "Female"
- breed: "Persian Cat"
- adoption_fee: 500000
- story: "Friendly and playful cat"
- pictures: [file1.jpg, file2.jpg, file3.jpg] (exactly 3 files)
```

**Response Success (201):**
```json
{
  "status": "success",
  "message": "Posting berhasil dibuat",
  "data": {
    "id": "posting-uuid",
    "admin_id": "admin-uuid",
    "name": "Fluffy",
    "age": 2,
    "gender": "Female",
    "breed": "Persian Cat",
    "adoption_fee": "500000",
    "story": "Friendly and playful cat",
    "created_at": "2026-05-02T10:00:00.000Z",
    "updated_at": "2026-05-02T10:00:00.000Z",
    "admin": {
      "id": "admin-uuid",
      "name": "Admin User",
      "username": "admin"
    },
    "pictures": [
      {
        "id": "pic-uuid",
        "posting_id": "posting-uuid",
        "url": "https://bucket.s3.amazonaws.com/postings/...",
        "created_at": "2026-05-02T10:00:00.000Z",
        "updated_at": "2026-05-02T10:00:00.000Z"
      }
    ],
    "health": null
  }
}
```

---

### 7. UPDATE POSTING (Admin Only)

**Request:**
```
PUT http://localhost:3000/api/postings/posting-uuid
Authorization: Bearer admin-jwt-token
Content-Type: application/json

{
  "name": "Fluffy Updated",
  "age": 3,
  "adoption_fee": 450000
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Posting berhasil diubah",
  "data": {
    "id": "posting-uuid",
    ...updated fields...
  }
}
```

---

### 8. DELETE POSTING (Admin Only)

**Request:**
```
DELETE http://localhost:3000/api/postings/posting-uuid
Authorization: Bearer admin-jwt-token
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Posting berhasil dihapus"
}
```

---

### 9. ADD HEALTH INFO (Admin Only)

**Request:**
```
POST http://localhost:3000/api/health/posting-uuid
Authorization: Bearer admin-jwt-token
Content-Type: application/json

{
  "vaksin": true,
  "sertifikat": "https://certificate-url.com/cert.pdf"
}
```

**Response Success (201):**
```json
{
  "status": "success",
  "message": "Health info berhasil ditambahkan",
  "data": {
    "id": "health-uuid",
    "posting_id": "posting-uuid",
    "vaksin": true,
    "sertifikat": "https://certificate-url.com/cert.pdf",
    "created_at": "2026-05-02T10:00:00.000Z",
    "updated_at": "2026-05-02T10:00:00.000Z"
  }
}
```

---

### 10. UPDATE HEALTH INFO (Admin Only)

**Request:**
```
PUT http://localhost:3000/api/health/posting-uuid
Authorization: Bearer admin-jwt-token
Content-Type: application/json

{
  "vaksin": false,
  "sertifikat": "https://new-certificate-url.com/cert.pdf"
}
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Health info berhasil diubah",
  "data": {
    "id": "health-uuid",
    ...updated fields...
  }
}
```

---

### 11. GET HEALTH INFO (Public)

**Request:**
```
GET http://localhost:3000/api/health/posting-uuid
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Health info berhasil diambil",
  "data": {
    "id": "health-uuid",
    "posting_id": "posting-uuid",
    "vaksin": true,
    "sertifikat": "https://certificate-url.com/cert.pdf",
    "created_at": "2026-05-02T10:00:00.000Z",
    "updated_at": "2026-05-02T10:00:00.000Z"
  }
}
```

---

### 12. ADD TO FAVORITES (User Only, non-admin)

**Request:**
```
POST http://localhost:3000/api/favorites
Authorization: Bearer user-jwt-token
Content-Type: application/json

{
  "posting_id": "posting-uuid"
}
```

**Response Success (201):**
```json
{
  "status": "success",
  "message": "Posting berhasil ditambahkan ke favorit",
  "data": {
    "id": "favorite-uuid",
    "user_id": "user-uuid",
    "posting_id": "posting-uuid"
  }
}
```

---

### 13. GET MY FAVORITES (User Only)

**Request:**
```
GET http://localhost:3000/api/favorites
Authorization: Bearer user-jwt-token
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Daftar favorit berhasil diambil",
  "data": [
    {
      "id": "favorite-uuid",
      "user_id": "user-uuid",
      "posting_id": "posting-uuid",
      "posting": {
        "id": "posting-uuid",
        "admin_id": "admin-uuid",
        "name": "Fluffy",
        ...posting details...
      }
    }
  ]
}
```

---

### 14. CHECK FAVORITE STATUS (User Only)

**Request:**
```
GET http://localhost:3000/api/favorites/posting-uuid
Authorization: Bearer user-jwt-token
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Status favorit berhasil diambil",
  "data": {
    "is_favorite": true
  }
}
```

---

### 15. REMOVE FROM FAVORITES (User Only)

**Request:**
```
DELETE http://localhost:3000/api/favorites/posting-uuid
Authorization: Bearer user-jwt-token
```

**Response Success (200):**
```json
{
  "status": "success",
  "message": "Posting berhasil dihapus dari favorit"
}
```

---

## 🚨 Error Responses

### 400 Bad Request
```json
{
  "status": "error",
  "message": "Semua field harus diisi"
}
```

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Token tidak valid"
}
```

### 403 Forbidden
```json
{
  "status": "error",
  "message": "Anda tidak memiliki akses. Hanya admin yang bisa melakukan aksi ini."
}
```

### 404 Not Found
```json
{
  "status": "error",
  "message": "Posting tidak ditemukan"
}
```

### 409 Conflict
```json
{
  "status": "error",
  "message": "Email atau username sudah terdaftar"
}
```

### 500 Internal Server Error
```json
{
  "status": "error",
  "message": "Terjadi kesalahan pada server",
  "error": "Error message details"
}
```

---

## 📝 NOTES

1. Semua request yang memerlukan authentication harus menyertakan header `Authorization: Bearer <token>`
2. Untuk upload file, gunakan `multipart/form-data` dengan form fields, bukan raw JSON
3. Pastikan 3 foto dikirim saat membuat posting
4. Admin hanya bisa update/delete posting yang mereka buat sendiri
5. Favorite hanya bisa dilakukan oleh user non-admin
6. Setiap posting hanya bisa punya 1 health record

---

## 🧪 Manual Testing Checklist

- [ ] Register user (register)
- [ ] Register admin user (register then manually set is_admin=true)
- [ ] Login as user
- [ ] Login as admin
- [ ] Get all postings (should be empty)
- [ ] Create posting as admin (with 3 photos)
- [ ] Get all postings (should show created posting)
- [ ] Get posting by ID
- [ ] Add health info as admin
- [ ] Get health info (public)
- [ ] Update health info as admin
- [ ] Update posting as admin
- [ ] Add posting to favorites as user
- [ ] Get my favorites as user
- [ ] Check favorite status as user
- [ ] Remove from favorites as user
- [ ] Try to create posting as user (should fail)
- [ ] Try to add to favorites as admin (should fail)
- [ ] Delete posting as admin
- [ ] Logout

---
