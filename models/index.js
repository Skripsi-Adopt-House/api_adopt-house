const User = require('./User');
const Posting = require('./Posting');
const Health = require('./Health');
const Picture = require('./Picture');
const Favorite = require('./Favorite');
const sequelize = require('../config/database');

// Relasi User - Posting (1:N)
User.hasMany(Posting, { foreignKey: 'admin_id', as: 'postings' });
Posting.belongsTo(User, { foreignKey: 'admin_id', as: 'admin' });

// Relasi Posting - Health (1:1)
Posting.hasOne(Health, { foreignKey: 'posting_id', as: 'health' });
Health.belongsTo(Posting, { foreignKey: 'posting_id', as: 'posting' });

// Relasi Posting - Picture (1:N)
Posting.hasMany(Picture, { foreignKey: 'posting_id', as: 'pictures' });
Picture.belongsTo(Posting, { foreignKey: 'posting_id', as: 'posting' });

// Relasi User - Favorite (1:N)
User.hasMany(Favorite, { foreignKey: 'user_id', as: 'favorites' });
Favorite.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Relasi Posting - Favorite (1:N)
Posting.hasMany(Favorite, { foreignKey: 'posting_id', as: 'favoritedBy' });
Favorite.belongsTo(Posting, { foreignKey: 'posting_id', as: 'posting' });

module.exports = {
  User,
  Posting,
  Health,
  Picture,
  Favorite,
  sequelize,
};
