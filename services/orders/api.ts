import { apiClient } from '@/services/common/api'
import { PATHS } from '@/services/common/paths'
import type { ApiResponse } from '@/services/common/types'
import type { 
  OrderResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  UpdateOrderStatusRequest,
  GetOrdersResponse,
  GetUserOrdersResponse,
  OrderManagementResponse,
  DeleteOrderResponse
} from './types'

export const ordersApi = {
  // Get all orders (Admin only)
  getAllOrders: async (): Promise<OrderResponse[]> => {
    const response = await apiClient.get<ApiResponse<OrderResponse[]>>(PATHS.orders.list)
    // Handle both nested and direct response structures
    return response.data.data || response.data || []
  },

  // Get single order by ID
  getOrderById: async (id: string): Promise<OrderResponse> => {
    const response = await apiClient.get<ApiResponse<OrderResponse>>(PATHS.orders.detail(id))
    return response.data.data
  },

  // Get user orders
  getUserOrders: async (userId: string): Promise<OrderResponse[]> => {
    const response = await apiClient.get<ApiResponse<OrderResponse[]>>(PATHS.orders.userOrders(userId))
    return response.data.data
  },

  // Create new order
  createOrder: async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
    const response = await apiClient.post<ApiResponse<OrderResponse>>(
      PATHS.orders.create,
      orderData
    )
    return response.data.data
  },

  // Update existing order
  updateOrder: async (id: string, orderData: UpdateOrderRequest): Promise<OrderResponse> => {
    const response = await apiClient.patch<ApiResponse<OrderResponse>>(
      PATHS.orders.update(id),
      orderData
    )
    return response.data.data
  },

  // Update order status (Admin only)
  updateOrderStatus: async (statusData: UpdateOrderStatusRequest): Promise<OrderResponse> => {
    const response = await apiClient.put<ApiResponse<OrderResponse>>(
      PATHS.orders.updateStatus,
      statusData
    )
    return response.data.data
  },

  // Delete order (Admin only)
  deleteOrder: async (id: string): Promise<void> => {
    await apiClient.delete(PATHS.orders.delete(id))
  },

  // Helper functions for order statistics
  getOrderStats: async (): Promise<{
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
  }> => {
    const orders = await ordersApi.getAllOrders()
    
    const stats = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(order => order.status === 'pending').length,
      completedOrders: orders.filter(order => order.status === 'completed').length,
      cancelledOrders: orders.filter(order => order.status === 'cancelled').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      averageOrderValue: 0
    }
    
    stats.averageOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0
    
    return stats
  }
}
