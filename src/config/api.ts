// Detect if we're on GitHub Pages
const isGitHubPages = window.location.hostname === 'okuselu.github.io';

// Simplified logic - use Render in production, localhost in development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://biscenic-server-4.onrender.com'
  : process.env.REACT_APP_API_URL || 'http://localhost:5050';

// Keep debug info for now
console.log('API_BASE_URL:', API_BASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

export const API_ENDPOINTS = {
  // Product endpoints
  products: `${API_BASE_URL}/api/products`,
  productById: (id: string) => `${API_BASE_URL}/api/products/${id}`,
  productsByCategory: (categoryId: string, limit?: number, exclude?: string) => {
    let url = `${API_BASE_URL}/api/products?category=${categoryId}`;
    if (limit) url += `&limit=${limit}`;
    if (exclude) url += `&exclude=${exclude}`;
    return url;
  },
  
  // Category endpoints
  categories: `${API_BASE_URL}/api/categories`,
  
  // Cart endpoints
  cart: {
    add: `${API_BASE_URL}/api/carts/add`, // Note: using /api/carts to match backend
  },
  
  // Review endpoints
  reviews: {
    byProduct: (productId: string) => `${API_BASE_URL}/api/reviews/products/${productId}/reviews`,
    create: (productId: string) => `${API_BASE_URL}/api/reviews/products/${productId}/reviews`,
  },
  
  // User endpoints
  users: {
    register: `${API_BASE_URL}/api/users/register`,
    login: `${API_BASE_URL}/api/users/login`,
    profile: `${API_BASE_URL}/api/users/profile`,
    orders: `${API_BASE_URL}/api/orders`,
  },
  
  // Order endpoints
  orders: {
    base: `${API_BASE_URL}/api/orders`,
    byId: (id: string) => `${API_BASE_URL}/api/orders/${id}`,
    userOrders: `${API_BASE_URL}/api/orders/user`,
  },
  
  // Newsletter endpoint
  newsletter: {
    subscribe: `${API_BASE_URL}/api/newsletter/subscribe`,
  },
  
  // Admin endpoints
  admin: {
    users: `${API_BASE_URL}/api/admin/users`,
    deleteUser: (id: string) => `${API_BASE_URL}/api/admin/users/${id}`,
    orders: `${API_BASE_URL}/api/admin/orders`,
    updateOrderStatus: (id: string) => `${API_BASE_URL}/api/admin/orders/${id}/status`,
    deleteProduct: (id: string) => `${API_BASE_URL}/api/products/${id}`,
    categories: `${API_BASE_URL}/api/categories`,
    deleteCategory: (id: string) => `${API_BASE_URL}/api/categories/${id}`,
    dashboard: `${API_BASE_URL}/api/admin/dashboard`,
  },
};

// export const API_ENDPOINTS = {
//   // All endpoints here
//   products: `${API_BASE_URL}/api/products`,
//   categories: `${API_BASE_URL}/api/categories`,
//   cart: {
//     add: `${API_BASE_URL}/api/cart/add`,
//   },
//   newsletter: {
//     subscribe: `${API_BASE_URL}/api/newsletter/subscribe`,
//   },
//   users: {
//     register: `${API_BASE_URL}/api/users/register`,
//     login: `${API_BASE_URL}/api/users/login`,
//     orders: `${API_BASE_URL}/api/orders`,
//   },
// };