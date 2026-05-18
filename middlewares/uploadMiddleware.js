const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('File harus berupa gambar (jpeg, png, gif, webp)'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB per file
  },
});

// Middleware untuk handle multipart form-data dengan text fields dan file array
const uploadPostingImages = (req, res, next) => {
  upload.array('pictures', 3)(req, res, (err) => {
    if (err) {
      // Handle multer errors
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: 'error',
          message: 'Ukuran file terlalu besar, maksimal 5MB per file',
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          status: 'error',
          message: 'Maksimal 3 file dapat diupload',
        });
      }
      return res.status(400).json({
        status: 'error',
        message: err.message || 'Upload error',
      });
    }
    next();
  });
};

module.exports = upload;
module.exports.uploadPostingImages = uploadPostingImages;
