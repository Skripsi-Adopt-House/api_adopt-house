const { Posting, Health, Picture } = require('../models');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/awsConfig');
const path = require('path');

// Upload file ke S3
const uploadToS3 = async (file, fileName) => {
  const key = `postings/${Date.now()}-${fileName}`;
  
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);
    
    // Return S3 URL
    const s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`;
    return s3Url;
  } catch (error) {
    throw error;
  }
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

    // Parse numeric values
    let parsedAge = null;
    if (age !== undefined && age !== null && age !== '') {
      parsedAge = parseFloat(age);
      if (isNaN(parsedAge) || parsedAge < 0.1 || parsedAge > 99.9) {
        return res.status(400).json({
          status: 'error',
          message: 'Age harus berupa angka positif 0.1-99.9 (contoh: 0.5, 1, 2.5)',
        });
      }
    }

    let parsedAdoptionFee = null;
    if (adoption_fee !== undefined && adoption_fee !== null && adoption_fee !== '') {
      parsedAdoptionFee = parseInt(adoption_fee);
      if (isNaN(parsedAdoptionFee) || parsedAdoptionFee < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Adoption fee harus berupa angka positif',
        });
      }
    }

    // Create posting
    const newPosting = await Posting.create({
      admin_id: req.user.id,
      name,
      age: parsedAge,
      gender: gender || null,
      breed: breed || null,
      adoption_fee: parsedAdoptionFee,
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

    // Parse numeric values
    let parsedAge = posting.age;
    if (age !== undefined && age !== null && age !== '') {
      parsedAge = parseFloat(age);
      if (isNaN(parsedAge) || parsedAge < 0.1 || parsedAge > 99.9) {
        return res.status(400).json({
          status: 'error',
          message: 'Age harus berupa angka positif 0.1-99.9 (contoh: 0.5, 1, 2.5)',
        });
      }
    }

    let parsedAdoptionFee = posting.adoption_fee;
    if (adoption_fee !== undefined && adoption_fee !== null && adoption_fee !== '') {
      parsedAdoptionFee = parseInt(adoption_fee);
      if (isNaN(parsedAdoptionFee) || parsedAdoptionFee < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Adoption fee harus berupa angka positif',
        });
      }
    }

    // Update posting
    await posting.update({
      name: name || posting.name,
      age: parsedAge,
      gender: gender || posting.gender,
      breed: breed || posting.breed,
      adoption_fee: parsedAdoptionFee,
      story: story || posting.story,
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
      try {
        // Extract S3 key from URL
        const urlParts = picture.url.split('/');
        const key = `postings/${urlParts[urlParts.length - 1]}`;
        
        const command = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
        });
        
        await s3.send(command);
      } catch (err) {
        console.log('Error deleting from S3:', err);
      }
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
