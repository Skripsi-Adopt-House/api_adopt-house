const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'User tidak ditemukan',
    });
  }

  if (!req.user.is_admin) {
    return res.status(403).json({
      status: 'error',
      message: 'Anda tidak memiliki akses. Hanya admin yang bisa melakukan aksi ini.',
    });
  }

  next();
};

module.exports = isAdmin;
