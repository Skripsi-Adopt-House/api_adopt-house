const express = require('express');
const router = express.Router();
const {
  addHealth,
  updateHealth,
  getHealthByPostingId,
} = require('../controllers/healthController');
const authMiddleware = require('../middlewares/authMiddleware');
const isAdmin = require('../middlewares/isAdmin');

// POST /health/:posting_id - Admin yang membuat posting bisa tambah health info
router.post('/:posting_id', authMiddleware, isAdmin, addHealth);

// PUT /health/:posting_id - Admin yang membuat posting bisa update health info
router.put('/:posting_id', authMiddleware, isAdmin, updateHealth);

// GET /health/:posting_id - Semua user bisa lihat health info
router.get('/:posting_id', getHealthByPostingId);

module.exports = router;
