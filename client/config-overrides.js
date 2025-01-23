/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require('path');

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'),
  };
  return config;
};
