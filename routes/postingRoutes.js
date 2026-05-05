const express = require('express');
const router = express.Router();
const {
  createPosting,
  getAllPostings,
  getPostingById,
  updatePosting,
  deletePosting,
} = require('../controllers/postingController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');
const { uploadPostingImages } = require('../middlewares/uploadMiddleware');

// GET /postings - Semua user bisa lihat semua postings
router.get('/', getAllPostings);

// GET /postings/:id - Semua user bisa lihat detail posting
router.get('/:id', getPostingById);

// POST /postings - Hanya admin yang bisa create posting dengan 3 foto
router.post('/', authMiddleware, isAdmin, uploadPostingImages, createPosting);

// PUT /postings/:id - Hanya admin yang membuat posting bisa update
router.put('/:id', authMiddleware, isAdmin, updatePosting);

// DELETE /postings/:id - Hanya admin yang membuat posting bisa delete
router.delete('/:id', authMiddleware, isAdmin, deletePosting);

module.exports = router;
