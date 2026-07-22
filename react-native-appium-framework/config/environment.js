require('dotenv').config();

const environments = {
  DEV: {
    name: 'DEV',
    baseUrl: process.env.API_BASE_URL || 'http://10.38.12.175:5000',
    timeout: 10000,
    features: {
      mockData: true,
      debugOverlay: true,
    },
  },
  QA: {
    name: 'QA',
    baseUrl: process.env.API_BASE_URL || 'http://10.38.12.175:5000',
    timeout: 15000,
    features: {
      mockData: false,
      debugOverlay: false,
    },
  },
  UAT: {
    name: 'UAT',
    baseUrl: process.env.API_BASE_URL || 'http://10.38.12.175:5000',
    timeout: 20000,
    features: {
      mockData: false,
      debugOverlay: false,
    },
  },
  PROD: {
    name: 'PROD',
    baseUrl: process.env.API_BASE_URL || 'http://10.38.12.175:5000',
    timeout: 25000,
    features: {
      mockData: false,
      debugOverlay: false,
    },
  },
};

const currentEnv = process.env.ENV || 'QA';

module.exports = {
  currentEnv,
  config: environments[currentEnv] || environments.QA,
  allEnvironments: environments,
};
