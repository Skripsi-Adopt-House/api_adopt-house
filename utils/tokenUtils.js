const jwt = require('jsonwebtoken');

const generateToken = (userId, email, isAdmin) => {
  return jwt.sign(
    { id: userId, email, is_admin: isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
