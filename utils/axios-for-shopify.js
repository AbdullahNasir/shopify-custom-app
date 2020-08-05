const axios = require('axios');

module.exports = (access_token) => {
  const axiosInstance = axios.create();
  // request interceptor to add Shopify access token
  axiosInstance.interceptors.request.use((config) => {
    config.headers['X-Shopify-Access-Token'] = access_token;
    return config;
  });
  return axiosInstance;
};
