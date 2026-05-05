# 📑 ADOPT HOUSE API - DOCUMENTATION INDEX

## 🚀 START HERE

Jika Anda baru, mulai dari sini:

1. **[QUICKSTART.md](QUICKSTART.md)** ⭐
   - Setup cepat dalam 5 menit
   - Installation instructions
   - Testing dengan cURL/Postman

2. **[README.md](README.md)**
   - Pengenalan lengkap
   - API overview
   - Database schema

---

## 📚 COMPLETE DOCUMENTATION

### Setup & Installation
- **[QUICKSTART.md](QUICKSTART.md)** - Quick 5-minute setup
- **[.env.example](.env.example)** - Environment template

### API Documentation
- **[README.md](README.md)** - Full API docs
- **[API_TESTING.md](API_TESTING.md)** - Testing guide dengan examples

### Project Information
- **[SUMMARY.md](SUMMARY.md)** - Implementation summary
- **[FILE_STRUCTURE.md](FILE_STRUCTURE.md)** - Folder structure
- **[PROGRESS.md](PROGRESS.md)** - Detailed progress
- **[COMPLETION_CHECKLIST.md](COMPLETION_CHECKLIST.md)** - Final checklist

---

## 🗂️ FILE ORGANIZATION

```
📦 adopt_api
├── 🔧 CONFIG & ENTRY POINT
│   ├── server.js              ← Start here (main file)
│   ├── .env                   ← Fill this with your credentials
│   ├── package.json           ← Dependencies list
│   └── .gitignore
│
├── ⚙️ CONFIG (External Services)
│   └── config/
│       ├── database.js        ← PostgreSQL setup
│       └── awsConfig.js       ← AWS S3 setup
│
├── 🗄️ DATABASE MODELS
│   └── models/
│       ├── User.js            ← User model
│       ├── Posting.js         ← Posting model
│       ├── Health.js          ← Health info
│       ├── Picture.js         ← S3 URLs
│       ├── Favorite.js        ← Favorites
│       └── index.js           ← Relationships
│
├── 🎮 BUSINESS LOGIC
│   └── controllers/
│       ├── authController.js  ← Login/Register
│       ├── postingController.js ← CRUD postings
│       ├── healthController.js ← Health management
│       └── favoriteController.js ← Favorites
│
├── 🛣️ API ROUTES
│   └── routes/
│       ├── authRoutes.js      ← Auth endpoints
│       ├── postingRoutes.js   ← Posting endpoints
│       ├── healthRoutes.js    ← Health endpoints
│       └── favoriteRoutes.js  ← Favorite endpoints
│
├── 🔒 SECURITY & FILE UPLOAD
│   └── middlewares/
│       ├── authMiddleware.js  ← JWT validation
│       ├── isAdmin.js         ← Admin check
│       ├── isUser.js          ← User check
│       └── uploadMiddleware.js ← File upload
│
├── 🛠️ UTILITIES
│   └── utils/
│       └── tokenUtils.js      ← JWT helpers
│
└── 📖 DOCUMENTATION
    ├── README.md              ← Full API docs
    ├── QUICKSTART.md          ← Quick setup
    ├── API_TESTING.md         ← Test guide
    ├── SUMMARY.md             ← Summary
    ├── PROGRESS.md            ← Progress tracker
    ├── FILE_STRUCTURE.md      ← This structure
    ├── COMPLETION_CHECKLIST.md ← Completion status
    ├── INDEX.md               ← Navigation guide
    └── .env.example           ← Environment template
```

---

## 🎯 QUICK NAVIGATION

### I WANT TO...

**Start the project**
→ Read [QUICKSTART.md](QUICKSTART.md) first

**Understand the API**
→ Read [README.md](README.md)

**Test the API**
→ Read [API_TESTING.md](API_TESTING.md)

**Understand architecture**
→ Read [SUMMARY.md](SUMMARY.md)

**Check what's done**
→ Read [COMPLETION_CHECKLIST.md](COMPLETION_CHECKLIST.md)

**See progress details**
→ Read [PROGRESS.md](PROGRESS.md)

**Understand folder structure**
→ Read [FILE_STRUCTURE.md](FILE_STRUCTURE.md)

**Configure environment**
→ Copy `.env.example` to `.env`

**See how endpoints work**
→ Check [API_TESTING.md](API_TESTING.md)

---

## 📋 DOCUMENTATION QUICK REFERENCE

| File | Purpose | Read Time |
|------|---------|-----------|
| [QUICKSTART.md](QUICKSTART.md) | Setup & run | 5 min ⭐ |
| [README.md](README.md) | API documentation | 15 min |
| [API_TESTING.md](API_TESTING.md) | Testing guide | 10 min |
| [SUMMARY.md](SUMMARY.md) | Implementation summary | 10 min |
| [PROGRESS.md](PROGRESS.md) | Detailed progress | 10 min |
| [FILE_STRUCTURE.md](FILE_STRUCTURE.md) | Folder organization | 10 min |
| [COMPLETION_CHECKLIST.md](COMPLETION_CHECKLIST.md) | Checklist | 5 min |

---

## 🚀 COMMANDS REFERENCE

```bash
# Install dependencies
npm install

# Run development server (with auto-reload)
npm run dev

# Run production server
npm start

# View database
psql -U postgres -d adopt_api_db
```

---

## 📞 API ENDPOINTS QUICK REFERENCE

### Auth (Public)
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout (Protected)
```

### Postings
```
GET    /api/postings             (Public)
GET    /api/postings/:id         (Public)
POST   /api/postings             (Admin)
PUT    /api/postings/:id         (Admin)
DELETE /api/postings/:id         (Admin)
```

### Health
```
GET    /api/health/:posting_id   (Public)
POST   /api/health/:posting_id   (Admin)
PUT    /api/health/:posting_id   (Admin)
```

### Favorites
```
GET    /api/favorites            (User)
POST   /api/favorites            (User)
GET    /api/favorites/:id        (User)
DELETE /api/favorites/:id        (User)
```

---

## 🔑 KEY CONCEPTS

### Architecture
- **Controllers** - Business logic
- **Models** - Database schema
- **Routes** - API endpoints
- **Middlewares** - Request processing
- **Config** - External services

### Security
- JWT for authentication
- Password hashing with bcryptjs
- Role-based access (Admin/User)
- Ownership validation

### Database
- PostgreSQL + Sequelize ORM
- UUID primary keys
- 5 tables with relationships
- Cascading deletes

### File Handling
- Multer for uploads
- AWS S3 storage
- File validation
- Automatic cleanup

---

## 🎓 LEARNING PATH

1. **Understand** the architecture
   → Read [SUMMARY.md](SUMMARY.md)

2. **Setup** the project
   → Follow [QUICKSTART.md](QUICKSTART.md)

3. **Learn** the API
   → Read [README.md](README.md)

4. **Test** the endpoints
   → Follow [API_TESTING.md](API_TESTING.md)

5. **Explore** the code
   → Review the code files

6. **Deploy** to production
   → Update .env with production values

---

## 💡 TIPS

- Use Postman or Insomnia for API testing
- Check .env.example for all required variables
- Read API_TESTING.md for complete example requests
- Frontend should send JWT in Authorization header
- All timestamps are in UTC
- S3 URLs are public-readable
- Max 3 photos per posting
- Admin can only modify own postings

---

## ❓ TROUBLESHOOTING

**Can't connect to database?**
→ Check database.js in config folder

**S3 upload not working?**
→ Check AWS credentials in .env

**JWT token invalid?**
→ Check authMiddleware.js

**Access denied?**
→ Check isAdmin.js or isUser.js

**Port already in use?**
→ Check QUICKSTART.md troubleshooting section

---

## 📞 SUPPORT

For issues:
1. Check relevant documentation file
2. Review the code in related folder
3. Check error messages in server logs
4. Verify .env configuration

---

## ✨ FEATURES AT A GLANCE

✅ User authentication with JWT
✅ Role-based access control
✅ CRUD operations with S3 uploads
✅ Database relationships (1:1, 1:N, M:N)
✅ Error handling & validation
✅ Security best practices
✅ Clean architecture
✅ Comprehensive documentation

---

## 📊 PROJECT STATUS

**Completion**: 100% ✅
**Status**: Production Ready
**Quality**: Professional Grade
**Documentation**: Comprehensive

---

## 📅 QUICK REFERENCE DATES

- **Created**: May 2, 2026
- **Last Updated**: May 2, 2026
- **Status**: Complete and Ready

---

**Happy Coding! 🎉**

Start with: [QUICKSTART.md](QUICKSTART.md)

---
