import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Order } from "../types/order.types";
import Spinner from "../components/UI/Spinner";
import OrderTracking from "../components/OrderTracking";
import { useAuth } from "../context/authContext/authContext";
import "../styles/OrderTracking.css";

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams();
  const { state: authState } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data && response.data.data) {
          setOrder(response.data.data);
        } else {
          throw new Error("Invalid order data received");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    if (orderId && authState.token) {
      fetchOrder();
    }
  }, [orderId, authState.token]);

  if (loading) return <Spinner />;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!order)
    return <div className="text-center py-5 text-muted">Order not found</div>;

  const getStatusBadgeClass = (status: string) => {
    return "text-white";
  };

  const getStatusBadgeStyle = (status: string) => {
    const baseStyle = {
      backgroundColor: 'var(--primary-color)',
      color: 'white',
      border: 'none',
      fontWeight: '600'
    };
    
    switch (status) {
      case "paid":
        return { ...baseStyle, backgroundColor: 'var(--success-color)' };
      case "pending":
        return { ...baseStyle, backgroundColor: 'var(--warning-color)', color: 'var(--text-primary)' };
      case "failed":
        return { ...baseStyle, backgroundColor: 'var(--error-color)' };
      default:
        return { ...baseStyle, backgroundColor: 'var(--primary-color)' };
    }
  };

  // Calculate dynamic pricing
  const calculateSubtotal = (): number => {
    if (!order) return 0;

    if (order.orderItems && order.orderItems.length > 0) {
      return order.orderItems.reduce((sum: number, orderItem: { price: any; quantity: any; }) => {
        const price = typeof orderItem.price === "number" ? orderItem.price : 0;
        const quantity =
          typeof orderItem.quantity === "number" ? orderItem.quantity : 0;
        return sum + price * quantity;
      }, 0);
    } else if (order.items && order.items.length > 0) {
      return order.items.reduce((sum, item) => {
        const price = typeof item.price === "number" ? item.price : 0;
        const quantity = typeof item.quantity === "number" ? item.quantity : 0;
        return sum + price * quantity;
      }, 0);
    }
    return 0;
  };

  const subtotal = calculateSubtotal();
  const shippingCost = 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container py-3 py-md-5">
      {/* Success Header */}
      <div className="text-center mb-4 mb-md-5">
        <div className="mb-3">
          <i
            className="bi bi-check-circle-fill"
            style={{ fontSize: "3rem", color: "var(--success-color)" }}
          ></i>
        </div>
        <h1
          className="display-6 fw-bold mb-2"
          style={{ color: "var(--primary-color)", fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
        >
          Order Confirmed!
        </h1>
        <p className="lead mb-3" style={{ 
          fontSize: "clamp(1rem, 2.5vw, 1.25rem)",
          color: "var(--text-secondary)"
        }}>
          Thank you for your purchase. Your order has been successfully placed.
        </p>
        
        {/* Mobile-optimized order info */}
        <div className="d-flex flex-column flex-sm-row align-items-center justify-content-center gap-2 gap-sm-3 p-3 border rounded shadow-sm" style={{
          backgroundColor: 'var(--surface-color)',
          borderColor: 'var(--border-color)'
        }}>
          <div className="text-center text-sm-start">
            <small className="d-block" style={{ color: 'var(--text-muted)' }}>Order Number</small>
            <strong className="h6 h5-sm mb-0" style={{ color: 'var(--text-primary)' }}>
              #{order._id?.slice(-8).toUpperCase()}
            </strong>
          </div>
          <div className="vr opacity-50 d-none d-sm-block" style={{ borderColor: 'var(--border-color)' }}></div>
          <hr className="w-50 d-sm-none my-2" style={{ borderColor: 'var(--border-color)' }} />
          <div className="text-center text-sm-start">
            <small className="d-block" style={{ color: 'var(--text-muted)' }}>Order Date</small>
            <strong style={{ color: 'var(--text-primary)' }}>
              {order.createdAt ? formatDate(order.createdAt) : "N/A"}
            </strong>
          </div>
          <div className="vr opacity-50 d-none d-sm-block" style={{ borderColor: 'var(--border-color)' }}></div>
          <hr className="w-50 d-sm-none my-2" style={{ borderColor: 'var(--border-color)' }} />
          <div className="text-center text-sm-start">
            <small className="d-block" style={{ color: 'var(--text-muted)' }}>Status</small>
            <span 
              className={`badge ${getStatusBadgeClass(order.status)} fs-6`}
              style={getStatusBadgeStyle(order.status)}
            >
              {order.status.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="row g-3 g-md-4">
        {/* Order Summary */}
        <div className="col-12 col-lg-8">
          <div className="card h-100 shadow-sm" style={{
            backgroundColor: 'var(--surface-color)',
            borderColor: 'var(--border-color)'
          }}>
            <div 
              className="card-header border-0 text-white"
              style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                borderRadius: '0.375rem 0.375rem 0 0'
              }}
            >
              <h5 className="mb-0" style={{ fontWeight: '600', fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}>
                <i className="bi bi-bag-check me-2"></i>
                Order Summary
              </h5>
            </div>
            <div className="card-body" style={{ backgroundColor: 'var(--surface-color)' }}>
              {order.orderItems && order.orderItems.length > 0 ? (
                <div className="table-responsive">
                  {/* Mobile-first table design */}
                  <table className="table table-borderless mb-0 d-none d-md-table">
                    <thead>
                      <tr className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                        <th className="py-3" style={{ color: 'white', fontWeight: '600' }}>Product</th>
                        <th className="text-center py-3" style={{ color: 'white', fontWeight: '600' }}>Quantity</th>
                        <th className="text-end py-3" style={{ color: 'white', fontWeight: '600' }}>Unit Price</th>
                        <th className="text-end py-3" style={{ color: 'white', fontWeight: '600' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.orderItems?.map((orderItem, index) => (
                        <tr key={index} className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div>
                                <h6 className="mb-0" style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                                  {orderItem.product?.name || "Unknown Product"}
                                </h6>
                                <small style={{ color: 'var(--text-muted)' }}>
                                  Product ID: {orderItem.product?._id || "N/A"}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-3">
                            <span 
                              className="badge text-white"
                              style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                              {orderItem.quantity || 0}
                            </span>
                          </td>
                          <td className="text-end py-3">
                            <strong style={{ color: 'var(--text-primary)' }}>
                              ${(orderItem.price || 0).toFixed(2)}
                            </strong>
                          </td>
                          <td className="text-end py-3">
                            <strong style={{ color: 'var(--primary-color)' }}>
                              $
                              {(
                                (orderItem.price || 0) *
                                (orderItem.quantity || 0)
                              ).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      )) || []}
                    </tbody>
                  </table>
                  
                  {/* Mobile card layout */}
                  <div className="d-md-none">
                    {order.orderItems?.map((orderItem, index) => (
                      <div key={index} className="border rounded p-3 mb-3" style={{
                        backgroundColor: 'var(--background-color)',
                        borderColor: 'var(--border-color)'
                      }}>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1" style={{ 
                              fontSize: '0.9rem', 
                              fontWeight: '600',
                              color: 'var(--text-primary)'
                            }}>
                              {orderItem.product?.name || "Unknown Product"}
                            </h6>
                            <small style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              ID: {orderItem.product?._id?.slice(-8) || "N/A"}
                            </small>
                          </div>
                          <span 
                            className="badge text-white ms-2"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                          >
                            Qty: {orderItem.quantity || 0}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            ${(orderItem.price || 0).toFixed(2)} each
                          </span>
                          <strong style={{ color: 'var(--primary-color)' }}>
                            ${((orderItem.price || 0) * (orderItem.quantity || 0)).toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    )) || []}
                  </div>
                </div>
              ) : order.items && order.items.length > 0 ? (
                <div className="table-responsive">
                  {/* Desktop table */}
                  <table className="table table-borderless mb-0 d-none d-md-table">
                    <thead>
                      <tr className="border-bottom" style={{ borderColor: 'var(--border-color)' }}>
                        <th className="py-3" style={{ color: 'white', fontWeight: '600' }}>Product</th>
                        <th className="text-center py-3" style={{ color: 'white', fontWeight: '600' }}>Quantity</th>
                        <th className="text-end py-3" style={{ color: 'white', fontWeight: '600' }}>Unit Price</th>
                        <th className="text-end py-3" style={{ color: 'white', fontWeight: '600' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item._id} className="border-bottom">
                          <td className="py-3">
                            <div className="d-flex align-items-center">
                              <div>
                                <h6 className="mb-0" style={{ fontWeight: '600' }}>
                                  {item.name || "Unknown Product"}
                                </h6>
                                <small className="text-muted">
                                  Product ID: {item._id || "N/A"}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-3">
                            <span 
                              className="badge text-white"
                              style={{ backgroundColor: 'var(--primary-color)' }}
                            >
                              {item.quantity || 0}
                            </span>
                          </td>
                          <td className="text-end py-3">
                            <strong className="text-body">
                              ${(item.price || 0).toFixed(2)}
                            </strong>
                          </td>
                          <td className="text-end py-3">
                            <strong style={{ color: 'var(--primary-color)' }}>
                              $
                              {(
                                (item.price || 0) * (item.quantity || 0)
                              ).toFixed(2)}
                            </strong>
                          </td>
                        </tr>
                      )) || []}
                    </tbody>
                  </table>
                  
                  {/* Mobile card layout */}
                  <div className="d-md-none">
                    {order.items?.map((item) => (
                      <div key={item._id} className="border rounded p-3 mb-3 bg-body-tertiary">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 text-body" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                              {item.name || "Unknown Product"}
                            </h6>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                              ID: {item._id?.slice(-8) || "N/A"}
                            </small>
                          </div>
                          <span 
                            className="badge text-white ms-2"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                          >
                            Qty: {item.quantity || 0}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="text-muted" style={{ fontSize: '0.85rem' }}>
                            ${(item.price || 0).toFixed(2)} each
                          </span>
                          <strong style={{ color: 'var(--primary-color)' }}>
                            ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                          </strong>
                        </div>
                      </div>
                    )) || []}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i
                    className="bi bi-exclamation-circle"
                    style={{ fontSize: "2rem", color: "var(--warning-color)" }}
                  ></i>
                  <p className="mt-2" style={{ color: 'var(--text-muted)' }}>
                    No items found in this order
                  </p>
                </div>
              )}

              {/* Pricing Breakdown */}
              <div className="border-top pt-3 mt-3" style={{ borderColor: 'var(--border-color)' }}>
                <div className="row">
                  <div className="col-12 col-md-6 offset-md-6">
                    <div className="border rounded p-3" style={{
                      backgroundColor: 'var(--background-color)',
                      borderColor: 'var(--border-color)'
                    }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span style={{ color: 'var(--text-primary)' }}>Subtotal:</span>
                        <span style={{ color: 'var(--text-primary)' }}>
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span style={{ color: 'var(--text-primary)' }}>Shipping:</span>
                        <span style={{ color: 'var(--text-primary)' }}>
                          {shippingCost === 0
                            ? "FREE"
                            : `$${Number(shippingCost).toFixed(2)}`}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span style={{ color: 'var(--text-primary)' }}>Tax:</span>
                        <span style={{ color: 'var(--text-primary)' }}>${tax.toFixed(2)}</span>
                      </div>
                      <hr style={{ borderColor: 'var(--border-color)' }} />
                      <div className="d-flex justify-content-between">
                        <strong className="h6 h5-md" style={{ color: 'var(--text-primary)' }}>Total:</strong>
                        <strong
                          className="h6 h5-md"
                          style={{ color: "var(--primary-color)" }}
                        >
                          ${(order.total || total).toFixed(2)}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="col-12 col-lg-4">
          {/* Shipping Information */}
          <div className="card mb-3 mb-md-4 shadow-sm" style={{
            backgroundColor: 'var(--surface-color)',
            borderColor: 'var(--border-color)'
          }}>
            <div 
              className="card-header border-0 text-white"
              style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                borderRadius: '0.375rem 0.375rem 0 0'
              }}
            >
              <h6 className="mb-0" style={{ fontWeight: '600', fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>
                <i className="bi bi-truck me-2"></i>
                Shipping Information
              </h6>
            </div>
            <div className="card-body" style={{ backgroundColor: 'var(--surface-color)' }}>
              {order.shippingInfo ? (
                <div>
                  <div className="mb-3">
                    <strong
                      className="d-block"
                      style={{ fontSize: "0.9rem", color: 'var(--text-primary)' }}
                    >
                      {order.shippingInfo.firstName}{" "}
                      {order.shippingInfo.lastName}
                    </strong>
                    <small style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      <i className="bi bi-envelope me-1"></i>
                      {order.shippingInfo.email}
                    </small>
                  </div>
                  <div className="mb-3">
                    <h6 className="mb-2" style={{ fontSize: "0.85rem", color: 'var(--text-primary)' }}>
                      <i className="bi bi-geo-alt me-1"></i>
                      Delivery Address
                    </h6>
                    <div style={{ fontSize: '0.8rem', lineHeight: '1.4', color: 'var(--text-muted)' }}>
                      <div>{order.shippingInfo.address}</div>
                      <div>
                        {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                        {order.shippingInfo.zipCode}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h6 className="mb-2" style={{ fontSize: "0.85rem", color: 'var(--text-primary)' }}>
                      <i className="bi bi-telephone me-1"></i>
                      Contact
                    </h6>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {order.shippingInfo.phone}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3">
                  <i
                    className="bi bi-exclamation-circle"
                    style={{ fontSize: "1.5rem", color: "var(--warning-color)" }}
                  ></i>
                  <p className="mt-2 mb-0" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Shipping information not available
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="card shadow-sm" style={{
            backgroundColor: 'var(--surface-color)',
            borderColor: 'var(--border-color)'
          }}>
            <div 
              className="card-header border-0 text-white"
              style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                borderRadius: '0.375rem 0.375rem 0 0'
              }}
            >
              <h6 className="mb-0" style={{ fontWeight: '600', fontSize: "clamp(0.9rem, 2vw, 1rem)" }}>
                <i className="bi bi-credit-card me-2"></i>
                Payment Information
              </h6>
            </div>
            <div className="card-body" style={{ backgroundColor: 'var(--surface-color)' }}>
              <div className="mb-3">
                <small className="d-block mb-1" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment Reference</small>
                <div className="d-flex align-items-center">
                  <code 
                    className="px-2 py-1 rounded flex-grow-1 me-2" 
                    style={{ 
                      fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
                      wordBreak: 'break-all',
                      backgroundColor: 'var(--background-color)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    {order.paymentReference || "N/A"}
                  </code>
                  <button
                    className="btn btn-sm"
                    style={{
                      backgroundColor: 'var(--primary-color)',
                      borderColor: 'var(--primary-color)',
                      color: 'white',
                      fontSize: '0.7rem',
                      padding: '0.25rem 0.5rem'
                    }}
                    onClick={() =>
                      navigator.clipboard.writeText(order.paymentReference || "")
                    }
                  >
                    <i className="bi bi-clipboard" style={{ fontSize: '0.8rem' }}></i>
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <small className="d-block mb-1" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment Status</small>
                <span
                  className={`badge ${getStatusBadgeClass(order.status)} fs-6`}
                  style={getStatusBadgeStyle(order.status)}
                >
                  {order.status.toUpperCase()}
                </span>
              </div>
              <div>
                <small className="d-block mb-1" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Payment Method</small>
                <div className="d-flex align-items-center" style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                  <i className="bi bi-credit-card me-2"></i>
                  Paystack
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center mt-4 mt-md-5">
        <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 justify-content-center">
          <Link 
            to="/products" 
            className="btn btn-lg px-3 px-md-4 text-white"
            style={{ 
              backgroundColor: 'var(--primary-color)',
              borderColor: 'var(--primary-color)',
              fontSize: "clamp(0.9rem, 2vw, 1rem)",
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-color)';
              e.currentTarget.style.borderColor = 'var(--accent-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-color)';
              e.currentTarget.style.borderColor = 'var(--primary-color)';
            }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Continue Shopping
          </Link>
          <Link
            to="/order-history"
            className="btn px-4 py-2"
            style={{ 
              backgroundColor: 'transparent',
              borderColor: 'var(--primary-color)',
              color: 'var(--primary-color)',
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-color)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--primary-color)';
            }}
          >
            <i className="bi bi-list-ul me-2"></i>
            View All Orders
          </Link>
          <button
            className="btn px-4 py-2"
            style={{ 
              backgroundColor: 'transparent',
              borderColor: 'var(--text-muted)',
              color: 'var(--text-muted)',
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              transition: 'all var(--transition-normal)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--text-muted)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            onClick={() => window.print()}
          >
            <i className="bi bi-printer me-2" style={{ fontSize: "clamp(0.8rem, 1.8vw, 0.9rem)" }}></i>
            Print Order
          </button>
        </div>
      </div>

      {/* Order Tracking */}
      <div className="mt-4 mt-md-5">
        <OrderTracking 
          status={order.status}
          createdAt={order.createdAt || ''}
          updatedAt={order.updatedAt || ''}
        />
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
