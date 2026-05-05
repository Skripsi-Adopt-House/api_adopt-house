const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Health = sequelize.define('Health', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  posting_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'postings',
      key: 'id',
    },
  },
  vaksin: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  sertifikat: {
    type: DataTypes.BOOLEAN,
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
  tableName: 'health',
  timestamps: false,
  underscored: true,
});

module.exports = Health;
