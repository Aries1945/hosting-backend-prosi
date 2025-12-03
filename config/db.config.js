// config/db.config.js
require('dotenv').config();

// Support both DATABASE_PUBLIC_URL (connection string) and individual parameters
let dbConfig = {
  HOST: 'localhost',
  USER: 'postgres',
  PASSWORD: '',
  DB: 'bank_soal',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// If DATABASE_PUBLIC_URL is provided, parse it
if (process.env.DATABASE_PUBLIC_URL) {
  try {
    const url = new URL(process.env.DATABASE_PUBLIC_URL);
    dbConfig.HOST = url.hostname;
    dbConfig.USER = url.username;
    dbConfig.PASSWORD = url.password;
    dbConfig.DB = url.pathname.substring(1); // Remove leading '/'
    if (url.port) {
      dbConfig.port = url.port;
    }
  } catch (error) {
    console.error('Error parsing DATABASE_PUBLIC_URL:', error.message);
    console.error('Falling back to individual environment variables');
  }
}

// Override with individual environment variables if they exist
dbConfig.HOST = process.env.DB_HOST || process.env.HOST || dbConfig.HOST;
dbConfig.USER = process.env.DB_USER || process.env.USER || dbConfig.USER;
dbConfig.PASSWORD = process.env.DB_PASSWORD || process.env.PASSWORD || dbConfig.PASSWORD;
dbConfig.DB = process.env.DB_NAME || process.env.DB || dbConfig.DB;

// Add port if specified
if (process.env.DB_PORT || process.env.PORT) {
  dbConfig.port = process.env.DB_PORT || process.env.PORT;
}

module.exports = dbConfig;