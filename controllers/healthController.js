const { Health, Posting } = require('../models');

const addHealth = async (req, res) => {
  try {
    const { posting_id } = req.params;
    const { vaksin, sertifikat } = req.body;

    // Check if posting exists
    const posting = await Posting.findByPk(posting_id);

    if (!posting) {
      return res.status(404).json({
        status: 'error',
        message: 'Posting tidak ditemukan',
      });
    }

    // Check if user is the one who created this posting
    if (posting.admin_id !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki akses untuk menambahkan health info pada posting ini',
      });
    }

    // Check if health already exists
    const existingHealth = await Health.findOne({ where: { posting_id } });

    if (existingHealth) {
      return res.status(409).json({
        status: 'error',
        message: 'Health info sudah ada untuk posting ini',
      });
    }

    // Create health
    const newHealth = await Health.create({
      posting_id,
      vaksin: vaksin === 'true' || vaksin === true,
      sertifikat: sertifikat === 'true' || sertifikat === true,
    });

    return res.status(201).json({
      status: 'success',
      message: 'Health info berhasil ditambahkan',
      data: newHealth,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menambahkan health info',
      error: error.message,
    });
  }
};

const updateHealth = async (req, res) => {
  try {
    const { posting_id } = req.params;
    const { vaksin, sertifikat } = req.body;

    // Check if posting exists
    const posting = await Posting.findByPk(posting_id);

    if (!posting) {
      return res.status(404).json({
        status: 'error',
        message: 'Posting tidak ditemukan',
      });
    }

    // Check if user is the one who created this posting
    if (posting.admin_id !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki akses untuk mengubah health info pada posting ini',
      });
    }

    // Find health
    const health = await Health.findOne({ where: { posting_id } });

    if (!health) {
      return res.status(404).json({
        status: 'error',
        message: 'Health info tidak ditemukan untuk posting ini',
      });
    }

    // Update health
    await health.update({
      vaksin: vaksin !== undefined ? (vaksin === 'true' || vaksin === true) : health.vaksin,
      sertifikat: sertifikat !== undefined ? (sertifikat === 'true' || sertifikat === true) : health.sertifikat,
      updated_at: new Date(),
    });

    return res.status(200).json({
      status: 'success',
      message: 'Health info berhasil diubah',
      data: health,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengubah health info',
      error: error.message,
    });
  }
};

const getHealthByPostingId = async (req, res) => {
  try {
    const { posting_id } = req.params;

    const health = await Health.findOne({ where: { posting_id } });

    if (!health) {
      return res.status(404).json({
        status: 'error',
        message: 'Health info tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Health info berhasil diambil',
      data: health,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil health info',
      error: error.message,
    });
  }
};

module.exports = {
  addHealth,
  updateHealth,
  getHealthByPostingId,
};
