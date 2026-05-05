const { User } = require('../models');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const { Op } = require('sequelize');

const register = async (req, res) => {
  try {
    const { email, username, name, password, confirmPassword } = req.body;

    // Validation
    if (!email || !username || !name || !password || !confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Semua field harus diisi',
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Format email tidak valid',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Password dan confirm password tidak cocok',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password minimal 6 karakter',
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'Email atau username sudah terdaftar',
      });
    }

    // Create user
    const newUser = await User.create({
      email,
      username,
      name,
      password,
      is_admin: false,
    });

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, is_admin: newUser.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    await newUser.update({ token });

    return res.status(201).json({
      status: 'success',
      message: 'User berhasil terdaftar',
      data: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        name: newUser.name,
        is_admin: newUser.is_admin,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal mendaftar',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email dan password harus diisi',
      });
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah',
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, is_admin: user.is_admin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    await user.update({ token });

    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        is_admin: user.is_admin,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal login',
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    await req.user.update({ token: null });

    return res.status(200).json({
      status: 'success',
      message: 'Logout berhasil',
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Gagal logout',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};
