import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext/authContext";
// Import API configuration at the top
import { API_ENDPOINTS } from "../config/api";
// import Spinner from "../components/UI/Spinner";
// import { Modal, Button } from "react-bootstrap";

interface Order {
  _id: string;
  orderItems: Array<{
    _id: string;
    product: {
      _id: string;
      name: string;
      price: number;
    };
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentReference?: string;
}

interface OrderDetails {
  shippingInfo?: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  trackingNumber?: string;
}

const OrderHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, state } = useAuth();

  // Add these state variables after the existing ones
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  // Update the useEffect to include filtered orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?._id || !state.token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        // Replace the hardcoded URL in fetchOrders function
        const response = await axios.get(API_ENDPOINTS.users.ordersbyUserId(user._id),
          //`API_ENDPOINTS./api/orders/user/${user._id}`,
          // `${
          //   API_ENDPOINTS.users.orders ||
          //   API_ENDPOINTS.users.login.replace("/login", "")
          // }/orders/user/${user._id}`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setOrders(response.data.data || []);
        setFilteredOrders(response.data.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, state.token]);

  // Add filtering and sorting logic
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    if (searchTerm) {
      result = result.filter(
        (order) =>
          order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.orderItems &&
            order.orderItems.some((item) =>
              item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
            ))
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "total":
          return b.totalAmount - a.totalAmount;
        default:
          return 0;
      }
    });

    setFilteredOrders(result);
    setCurrentPage(1);
  }, [orders, statusFilter, searchTerm, sortBy]);

  // Add pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  function getStatusBadgeClass(status: string) {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-success";
      case "processing":
        return "bg-warning";
      case "shipped":
        return "bg-info";
      case "delivered":
        return "bg-primary";
      case "cancelled":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  }

  // Add function to get card styling based on index
  function getCardStyling(index: number) {
    // Apply consistent light green header with deep green body and white text to all cards
    return {
      cardBg: "#2d4a2b", // Deep green tone for card body
      headerBg: "#7e8f6c", // Light green tone for header area
      textColor: "white", // White text for all content
    };
  }

  // Update the return statement to include filters and pagination
  return (
    <div className="container py-5">
      <h2 className="mb-4" style={{ color: "var(--text-primary)" }}>
        Order History
      </h2>

      {/* Filter Controls */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              backgroundColor: "var(--surface-color)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent-color)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border-color)";
            }}
          />
          <style>
            {`
              .form-control::placeholder {
                color: var(--text-secondary) !important;
                opacity: 0.7;
              }
              [data-bs-theme="dark"] .form-control::placeholder {
                color: rgba(255, 255, 255, 0.7) !important;
              }
            `}
          </style>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: "var(--surface-color)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              backgroundColor: "var(--surface-color)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <option value="date">Sort by Date</option>
            <option value="total">Sort by Total</option>
          </select>
        </div>
      </div>

      {/* Update the orders mapping to use currentOrders instead of orders */}
      {currentOrders.length === 0 ? (
        <div className="text-center">
          <p className="text-body">No orders found.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          {currentOrders.map((order, index) => {
            const cardStyle = getCardStyling(index);
            return (
              <div key={order._id} className="col-12 mb-4">
                <div
                  className="card border-0 shadow-sm"
                  style={{
                    background: cardStyle.cardBg,
                    color: cardStyle.textColor,
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="card-header d-flex justify-content-between align-items-center border-0"
                    style={{
                      background: cardStyle.headerBg,
                      color: cardStyle.textColor,
                      padding: "1rem 1.25rem",
                    }}
                  >
                    <span style={{ fontWeight: "600", fontSize: "0.95rem" }}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span
                      className={`badge ${getStatusBadgeClass(order.status)}`}
                      style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem" }}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="card-body" style={{ padding: "1.25rem" }}>
                    <div className="row">
                      <div className="col-md-8">
                        <h6
                          style={{
                            color: cardStyle.textColor,
                            marginBottom: "0.75rem",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                          }}
                        >
                          Items:
                        </h6>
                        {order.orderItems && order.orderItems.length > 0 ? (
                          order.orderItems.map((item) => (
                            <div
                              key={item._id}
                              className="d-flex justify-content-between mb-2"
                              style={{
                                padding: "0.5rem 0",
                                borderBottom: `1px solid ${
                                  cardStyle.textColor === "white"
                                    ? "rgba(255,255,255,0.2)"
                                    : "rgba(0,0,0,0.1)"
                                }`,
                                fontSize: "0.85rem",
                              }}
                            >
                              <span style={{ color: cardStyle.textColor }}>
                                {item.product.name} × {item.quantity}
                              </span>
                              <span
                                style={{
                                  color: cardStyle.textColor,
                                  fontWeight: "500",
                                }}
                              >
                                $
                                {(
                                  (item.price || 0) * (item.quantity || 0)
                                ).toFixed(2)}
                              </span>
                            </div>
                          ))
                        ) : (
                          <p
                            style={{
                              color:
                                cardStyle.textColor === "white"
                                  ? "rgba(255,255,255,0.7)"
                                  : "var(--text-muted)",
                              fontSize: "0.85rem",
                            }}
                          >
                            No items found
                          </p>
                        )}
                      </div>
                      <div className="col-md-4 text-md-end">
                        <p
                          className="mb-2"
                          style={{
                            color: cardStyle.textColor,
                            fontSize: "1.1rem",
                            fontWeight: "700",
                          }}
                        >
                          Total: ${(order.totalAmount || 0).toFixed(2)}
                        </p>
                        <p className="mb-3">
                          <small
                            style={{
                              color:
                                cardStyle.textColor === "white"
                                  ? "rgba(255,255,255,0.8)"
                                  : "var(--text-secondary)",
                              fontSize: "0.8rem",
                            }}
                          >
                            Ordered on:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                          </small>
                        </p>
                        <Link
                          to={`/order-confirmation/${order._id}`}
                          className="btn btn-sm"
                          style={{
                            backgroundColor:
                              cardStyle.textColor === "white"
                                ? "rgba(255,255,255,0.2)"
                                : "var(--primary-color)",
                            color:
                              cardStyle.textColor === "white"
                                ? "white"
                                : "white",
                            border: `1px solid ${
                              cardStyle.textColor === "white"
                                ? "rgba(255,255,255,0.3)"
                                : "var(--primary-color)"
                            }`,
                            borderRadius: "6px",
                            padding: "0.4rem 1rem",
                            fontSize: "0.8rem",
                            fontWeight: "500",
                            textDecoration: "none",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-1px)";
                            e.currentTarget.style.boxShadow =
                              "0 4px 8px rgba(0,0,0,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <nav className="mt-5">
          <ul
            className="pagination justify-content-center"
            style={{ gap: "0.5rem" }}
          >
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link border-0"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  backgroundColor:
                    currentPage === 1
                      ? "var(--surface-color)"
                      : "var(--primary-color)",
                  color: currentPage === 1 ? "var(--text-muted)" : "white",
                  borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  border: `1px solid ${
                    currentPage === 1
                      ? "var(--border-color)"
                      : "var(--primary-color)"
                  }`,
                  transition: "all 0.2s ease",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor =
                      "var(--accent-color)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(126, 143, 108, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.backgroundColor =
                      "var(--primary-color)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link border-0"
                  onClick={() => setCurrentPage(index + 1)}
                  style={{
                    backgroundColor:
                      currentPage === index + 1
                        ? "var(--accent-color)"
                        : "var(--surface-color)",
                    color:
                      currentPage === index + 1
                        ? "white"
                        : "var(--text-primary)",
                    borderRadius: "8px",
                    padding: "0.6rem 0.8rem",
                    fontSize: "0.85rem",
                    fontWeight: currentPage === index + 1 ? "600" : "500",
                    border: `1px solid ${
                      currentPage === index + 1
                        ? "var(--accent-color)"
                        : "var(--border-color)"
                    }`,
                    transition: "all 0.2s ease",
                    minWidth: "40px",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== index + 1) {
                      e.currentTarget.style.backgroundColor =
                        "var(--primary-color)";
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.borderColor =
                        "var(--primary-color)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 8px rgba(126, 143, 108, 0.3)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== index + 1) {
                      e.currentTarget.style.backgroundColor =
                        "var(--surface-color)";
                      e.currentTarget.style.color = "var(--text-primary)";
                      e.currentTarget.style.borderColor = "var(--border-color)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link border-0"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  backgroundColor:
                    currentPage === totalPages
                      ? "var(--surface-color)"
                      : "var(--primary-color)",
                  color:
                    currentPage === totalPages ? "var(--text-muted)" : "white",
                  borderRadius: "8px",
                  padding: "0.6rem 1rem",
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  border: `1px solid ${
                    currentPage === totalPages
                      ? "var(--border-color)"
                      : "var(--primary-color)"
                  }`,
                  transition: "all 0.2s ease",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor =
                      "var(--accent-color)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 8px rgba(126, 143, 108, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.backgroundColor =
                      "var(--primary-color)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default OrderHistoryPage;
