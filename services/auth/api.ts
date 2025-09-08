import { apiClient } from '@/services/common/api'
import { PATHS } from '@/services/common/paths'
import type { ApiResponse } from '@/services/common/types'
import type { 
  UserLoginRequest, 
  UserRegisterRequest,
  LoginResponse,
  RegisterResponse,
  UserResponse,
  AdminCheckResponse,
  UpdateUserRoleRequest
} from './types'

export const authApi = {
  // User login
  login: async (credentials: UserLoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      PATHS.auth.login,
      credentials
    )
    // Backend returns direct response, not wrapped in ApiResponse
    return response.data
  },

  // User registration
  register: async (userData: UserRegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      PATHS.auth.register,
      userData
    )
    return response.data.data
  },

  // Admin-only endpoints
  admin: {
    // Check admin access (requires Bearer token)
    checkAccess: async (): Promise<AdminCheckResponse> => {
      const response = await apiClient.get<AdminCheckResponse>(PATHS.auth.admin)
      return response.data
    },

    // Get all users (Admin only)
    getAllUsers: async (): Promise<UserResponse[]> => {
      const response = await apiClient.get<ApiResponse<UserResponse[]>>(PATHS.auth.users)
      return response.data.data
    },

    // Delete user (Admin only)
    deleteUser: async (userId: string): Promise<void> => {
      await apiClient.delete(PATHS.auth.deleteUser(userId))
    },

    // Update user role (Admin only)
    updateUserRole: async (userId: string, roleData: UpdateUserRoleRequest): Promise<UserResponse> => {
      const response = await apiClient.put<ApiResponse<UserResponse>>(
        PATHS.auth.updateUserRole(userId),
        roleData
      )
      return response.data.data
    },
  },
}

// Token management utilities
export const tokenUtils = {
  // Store token in localStorage
  setToken: (token: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminToken', token)
    }
  },

  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('adminToken')
    }
    return null
  },

  // Remove token from localStorage
  removeToken: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminLoggedIn') // Legacy cleanup
    }
  },

  // Decode JWT token (basic decode without verification)
  decodeToken: (token: string): any => {
    try {
      const payload = token.split('.')[1]
      const decoded = atob(payload)
      return JSON.parse(decoded)
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  },

  // Check if token is expired
  isTokenExpired: (token: string): boolean => {
    try {
      const decoded = tokenUtils.decodeToken(token)
      if (!decoded || !decoded.exp) return true
      
      const currentTime = Date.now() / 1000
      return decoded.exp < currentTime
    } catch (error) {
      return true
    }
  },
}
