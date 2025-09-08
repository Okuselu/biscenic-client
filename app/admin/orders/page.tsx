"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogOverlay, DialogPortal } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Eye, Truck, Loader2, Calendar, User, CreditCard, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// API Hooks
import { 
  useOrders, 
  useUpdateOrderStatus,
  useDeleteOrder,
  useOrderStats
} from "@/services/orders/queries"
import type { OrderResponse, OrderStatus } from "@/services/orders/types"

export default function AdminOrdersPage() {
  const { toast } = useToast()
  
  // API hooks
  const { data: ordersData, isLoading, error } = useOrders()
  const orders = Array.isArray(ordersData) ? ordersData : []
  const { data: stats } = useOrderStats()
  const updateStatusMutation = useUpdateOrderStatus()
  const deleteOrderMutation = useDeleteOrder()

  // Modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null)
  const [newStatus, setNewStatus] = useState<string>("")

  const handleViewDetails = (order: OrderResponse) => {
    setSelectedOrder(order)
    setIsViewModalOpen(true)
  }

  const handleUpdateStatus = (order: OrderResponse) => {
    setSelectedOrder(order)
    setNewStatus(order.status)
    setIsStatusModalOpen(true)
  }

  const confirmStatusUpdate = async () => {
    if (!selectedOrder || !newStatus || newStatus === selectedOrder.status) {
      setIsStatusModalOpen(false)
      return
    }
    
    try {
      await updateStatusMutation.mutateAsync({
        orderId: selectedOrder._id,
        status: newStatus
      })
      setIsStatusModalOpen(false)
      setSelectedOrder(null)
      setNewStatus("")
    } catch (error) {
      console.error("Status update failed:", error)
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
  }

  const getMainImage = (images: any[]) => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return "/placeholder.svg?height=50&width=50"
    }
    const mainImage = images.find(img => img?.isMain)
    return mainImage?.url || images[0]?.url || "/placeholder.svg?height=50&width=50"
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Loading orders...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error Loading Orders</CardTitle>
            <CardDescription>
              Failed to load orders. Please check your connection and try again.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-12">
      <Card className="w-full max-w-7xl shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-2xl font-bold tracking-wide">Order Management</CardTitle>
            <CardDescription>
              Manage customer orders and track order status. {orders.length} orders total.
            </CardDescription>
          </div>
          
          {/* Order Statistics */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{stats.totalOrders}</p>
                <p className="text-xs text-blue-800">Total Orders</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                <p className="text-xs text-yellow-800">Pending</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{stats.completedOrders}</p>
                <p className="text-xs text-green-800">Completed</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-xs text-purple-800">Revenue</p>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.filter(order => order && order._id).map((order) => (
                  <TableRow key={order._id} className="hover:bg-gray-50 transition-colors">
                    <TableCell className="font-medium">
                      #{order._id.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.user.username}</p>
                        <p className="text-sm text-gray-500">{order.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {(order.orderItems || []).slice(0, 3).map((item, index) => (
                            item?.product ? (
                              <Image
                                key={index}
                                src={getMainImage(item.product.images)}
                                alt={item.product.name || 'Product'}
                                width={32}
                                height={32}
                                className="rounded-full border-2 border-white object-cover"
                              />
                            ) : (
                              <div
                                key={index}
                                className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center"
                              >
                                <span className="text-xs text-gray-500">?</span>
                              </div>
                            )
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {(order.orderItems || []).length} item{(order.orderItems || []).length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(order.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {order.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeClass(order.status)} border`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(order)}
                        className="hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleUpdateStatus(order)}
                        className="hover:bg-green-100"
                        disabled={updateStatusMutation.isPending}
                      >
                        <Truck className="h-4 w-4 text-green-600" />
                        <span className="sr-only">Update Status</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {orders.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No orders found</p>
              <p className="text-gray-400 text-sm">Orders will appear here once customers place them.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" style={{ zIndex: 9998 }} />
          <DialogContent 
            className="fixed left-[50%] top-[50%] grid w-full max-w-4xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-2xl duration-200 overflow-y-auto rounded-lg" 
            style={{ zIndex: 9999 }}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Order Details</span>
              </DialogTitle>
              <DialogDescription>
                Complete order information and items
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Customer</p>
                      <p className="font-medium">{selectedOrder.user.username}</p>
                      <p className="text-sm text-gray-500">{selectedOrder.user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Payment</p>
                      <p className="font-medium">{selectedOrder.paymentMethod}</p>
                      <Badge className={getStatusBadgeClass(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {(selectedOrder.orderItems || []).map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                        {item?.product ? (
                          <>
                            <Image
                              src={getMainImage(item.product.images)}
                              alt={item.product.name || 'Product'}
                              width={60}
                              height={60}
                              className="rounded-md object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.product.name}</h4>
                              <p className="text-sm text-gray-600">{item.product.category?.name || 'Unknown Category'}</p>
                              <p className="text-xs text-gray-500">{item.product.description || 'No description'}</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-15 h-15 bg-gray-200 rounded-md flex items-center justify-center">
                              <span className="text-gray-500 text-sm">No Image</span>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-red-500">Product Not Found</h4>
                              <p className="text-sm text-gray-600">Unknown Category</p>
                              <p className="text-xs text-gray-500">This product may have been deleted</p>
                            </div>
                          </>
                        )}
                        <div className="text-right">
                          <p className="font-medium">Qty: {item.quantity}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                          <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </span>
                  </div>
                  {selectedOrder.shipment && (
                    <p className="text-sm text-gray-600 mt-2">
                      Shipment ID: {selectedOrder.shipment}
                    </p>
                  )}
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-w-md bg-white">
            <DialogHeader>
              <DialogTitle>Update Order Status</DialogTitle>
              <DialogDescription>
                Change the status of order #{selectedOrder?._id.slice(-6).toUpperCase()}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Status</label>
                <p className="text-lg font-semibold capitalize">{selectedOrder?.status}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">New Status</label>
                <div className="relative">
                  <Select 
                    value={newStatus} 
                    onValueChange={setNewStatus}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select new status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsStatusModalOpen(false)}
                disabled={updateStatusMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmStatusUpdate}
                disabled={updateStatusMutation.isPending || !newStatus || newStatus === selectedOrder?.status}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {updateStatusMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}