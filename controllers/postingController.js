const { Posting, Health, Picture } = require('../models');
const s3 = require('../config/awsConfig');
const path = require('path');

// Upload file ke S3
const uploadToS3 = async (file, fileName) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `postings/${Date.now()}-${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,

  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location);
      }
    });
  });
};

const createPosting = async (req, res) => {
  try {
    const { name, age, gender, breed, adoption_fee, story, vaksin, sertifikat } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama hewan harus diisi',
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Minimal 3 foto harus diunggah',
      });
    }

    if (req.files.length < 3) {
      return res.status(400).json({
        status: 'error',
        message: 'Harus mengupload tepat 3 foto',
      });
    }

    // Create posting
    const newPosting = await Posting.create({
      admin_id: req.user.id,
      name,
      age: age || null,
      gender: gender || null,
      breed: breed || null,
      adoption_fee: adoption_fee || null,
      story: story || null,
    });

    // Upload pictures
    let uploadedPictures = [];
    for (let i = 0; i < req.files.length && i < 3; i++) {
      try {
        const fileName = `${newPosting.id}-${i + 1}${path.extname(req.files[i].originalname)}`;
        const s3Url = await uploadToS3(req.files[i], fileName);

        const picture = await Picture.create({
          posting_id: newPosting.id,
          url: s3Url,
        });

        uploadedPictures.push(picture);
      } catch (uploadError) {
        return res.status(500).json({
          status: 'error',
          message: 'Gagal mengupload foto',
          error: uploadError.message,
        });
      }
    }

    // Create health info if provided
    if (vaksin !== undefined || sertifikat !== undefined) {
      await Health.create({
        posting_id: newPosting.id,
        vaksin: vaksin === 'true' || vaksin === true,
        sertifikat: sertifikat === 'true' || sertifikat === true,
      });
    }

    const postingWithDetails = await Posting.findByPk(newPosting.id, {
      include: [
        { association: 'admin', attributes: ['id', 'name', 'username'] },
        { association: 'pictures' },
        { association: 'health' },
      ],
    });

    return res.status(201).json({
      status: 'success',
      message: 'Posting berhasil dibuat',
      data: postingWithDetails,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal membuat posting',
      error: error.message,
    });
  }
};

const getAllPostings = async (req, res) => {
  try {
    const postings = await Posting.findAll({
      include: [
        { association: 'admin', attributes: ['id', 'name', 'username'] },
        { association: 'pictures' },
        { association: 'health' },
      ],
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      status: 'success',
      message: 'Data postings berhasil diambil',
      data: postings,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil postings',
      error: error.message,
    });
  }
};

const getPostingById = async (req, res) => {
  try {
    const { id } = req.params;

    const posting = await Posting.findByPk(id, {
      include: [
        { association: 'admin', attributes: ['id', 'name', 'username'] },
        { association: 'pictures' },
        { association: 'health' },
      ],
    });

    if (!posting) {
      return res.status(404).json({
        status: 'error',
        message: 'Posting tidak ditemukan',
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Data posting berhasil diambil',
      data: posting,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengambil posting',
      error: error.message,
    });
  }
};

const updatePosting = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, breed, adoption_fee, story } = req.body;

    const posting = await Posting.findByPk(id);

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
        message: 'Anda tidak memiliki akses untuk mengubah posting ini',
      });
    }

    // Update posting
    await posting.update({
      name: name || posting.name,
      age: age !== undefined ? age : posting.age,
      gender: gender || posting.gender,
      breed: breed || posting.breed,
      adoption_fee: adoption_fee !== undefined ? adoption_fee : posting.adoption_fee,
      story: story || posting.story,
      updated_at: new Date(),
    });

    const updatedPosting = await Posting.findByPk(id, {
      include: [
        { association: 'admin', attributes: ['id', 'name', 'username'] },
        { association: 'pictures' },
        { association: 'health' },
      ],
    });

    return res.status(200).json({
      status: 'success',
      message: 'Posting berhasil diubah',
      data: updatedPosting,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mengubah posting',
      error: error.message,
    });
  }
};

const deletePosting = async (req, res) => {
  try {
    const { id } = req.params;

    const posting = await Posting.findByPk(id, {
      include: [{ association: 'pictures' }],
    });

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
        message: 'Anda tidak memiliki akses untuk menghapus posting ini',
      });
    }

    // Delete pictures from S3
    for (const picture of posting.pictures) {
      const key = picture.url.split('/').pop();
      const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `postings/${key}`,
      };

      s3.deleteObject(params, (err, data) => {
        if (err) console.log('Error deleting from S3:', err);
      });
    }

    // Delete posting (cascade delete akan menghapus pictures dan health)
    await posting.destroy();

    return res.status(200).json({
      status: 'success',
      message: 'Posting berhasil dihapus',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal menghapus posting',
      error: error.message,
    });
  }
};

module.exports = {
  createPosting,
  getAllPostings,
  getPostingById,
  updatePosting,
  deletePosting,
};
