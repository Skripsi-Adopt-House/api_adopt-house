require('dotenv').config();
const Sequelize = require('sequelize');
const pg = require('pg');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

// Get CA certificate
let caCert = null;
if (process.env.DB_CA_CERT) {
  // If CA cert provided via environment variable (Vercel)
  caCert = process.env.DB_CA_CERT;
} else if (fs.existsSync(path.join(__dirname, 'ca-certificate.pem'))) {
  // If CA cert file exists locally
  caCert = fs.readFileSync(path.join(__dirname, 'ca-certificate.pem'), 'utf8');
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    dialectModule: pg,
    logging: isProduction ? false : console.log,
    ssl: true,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Aiven uses self-signed cert, OK to disable for known service
        ca: caCert || undefined,
      },
    },
    pool: {
      max: isProduction ? 2 : 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: 3,
      timeout: 5000,
    },
  }
);

module.exports = sequelize;
