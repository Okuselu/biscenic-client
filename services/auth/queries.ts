import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi, tokenUtils } from './api'
import type { UserLoginRequest, UserRegisterRequest } from './types'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

// Query keys for auth operations
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  users: () => [...authKeys.all, 'users'] as const,
  adminCheck: () => [...authKeys.all, 'adminCheck'] as const,
}

// Login mutation
export const useLogin = () => {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: UserLoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      // Store token
      tokenUtils.setToken(data.token)
      
      // Check if user is admin
      const isAdmin = data.user.roles.includes('admin')
      
      if (isAdmin) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.username}!`,
        })
        
        // Invalidate auth queries
        queryClient.invalidateQueries({ queryKey: authKeys.all })
        
        // Redirect to admin dashboard
        router.push('/admin/dashboard')
      } else {
        toast({
          title: "Access Denied",
          description: "Admin access required.",
          variant: "destructive",
        })
        tokenUtils.removeToken()
      }
    },
    onError: (error: any) => {
      console.error('Login error:', error)
      toast({
        title: "Login Failed",
        description: error.response?.data?.message || "Invalid email or password.",
        variant: "destructive",
      })
    },
  })
}

// Register mutation
export const useRegister = () => {
  const { toast } = useToast()

  return useMutation({
    mutationFn: (userData: UserRegisterRequest) => authApi.register(userData),
    onSuccess: (data) => {
      toast({
        title: "Registration Successful",
        description: `Account created for ${data.data.username}`,
      })
    },
    onError: (error: any) => {
      console.error('Registration error:', error)
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Registration failed. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Admin access check query
export const useAdminCheck = (enabled: boolean = true) => {
  return useQuery({
    queryKey: authKeys.adminCheck(),
    queryFn: authApi.admin.checkAccess,
    enabled: enabled && !!tokenUtils.getToken(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get all users (Admin only)
export const useAdminUsers = () => {
  return useQuery({
    queryKey: authKeys.users(),
    queryFn: authApi.admin.getAllUsers,
    enabled: !!tokenUtils.getToken(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Delete user mutation (Admin only)
export const useDeleteUser = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => authApi.admin.deleteUser(userId),
    onSuccess: () => {
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted.",
      })
      queryClient.invalidateQueries({ queryKey: authKeys.users() })
    },
    onError: (error: any) => {
      console.error('Delete user error:', error)
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete user.",
        variant: "destructive",
      })
    },
  })
}

// Update user role mutation (Admin only)
export const useUpdateUserRole = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, roleData }: { userId: string; roleData: any }) =>
      authApi.admin.updateUserRole(userId, roleData),
    onSuccess: () => {
      toast({
        title: "Role Updated",
        description: "User role has been successfully updated.",
      })
      queryClient.invalidateQueries({ queryKey: authKeys.users() })
    },
    onError: (error: any) => {
      console.error('Update role error:', error)
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update user role.",
        variant: "destructive",
      })
    },
  })
}

// Logout function
export const useLogout = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return () => {
    // Remove token
    tokenUtils.removeToken()
    
    // Clear all auth queries
    queryClient.removeQueries({ queryKey: authKeys.all })
    
    // Show toast
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    
    // Redirect to login
    router.push('/secure-admin')
  }
}
