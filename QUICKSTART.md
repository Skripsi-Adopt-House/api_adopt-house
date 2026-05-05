# 🚀 QUICK START GUIDE

## Prerequisites
- Node.js v14+
- PostgreSQL
- AWS S3 Account
- Git

---

## Step 1: Clone Repository

```bash
cd adopt_api
```

---

## Step 2: Install Dependencies

```bash
npm install
```

Ini akan install semua packages dari package.json

---

## Step 3: Setup Environment Variables

1. Copy file template:
```bash
cp .env.example .env
```

2. Edit `.env` dengan nilai yang sesuai:

```env
# Development
NODE_ENV=development
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=adopt_api_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d

# AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_REGION=us-east-1
AWS_S3_URL=https://your_bucket_name.s3.amazonaws.com
```

---

## Step 4: Setup PostgreSQL Database

### Windows (Command Prompt/PowerShell):

```bash
# Connect ke PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE adopt_api_db;

# Verifikasi
\l

# Keluar
\q
```

### macOS/Linux:

```bash
# Create database
createdb adopt_api_db

# Verifikasi
psql -l
```

---

## Step 5: Start Development Server

```bash
npm run dev
```

Output yang diharapkan:
```
✓ Database connection established
✓ Database synchronized
✓ Server is running on port 3000
✓ API documentation:
  - Auth: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout
  - Postings: GET /api/postings, POST /api/postings (admin), GET/PUT/DELETE /api/postings/:id (admin)
  - Health: POST/PUT /api/health/:posting_id (admin), GET /api/health/:posting_id
  - Favorites: POST/GET/DELETE /api/favorites (user only)
```

---

## Step 6: Test API dengan Postman atau cURL

### Test Health Check:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "success",
  "message": "Server is running"
}
```

### Test Register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "name": "Test User",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

---

## Step 7: Create Admin User (Manual Setup)

Setelah register, ubah user menjadi admin:

```bash
# Connect ke database
psql -U postgres -d adopt_api_db

# Update user jadi admin
UPDATE users SET is_admin = true WHERE email = 'admin@example.com';

# Verifikasi
SELECT id, email, username, is_admin FROM users;

# Keluar
\q
```

---

## Production Setup

### Build untuk Production:

```bash
# Set environment
export NODE_ENV=production
# atau di Windows: set NODE_ENV=production

# Start server
npm start
```

### Environment Variables untuk Production:

```env
NODE_ENV=production
PORT=3000

# Database - use production database
DB_HOST=production-db-host
DB_PORT=5432
DB_NAME=adopt_api_prod
DB_USER=prod_user
DB_PASSWORD=strong_password

# JWT - use strong secret
JWT_SECRET=generate_strong_random_secret_key_here
JWT_EXPIRE=7d

# AWS S3
AWS_ACCESS_KEY_ID=prod_access_key
AWS_SECRET_ACCESS_KEY=prod_secret_key
AWS_S3_BUCKET_NAME=prod-bucket
AWS_S3_REGION=us-east-1
```

---

## Troubleshooting

### Port Already in Use
```bash
# Linux/Mac: Find process using port 3000
lsof -i :3000
kill -9 <PID>

# Windows: Find process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Database Connection Error
- Pastikan PostgreSQL service berjalan
- Verifikasi DB_HOST, DB_PORT, DB_USER, DB_PASSWORD di .env
- Pastikan database sudah dibuat

### AWS S3 Upload Error
- Verifikasi AWS credentials
- Pastikan bucket name benar
- Pastikan IAM permissions cukup (s3:GetObject, s3:PutObject, s3:DeleteObject)

### JWT Token Error
- Clear cache browser
- Update JWT_SECRET jika berubah
- Pastikan format token benar: `Bearer <token>`

---

## Useful Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run production server
npm start

# View database
psql -U postgres -d adopt_api_db

# Drop database (careful!)
dropdb adopt_api_db

# Recreate database
createdb adopt_api_db
```

---

## API Documentation

Lihat file berikut untuk dokumentasi lengkap:
- **README.md** - Overview dan setup
- **API_TESTING.md** - Test cases dan examples
- **PROGRESS.md** - Implementation details

---

## Support

Jika ada masalah:
1. Check `.env` configuration
2. Verify database connection
3. Check AWS S3 credentials
4. Review error logs di console
5. Cek file-file di routes dan controllers

---

**Happy Coding! 🎉**
