import { apiClient } from '@/services/common/api'
import { PATHS } from '@/services/common/paths'
import type { ApiResponse } from '@/services/common/types'
import type { 
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from './types'

export const categoriesApi = {
  // Get all categories
  getAllCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<ApiResponse<Category[]>>(PATHS.categories.list)
    return response.data.data
  },

  // Get single category by ID
  getCategoryById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<ApiResponse<Category>>(PATHS.categories.detail(id))
    return response.data.data
  },

  // Create new category (Admin only)
  createCategory: async (categoryData: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<ApiResponse<Category>>(
      PATHS.categories.create,
      categoryData
    )
    return response.data.data
  },

  // Update existing category (Admin only)
  updateCategory: async (id: string, categoryData: UpdateCategoryRequest): Promise<Category> => {
    const response = await apiClient.put<ApiResponse<Category>>(
      PATHS.categories.update(id),
      categoryData
    )
    return response.data.data
  },

  // Delete category (Admin only)
  deleteCategory: async (id: string): Promise<void> => {
    await apiClient.delete(PATHS.categories.delete(id))
  },
}
