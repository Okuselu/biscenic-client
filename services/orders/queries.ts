import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { ordersApi } from './api'
import type { 
  CreateOrderRequest, 
  UpdateOrderRequest,
  UpdateOrderStatusRequest
} from './types'

// Query keys for better cache management
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: () => [...orderKeys.lists()] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  userOrders: (userId: string) => [...orderKeys.all, 'user', userId] as const,
  stats: () => [...orderKeys.all, 'stats'] as const,
}

// Get all orders hook (Admin only)
export const useOrders = () => {
  return useQuery({
    queryKey: orderKeys.list(),
    queryFn: ordersApi.getAllOrders,
    staleTime: 2 * 60 * 1000, // 2 minutes - orders change frequently
  })
}

// Get single order by ID hook
export const useOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get user orders hook
export const useUserOrders = (userId: string) => {
  return useQuery({
    queryKey: orderKeys.userOrders(userId),
    queryFn: () => ordersApi.getUserOrders(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

// Get order statistics hook (Admin only)
export const useOrderStats = () => {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: ordersApi.getOrderStats,
    staleTime: 5 * 60 * 1000, // 5 minutes - stats don't change as frequently
  })
}

// Create order mutation
export const useCreateOrder = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderData: CreateOrderRequest) => ordersApi.createOrder(orderData),
    onSuccess: (newOrder) => {
      toast({
        title: "Order Created",
        description: `Order #${newOrder._id.slice(-6)} has been successfully created.`,
      })
      
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() })
    },
    onError: (error: any) => {
      console.error('Create order error:', error)
      toast({
        title: "Order Creation Failed",
        description: error.response?.data?.message || "Failed to create order. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Update order mutation
export const useUpdateOrder = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, orderData }: { id: string; orderData: UpdateOrderRequest }) =>
      ordersApi.updateOrder(id, orderData),
    onSuccess: (updatedOrder) => {
      toast({
        title: "Order Updated",
        description: `Order #${updatedOrder._id.slice(-6)} has been successfully updated.`,
      })
      
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(updatedOrder._id) })
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() })
    },
    onError: (error: any) => {
      console.error('Update order error:', error)
      toast({
        title: "Update Failed",
        description: error.response?.data?.message || "Failed to update order. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Update order status mutation (Admin only)
export const useUpdateOrderStatus = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (statusData: UpdateOrderStatusRequest) => ordersApi.updateOrderStatus(statusData),
    onSuccess: (updatedOrder) => {
      toast({
        title: "Status Updated",
        description: `Order #${updatedOrder._id.slice(-6)} status changed to ${updatedOrder.status}.`,
      })
      
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(updatedOrder._id) })
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() })
    },
    onError: (error: any) => {
      console.error('Update order status error:', error)
      toast({
        title: "Status Update Failed",
        description: error.response?.data?.message || "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    },
  })
}

// Delete order mutation (Admin only)
export const useDeleteOrder = () => {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => ordersApi.deleteOrder(id),
    onSuccess: (_, deletedId) => {
      toast({
        title: "Order Deleted",
        description: "Order has been successfully deleted.",
      })
      
      queryClient.removeQueries({ queryKey: orderKeys.detail(deletedId) })
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() })
      queryClient.invalidateQueries({ queryKey: orderKeys.stats() })
    },
    onError: (error: any) => {
      console.error('Delete order error:', error)
      toast({
        title: "Delete Failed",
        description: error.response?.data?.message || "Failed to delete order. Please try again.",
        variant: "destructive",
      })
    },
  })
}
