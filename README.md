# Adopt House API

Backend API untuk aplikasi adopsi hewan menggunakan Node.js Express dan PostgreSQL.

## 📋 Fitur Utama

1. **Autentikasi** - Register dan Login dengan JWT
2. **Middleware** - isAdmin dan isUser untuk kontrol akses
3. **Posting Management** - Create, Read, Update, Delete dengan upload 3 foto ke AWS S3
4. **Health Information** - Tambah informasi kesehatan hewan
5. **Favorites** - User bisa menambah/menghapus dari favorit

## 🏗️ Struktur Project

```
adopt_api/
├── config/
│   ├── database.js
│   └── awsConfig.js
├── models/
│   ├── User.js
│   ├── Posting.js
│   ├── Health.js
│   ├── Picture.js
│   ├── Favorite.js
│   └── index.js
├── controllers/
│   ├── authController.js
│   ├── postingController.js
│   ├── healthController.js
│   └── favoriteController.js
├── routes/
│   ├── authRoutes.js
│   ├── postingRoutes.js
│   ├── healthRoutes.js
│   └── favoriteRoutes.js
├── middlewares/
│   ├── authMiddleware.js
│   ├── isAdmin.js
│   ├── isUser.js
│   └── uploadMiddleware.js
├── server.js
├── .env
└── package.json
```

## 🗄️ Database Schema

### Users Table
- id (UUID, Primary Key)
- email (String, Unique)
- username (String, Unique)
- name (String)
- password (String, Hashed)
- is_admin (Boolean, Default: false)
- token (Text, Nullable)
- created_at (Timestamp)

### Postings Table
- id (UUID, Primary Key)
- admin_id (UUID, Foreign Key → users.id)
- name (String)
- age (Integer)
- gender (String)
- breed (String)
- adoption_fee (Decimal)
- story (Text)
- created_at (Timestamp)
- updated_at (Timestamp)

### Health Table
- id (UUID, Primary Key)
- posting_id (UUID, Foreign Key → postings.id, Unique)
- vaksin (Boolean)
- sertifikat (String/URL)
- created_at (Timestamp)
- updated_at (Timestamp)

### Pictures Table
- id (UUID, Primary Key)
- posting_id (UUID, Foreign Key → postings.id)
- url (Text - AWS S3 URL)
- created_at (Timestamp)
- updated_at (Timestamp)

### Favorites Table
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key → users.id)
- posting_id (UUID, Foreign Key → postings.id)

## 🚀 Setup dan Installation

### Prerequisites
- Node.js v14 atau lebih
- PostgreSQL
- AWS S3 Account (untuk upload foto)

### Installation

1. Clone repository
```bash
cd adopt_api
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
# Copy .env.example ke .env
cp .env .env

# Edit .env dengan konfigurasi Anda:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adopt_api_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_REGION=us-east-1
```

4. Buat database PostgreSQL
```bash
createdb adopt_api_db
```

5. Jalankan server
```bash
npm run dev
```

Server akan jalan di `http://localhost:3000`

## 📚 API Endpoints

### Authentication

#### Register
```
POST /api/auth/register
Body: {
  "email": "user@example.com",
  "username": "username",
  "name": "Full Name",
  "password": "password123",
  "confirmPassword": "password123"
}
```

#### Login
```
POST /api/auth/login
Body: {
  "email": "user@example.com",
  "password": "password123"
}
```

#### Logout
```
POST /api/auth/logout
Headers: {
  "Authorization": "Bearer <token>"
}
```

### Postings (Admin Only untuk Create/Update/Delete)

#### Get All Postings
```
GET /api/postings
```

#### Get Posting by ID
```
GET /api/postings/:id
```

#### Create Posting (Admin Only)
```
POST /api/postings
Headers: {
  "Authorization": "Bearer <admin_token>"
}
FormData: {
  "name": "Animal Name",
  "age": 2,
  "gender": "Male",
  "breed": "Breed Name",
  "adoption_fee": 100000,
  "story": "Animal story...",
  "pictures": [file1, file2, file3] (3 files required)
}
```

#### Update Posting (Admin Only)
```
PUT /api/postings/:id
Headers: {
  "Authorization": "Bearer <admin_token>"
}
Body: {
  "name": "New Name",
  "age": 3,
  ...
}
```

#### Delete Posting (Admin Only)
```
DELETE /api/postings/:id
Headers: {
  "Authorization": "Bearer <admin_token>"
}
```

### Health Information (Admin Only untuk Create/Update)

#### Add Health Info
```
POST /api/health/:posting_id
Headers: {
  "Authorization": "Bearer <admin_token>"
}
Body: {
  "vaksin": true,
  "sertifikat": "https://url-to-certificate"
}
```

#### Update Health Info
```
PUT /api/health/:posting_id
Headers: {
  "Authorization": "Bearer <admin_token>"
}
Body: {
  "vaksin": true,
  "sertifikat": "https://url-to-certificate"
}
```

#### Get Health Info
```
GET /api/health/:posting_id
```

### Favorites (User Only)

#### Add to Favorites
```
POST /api/favorites
Headers: {
  "Authorization": "Bearer <user_token>"
}
Body: {
  "posting_id": "posting-uuid"
}
```

#### Get My Favorites
```
GET /api/favorites
Headers: {
  "Authorization": "Bearer <user_token>"
}
```

#### Check Favorite Status
```
GET /api/favorites/:posting_id
Headers: {
  "Authorization": "Bearer <user_token>"
}
```

#### Remove from Favorites
```
DELETE /api/favorites/:posting_id
Headers: {
  "Authorization": "Bearer <user_token>"
}
```

## 🔐 Authentication Rules

- **Posting Create/Update/Delete**: Hanya admin yang bisa
- **Posting Read**: Semua user bisa melihat
- **Favorites**: Hanya user (non-admin) yang bisa
- **Health Info**: Admin bisa create/update, semua user bisa read

## ⚙️ Environment Variables

```
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=adopt_api_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_REGION=us-east-1
AWS_S3_URL=https://your_bucket_name.s3.amazonaws.com
```

## 📝 Progress Tracker

- ✅ Project structure dan dependencies setup
- ✅ Database configuration dan models
- ✅ User authentication (Register/Login/Logout)
- ✅ Authorization middlewares (isAdmin, isUser)
- ✅ Posting CRUD with AWS S3 upload
- ✅ Health information management
- ✅ Favorites functionality
- ✅ Main server setup

## 🤝 Support

Untuk pertanyaan atau masalah, silakan hubungi tim development.

---

**Dibuat dengan ❤️ untuk Adopt House**
