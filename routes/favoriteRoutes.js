const express = require('express');
const router = express.Router();
const {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite,
} = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');
const isUser = require('../middlewares/isUser');

// POST /favorites - Hanya user yang bisa tambah ke favorit
router.post('/', authMiddleware, isUser, addFavorite);

// GET /favorites - User bisa lihat daftar favorit mereka
router.get('/', authMiddleware, isUser, getUserFavorites);

// GET /favorites/:posting_id - Check apakah posting ada di favorit user
router.get('/:posting_id', authMiddleware, isUser, checkFavorite);

// DELETE /favorites/:posting_id - Hanya user yang bisa hapus dari favorit
router.delete('/:posting_id', authMiddleware, isUser, removeFavorite);

module.exports = router;
