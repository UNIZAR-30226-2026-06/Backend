require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  turso: {
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  }
};