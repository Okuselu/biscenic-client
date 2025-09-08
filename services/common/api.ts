import axios from 'axios'

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://biscenic-server-4.onrender.com/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available (for admin routes)
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminLoggedIn') // Legacy cleanup
        // Only redirect if we're in an admin route
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/secure-admin'
        }
      }
    }
    
    return Promise.reject(error)
  }
)

export default apiClient
