const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_PUBLIC_URL, {
  dialect: 'postgres',
  logging: false,
});
module.exports = sequelize;
