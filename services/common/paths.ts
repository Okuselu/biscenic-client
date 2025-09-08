export const PATHS = {
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
    create: '/products',
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    updateImages: (id: string) => `/products/${id}/images`,
  },
  payments: {
    initialize: '/payments/initialize',
    verify: (reference: string) => `/payments/verify?reference=${reference}`,
  },
  auth: {
    login: '/users/login',
    register: '/users/register',
    admin: '/users/admin',
    users: '/users/users',
    deleteUser: (id: string) => `/users/users/${id}`,
    updateUserRole: (id: string) => `/users/users/${id}/role`,
  },
  categories: {
    list: '/categories',
    detail: (id: string) => `/categories/${id}`,
    create: '/categories',
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },
  orders: {
    list: '/orders',                    // Get all orders (Admin only)
    detail: (id: string) => `/orders/${id}`,
    create: '/orders',                  // Create order
    update: (id: string) => `/orders/${id}`,
    delete: (id: string) => `/orders/${id}`,
    updateStatus: '/orders/status',     // Update order status (Admin only)
    userOrders: (userId: string) => `/orders/user/${userId}`, // Get user orders
  },
}

