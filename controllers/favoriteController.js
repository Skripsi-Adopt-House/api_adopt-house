const { Favorite, Posting } = require('../models');

const addFavorite = async (req, res) => {
  try {
    const { posting_id } = req.body;

    if (!posting_id) {
      return res.status(400).json({
        status: 'error',
        message: 'posting_id harus diisi',
      });
    }

    // Check if posting exists
    const posting = await Posting.findByPk(posting_id);

    if (!posting) {
      return res.status(404).json({
        status: 'error',
        message: 'Posting tidak ditemukan',
      });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      where: {
        user_id: req.user.id,
        posting_id,
      },
    });

    if (existingFavorite) {
      return res.status(409).json({
        status: 'error',
        message: 'Posting sudah ada di daftar favorit Anda',
      });
    }

    // Add to favorites
    const favorite = await Favorite.create({
      user_id: req.user.id,
      posting_id,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Posting berhasil ditambahkan ke favorit',
      data: favorite,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menambahkan ke favorit',
      error: error.message,
    });
  }
};

const removeFavorite = async (req, res) => {
  try {
    const { posting_id } = req.params;

    // Check if favorite exists
    const favorite = await Favorite.findOne({
      where: {
        user_id: req.user.id,
        posting_id,
      },
    });

    if (!favorite) {
      return res.status(404).json({
        status: 'error',
        message: 'Posting tidak ada di daftar favorit Anda',
      });
    }

    // Remove from favorites
    await favorite.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'Posting berhasil dihapus dari favorit',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus dari favorit',
      error: error.message,
    });
  }
};

const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          association: 'posting',
          include: [
            { association: 'admin', attributes: ['id', 'name', 'username'] },
            { association: 'pictures' },
            { association: 'health' },
          ],
        },
      ],
    });

    return res.status(200).json({
      status: 'success',
      message: 'Daftar favorit berhasil diambil',
      data: favorites,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil daftar favorit',
      error: error.message,
    });
  }
};

const checkFavorite = async (req, res) => {
  try {
    const { posting_id } = req.params;

    const favorite = await Favorite.findOne({
      where: {
        user_id: req.user.id,
        posting_id,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Status favorit berhasil diambil',
      data: {
        is_favorite: favorite ? true : false,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengecek status favorit',
      error: error.message,
    });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getUserFavorites,
  checkFavorite,
};
