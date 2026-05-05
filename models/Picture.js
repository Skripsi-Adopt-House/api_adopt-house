const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Picture = sequelize.define('Picture', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  posting_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'postings',
      key: 'id',
    },
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false,
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
  tableName: 'pictures',
  timestamps: false,
  underscored: true,
});

module.exports = Picture;
