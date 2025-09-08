import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { categoriesApi } from './api'
import type { 
  CreateCategoryRequest, 
  UpdateCategoryRequest
} from './types'

// Query keys for better cache management
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: string) => [...categoryKeys.details(), id] as const,
}

// Get all categories hook
export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: categoriesApi.getAllCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes - categories change less frequently
  })
}

// Get single category by ID hook
export const useCategory = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoriesApi.getCategoryById(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Create category mutation (Admin only)
export const useCreateCategory = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (categoryData: CreateCategoryRequest) => categoriesApi.createCategory(categoryData),
    onSuccess: (newCategory) => {
      toast({
        title: "Category Created",
        description: `${newCategory.name} has been successfully created.`,
      })
      
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
    onError: (error: any) => {
      console.error('Create category error:', error)
      toast({
        title: "Creation Failed",
        description: error.response?.data?.message || "Failed to create category. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Update category mutation (Admin only)
export const useUpdateCategory = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, categoryData }: { id: string; categoryData: UpdateCategoryRequest }) =>
      categoriesApi.updateCategory(id, categoryData),
    onSuccess: (updatedCategory) => {
      toast({
        title: "Category Updated",
        description: `${updatedCategory.name} has been successfully updated.`,
      })
      
      queryClient.invalidateQueries({ queryKey: categoryKeys.detail(updatedCategory._id) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
    onError: (error: any) => {
      console.error('Update category error:', error)
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update category. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Delete category mutation (Admin only)
export const useDeleteCategory = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: (_, deletedId) => {
      toast({
        title: "Category Deleted",
        description: "Category has been successfully deleted.",
      })
      
      queryClient.removeQueries({ queryKey: categoryKeys.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() })
    },
    onError: (error: any) => {
      console.error('Delete category error:', error)
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete category. Please try again.",
        variant: "destructive",
      })
    },
  })
}
