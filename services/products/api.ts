import { apiClient } from '@/services/common/api'
import { PATHS } from '@/services/common/paths'
import type { ApiResponse } from '@/services/common/types'
import type { 
  Product, 
  GetProductsResponse,
  CreateProductRequest,
  UpdateProductRequest,
  UpdateProductImagesRequest,
  ProductManagementResponse,
  DeleteProductResponse
} from './types'

// Helper function to create FormData for file uploads
const createProductFormData = (data: CreateProductRequest | UpdateProductRequest): FormData => {
  const formData = new FormData()
  
  // Add text fields
  if ('name' in data && data.name) formData.append('name', data.name)
  if ('description' in data && data.description) formData.append('description', data.description)
  if ('price' in data && data.price !== undefined) formData.append('price', data.price.toString())
  if ('stock' in data && data.stock !== undefined) formData.append('stock', data.stock.toString())
  if ('category' in data && data.category) formData.append('category', data.category)
  
  // Add existing image IDs for updates
  if ('existingImageIds' in data && data.existingImageIds) {
    formData.append('existingImageIds', data.existingImageIds)
  }
  
  // Add image files
  if (data.images && data.images.length > 0) {
    data.images.forEach((file) => {
      formData.append('images', file)
    })
  }
  
  return formData
}

export const productsApi = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<ApiResponse<Product[]>>(PATHS.products.list)
    return response.data.data // Access the nested data property
  },

  // Get single product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<ApiResponse<Product>>(PATHS.products.detail(id))
    return response.data.data // Access the nested data property
  },

  // Create new product (Admin only)
  createProduct: async (productData: CreateProductRequest): Promise<Product> => {
    const formData = createProductFormData(productData)
    const response = await apiClient.post<ApiResponse<Product>>(
      PATHS.products.create,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  },

  // Update existing product (Admin only)
  updateProduct: async (id: string, productData: UpdateProductRequest): Promise<Product> => {
    const formData = createProductFormData(productData)
    const response = await apiClient.put<ApiResponse<Product>>(
      PATHS.products.update(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  },

  // Update product images only (Admin only)
  updateProductImages: async (id: string, imageData: UpdateProductImagesRequest): Promise<Product> => {
    const formData = new FormData()
    formData.append('existingImageIds', imageData.existingImageIds)
    
    imageData.images.forEach((file) => {
      formData.append('images', file)
    })

    const response = await apiClient.patch<ApiResponse<Product>>(
      PATHS.products.updateImages(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  },

  // Delete product (Admin only)
  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(PATHS.products.delete(id))
  },
}
