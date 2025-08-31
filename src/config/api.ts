// Detect if we're on GitHub Pages
const isGitHubPages = window.location.hostname === 'okuselu.github.io';

const API_BASE_URL = isGitHubPages 
  ? 'https://biscenic-server-4.onrender.com'
  : process.env.REACT_APP_API_URL || 'http://localhost:5050';

// Remove debug lines in production
console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', process.env.REACT_APP_API_URL);

export const API_ENDPOINTS = {
  // All endpoints here
  products: `${API_BASE_URL}/api/products`,
  categories: `${API_BASE_URL}/api/categories`,
  cart: {
    add: `${API_BASE_URL}/api/cart/add`,
  },
  newsletter: {
    subscribe: `${API_BASE_URL}/api/newsletter/subscribe`,
  },
  users: {
    register: `${API_BASE_URL}/api/users/register`,
    login: `${API_BASE_URL}/api/users/login`,
    orders: `${API_BASE_URL}/api/orders`,
  },
};