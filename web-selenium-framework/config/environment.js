require('dotenv').config();

module.exports = {
  baseUrl: process.env.BASE_URL || 'http://localhost:8081',
  apiUrl: process.env.API_URL || 'http://127.0.0.1:5000',
  browser: process.env.BROWSER || 'chrome',
  headless: process.env.HEADLESS === 'true' || true,
  implicitWait: parseInt(process.env.IMPLICIT_WAIT || '10000', 10),
  explicitWait: parseInt(process.env.EXPLICIT_WAIT || '15000', 10),
};
