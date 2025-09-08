// Order Management Types

export interface OrderItemResponse {
  product: ProductResponse;        // Populated product data
  quantity: number;               // Quantity ordered
  price: number;                  // Price per item
}

export interface UserResponse {
  _id: string;                    // User ID
  email: string;                  // User email
  username: string;               // Username
  firstName?: string;             // First name
  lastName?: string;              // Last name
  roles: string[];                // User roles
}

export interface ProductResponse {
  _id: string;                    // Product ID
  name: string;                   // Product name
  description: string;             // Product description
  price: number;                   // Product price
  stock: number;                   // Available stock
  category: CategoryResponse;      // Populated category
  images: ProductImage[];          // Product images
}

export interface CategoryResponse {
  _id: string;                    // Category ID
  name: string;                   // Category name
  description: string;             // Category description
}

export interface ProductImage {
  url: string;                    // Image URL
  publicId: string;               // Cloudinary public ID
  isMain: boolean;                // Whether it's the main image
}

export interface OrderResponse {
  _id: string;                    // Order ID
  user: UserResponse;             // Populated user data (without password)
  shipment?: string;              // Shipment ID (if exists)
  totalAmount: number;            // Total order amount
  status: string;                 // "pending" | "completed" | "cancelled"
  paymentMethod: string;          // Payment method used
  orderItems: OrderItemResponse[]; // Array of order items
  createdAt: string;              // ISO date string
  updatedAt: string;              // ISO date string
}

// Request Types
export interface CreateOrderRequest {
  orderItems: OrderItem[];        // Required - array of order items
  totalAmount: number;            // Required - total order amount
  paymentMethod: string;          // Required - payment method
  shipment?: string;              // Optional - shipment ID
}

export interface OrderItem {
  product: string;                // Product ID
  quantity: number;               // Quantity ordered
  price: number;                  // Price per item
}

export interface UpdateOrderRequest {
  orderItems?: OrderItem[];       // Optional - updated order items
  totalAmount?: number;           // Optional - updated total amount
  paymentMethod?: string;         // Optional - updated payment method
  shipment?: string;              // Optional - updated shipment ID
}

export interface UpdateOrderStatusRequest {
  orderId: string;                // Required - order ID
  status: string;                 // Required - new status
}

// Response Types
export interface GetOrdersResponse {
  message: string;                // "Orders fetched successfully"
  data: OrderResponse[];          // Array of all orders
  error: boolean;                 // false
}

export interface GetUserOrdersResponse {
  message: string;                // "Orders fetched successfully"
  data: OrderResponse[];          // User's orders
  error: boolean;                 // false
}

export interface OrderManagementResponse {
  message: string;                // Success message
  data: OrderResponse;            // Created/Updated order
  error: boolean;                 // false
}

export interface DeleteOrderResponse {
  message: string;                // "Order deleted successfully"
  data: OrderResponse;            // Deleted order
  error: boolean;                 // false
}

// Order Status Types
export type OrderStatus = "pending" | "completed" | "cancelled"

// Order Statistics (for dashboard)
export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}
