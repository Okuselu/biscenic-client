import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { productsApi } from './api'
import type { 
  CreateProductRequest, 
  UpdateProductRequest, 
  UpdateProductImagesRequest 
} from './types'

// Query keys for better cache management
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: () => [...productKeys.lists()] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
}

// Get all products hook
export const useProducts = () => {
  return useQuery({
    queryKey: productKeys.list(),
    queryFn: productsApi.getAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single product by ID hook
export const useProduct = (id: string) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id, // Only run query if ID is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Create product mutation (Admin only)
export const useCreateProduct = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (productData: CreateProductRequest) => productsApi.createProduct(productData),
    onSuccess: (newProduct) => {
      toast({
        title: "Product Created",
        description: `${newProduct.name} has been successfully created.`,
      })
      
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
    onError: (error: any) => {
      console.error('Create product error:', error)
      toast({
        title: "Creation Failed",
        description: error.response?.data?.message || "Failed to create product. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Update product mutation (Admin only)
export const useUpdateProduct = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, productData }: { id: string; productData: UpdateProductRequest }) =>
      productsApi.updateProduct(id, productData),
    onSuccess: (updatedProduct) => {
      toast({
        title: "Product Updated",
        description: `${updatedProduct.name} has been successfully updated.`,
      })
      
      // Invalidate specific product and products list
      queryClient.invalidateQueries({ queryKey: productKeys.detail(updatedProduct._id) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
    onError: (error: any) => {
      console.error('Update product error:', error)
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update product. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Update product images mutation (Admin only)
export const useUpdateProductImages = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, imageData }: { id: string; imageData: UpdateProductImagesRequest }) =>
      productsApi.updateProductImages(id, imageData),
    onSuccess: (updatedProduct) => {
      toast({
        title: "Images Updated",
        description: `Product images have been successfully updated.`,
      })
      
      // Invalidate specific product and products list
      queryClient.invalidateQueries({ queryKey: productKeys.detail(updatedProduct._id) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
    onError: (error: any) => {
      console.error('Update images error:', error)
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update images. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Delete product mutation (Admin only)
export const useDeleteProduct = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      toast({
        title: "Product Deleted",
        description: "Product has been successfully deleted.",
      })
      
      // Remove product from cache and invalidate lists
      queryClient.removeQueries({ queryKey: productKeys.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: productKeys.lists() })
    },
    onError: (error: any) => {
      console.error('Delete product error:', error)
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    },
  })
}
