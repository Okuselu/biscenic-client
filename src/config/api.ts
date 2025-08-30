// Keep only this file, remove the others
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5050';

export const API_ENDPOINTS = {
  // All endpoints here
  products: `${API_BASE_URL}/api/products`,
  categories: `${API_BASE_URL}/api/categories`,
  cart: {
    add: `${API_BASE_URL}/api/cart/add`, // Note: cart vs carts inconsistency
  },
  newsletter: {
    subscribe: `${API_BASE_URL}/api/newsletter/subscribe`,
  },
  users: {
    register: `${API_BASE_URL}/api/users/register`,
    login: `${API_BASE_URL}/api/users/login`,
  },
};