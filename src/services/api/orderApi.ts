import axios from "axios";
import { Order, OrderItem } from "../../types/order.types";
import { API_ENDPOINTS } from "../../config/api";

const API_URL = API_ENDPOINTS;

export const orderApi = {
  // Order endpoints
  getAllOrders: async () => {
    const response = await axios.get<Order[]>(`${API_URL}/orders`);
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const response = await axios.get<Order>(`${API_URL}/orders/${orderId}`);
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: Order["status"]) => {
    const response = await axios.patch<Order>(`${API_URL}/orders/${orderId}`, {
      status,
    });
    return response.data;
  },

  // OrderItem endpoints
  getOrderItems: async (orderId: string) => {
    const response = await axios.get<OrderItem[]>(
      `${API_URL}/order-items/${orderId}`
    );
    return response.data;
  },
};
