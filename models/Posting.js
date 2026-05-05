const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Posting = sequelize.define('Posting', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  admin_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adoption_fee: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  story: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'postings',
  timestamps: false,
  underscored: true,
});

module.exports = Posting;
