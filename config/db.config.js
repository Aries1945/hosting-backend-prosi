// config/db.config.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_PUBLIC_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: false, // kalau mau log query bisa di true
});

module.exports = sequelize;
