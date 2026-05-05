const isUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'User tidak ditemukan',
    });
  }

  if (req.user.is_admin) {
    return res.status(403).json({
      status: 'error',
      message: 'Admin tidak bisa melakukan aksi ini. Hanya user regular yang bisa.',
    });
  }

  next();
};

module.exports = isUser;
