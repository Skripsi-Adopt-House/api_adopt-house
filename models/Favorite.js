const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorite = sequelize.define('Favorite', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  posting_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'postings',
      key: 'id',
    },
  },
}, {
  tableName: 'favorites',
  timestamps: false,
  underscored: true,
});

module.exports = Favorite;
