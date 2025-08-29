import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cartContext/CartContext";
import { useAuth } from "../context/authContext/authContext";
import axios from "axios";
import { handleAuthError } from '../utils/authUtils';

interface PaystackConfig {
  key: string;
  email: string;
  amount: number;
  currency: string;
  firstname: string;
  lastname: string;
  phone: string;
  ref: string;
  callback: (response: PaystackResponse) => void;
  onClose: () => void;
}

interface PaystackResponse {
  reference: string;
  status: "success" | "failed";
  trans: string;
  transaction: string;
  message: string;
}

declare const PaystackPop: {
  setup: (config: PaystackConfig) => {
    openIframe: () => void;
  };
};

declare global {
  interface Window {
    PaystackPop: typeof PaystackPop;
  }
}

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const { user, state: authState } = useAuth();

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  });

  // Prefill form with user data when component mounts
  useEffect(() => {
    if (user) {
      setShippingInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // CRITICAL: Validate cart before payment
    if (!state.items || state.items.length === 0) {
        setError("Your cart is empty. Please add items before checkout.");
        return;
    }
    
    // Save cart state before payment (in case of redirect)
    localStorage.setItem('checkoutCart', JSON.stringify(state));
    
    setIsProcessing(true);

    // Add user check at the start of handleSubmit
    if (!authState.token || !user) {
      setError("Please login to complete your order");
      navigate('/login');
      return;
    }

    if (!state.items || state.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    if (typeof window.PaystackPop === "undefined") {
      setError("Payment service not available. Please refresh the page.");
      setIsProcessing(false);
      return;
    }

    try {
      function handlePaystackResponse(response: PaystackResponse) {
        if (response.status === "success") {
          const createOrder = async () => {
            try {
              // Debug the cart state
              console.log('Cart State:', state);
              console.log('Cart Items:', state.items);
              console.log('Cart Items Length:', state.items.length);
              
              // Check if cart is empty
              if (!state.items || state.items.length === 0) {
                console.error('Cart is empty when trying to create order!');
                setError('Cart is empty. Please add items to cart before checkout.');
                setIsProcessing(false);
                return;
              }
              
              // First, create the address
              const addressData = {
                user: user?._id,
                street: shippingInfo.address,
                city: shippingInfo.city,
                state: shippingInfo.state,
                country: 'Nigeria',
                zipCode: shippingInfo.zipCode,
                phoneNumber: shippingInfo.phone,
                isDefault: false
              };
              
              const addressResponse = await axios.post(
                "http://localhost:5050/api/addresses",
                addressData,
                {
                  headers: {
                    'Authorization': `Bearer ${authState.token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              const orderItems = state.items.map(item => ({
                product: item._id,
                quantity: item.quantity,
                price: item.price
              }));
              
              // Updated shipment data structure
              const shipmentData = {
                shippingAddress: addressResponse.data.data._id, // Use the created address ID
                shippingDate: new Date().toISOString(),
                shippingProvider: 'Standard Shipping',
                estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                trackingNumber: `TRACK-${Date.now()}`,
                status: 'pending',
                user: user?._id || '',
                order: null  // Will be updated after order creation
              };
              
              console.log('Shipment Data:', shipmentData);
              
              // Create order first
              const orderData = {
                orderItems: state.items.map(item => ({
                  product: item._id,
                  quantity: item.quantity,
                  price: item.price,
                  name: item.name // Add product name
                })),
                totalAmount: state.total,
                paymentMethod: 'paystack',
                status: 'pending',
                paymentReference: response.reference,
                user: user?._id || '',
                shippingInfo: {
                  firstName: shippingInfo.firstName,
                  lastName: shippingInfo.lastName,
                  email: shippingInfo.email,
                  address: shippingInfo.address,
                  city: shippingInfo.city,
                  state: shippingInfo.state,
                  zipCode: shippingInfo.zipCode,
                  phone: shippingInfo.phone
                }
              };
              
              console.log('Order Data:', orderData); // Add debug log
              
              const orderResponse = await axios.post(
                "http://localhost:5050/api/orders",
                orderData,
                {
                  headers: {
                    'Authorization': `Bearer ${authState.token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              // Update shipment with order ID and create shipment
              shipmentData.order = orderResponse.data.data._id;
              
              const shipmentResponse = await axios.post(
                "http://localhost:5050/api/shipments",
                shipmentData,
                {
                  headers: {
                    'Authorization': `Bearer ${authState.token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              // Update order with shipment ID
              await axios.patch(
                `http://localhost:5050/api/orders/${orderResponse.data.data._id}`,
                { shipment: shipmentResponse.data.data._id },
                {
                  headers: {
                    'Authorization': `Bearer ${authState.token}`,
                    'Content-Type': 'application/json'
                  }
                }
              );
              
              if (orderResponse.data) {
                dispatch({ type: "CLEAR_CART" });
                navigate(`/order-confirmation/${orderResponse.data.data._id}`);
              } else {
                throw new Error('Invalid response from server');
              }
            } catch (err: any) {
              console.error("Order creation error:", err);
              
              // Check if it's an authentication error
              if (handleAuthError(err, dispatch, navigate)) {
                return; // Auth error handled, exit early
              }
              
              setError(err.response?.data?.message || "Failed to create order. Please contact support.");
            } finally {
              setIsProcessing(false);
            }
          };
          createOrder();
        } else {
          setError("Payment was not successful");
          setIsProcessing(false);
        }
      }

      const config: PaystackConfig = {
        key: "pk_test_a6f5409fe07b2d84d50d9986b875c6f595bacf40",
        email: shippingInfo.email,
        amount: Math.round(state.total * 100), // Convert to kobo
        currency: "NGN",
        firstname: shippingInfo.firstName,
        lastname: shippingInfo.lastName,
        phone: shippingInfo.phone,
        ref: `ORDER_${Date.now()}_${Math.floor(Math.random() * 1000000)}`,
        callback: handlePaystackResponse,
        onClose: () => setIsProcessing(false)
      };

      const paystack = window.PaystackPop.setup(config);
      paystack.openIframe();
    } catch (error: any) {
      console.error("Paystack Error:", error);
      setError("Payment initialization failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // Update the button in the return statement
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="mb-4 text-primary">
                <i className="bi bi-truck me-2"></i>
                Shipping Information
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={shippingInfo.firstName}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="firstName">First Name *</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={shippingInfo.lastName}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="lastName">Last Name *</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="email">Email Address *</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="address"
                        name="address"
                        placeholder="Enter your street address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="address">Street Address *</label>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        placeholder="Enter your city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="city">City *</label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="state"
                        name="state"
                        placeholder="Enter your state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="state">State *</label>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-floating">
                      <input
                        type="text"
                        className="form-control"
                        id="zipCode"
                        name="zipCode"
                        placeholder="Zip code"
                        value={shippingInfo.zipCode}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="zipCode">Zip Code *</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating">
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="phone">Phone Number *</label>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg mt-4 w-100 d-flex align-items-center justify-content-center gap-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-credit-card"></i>
                      Place Order - ${state.total.toFixed(2)}
                    </>
                  )}
                </button>
                {error && (
                  <div className="alert alert-danger mt-3 d-flex align-items-center">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm sticky-top" style={{top: '2rem'}}>
            <div className="card-body p-4">
              <h5 className="card-title mb-4 text-primary">
                <i className="bi bi-receipt me-2"></i>
                Order Summary
              </h5>
              <div className="order-items mb-3">
                {state.items.map((item) => (
                  <div
                    key={item._id}
                    className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom"
                  >
                    <div className="d-flex align-items-center">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="rounded me-2"
                        style={{width: '40px', height: '40px', objectFit: 'cover'}}
                      />
                      <div>
                        <div className="fw-medium">{item.name}</div>
                        <small className="text-muted">Qty: {item.quantity}</small>
                      </div>
                    </div>
                    <span className="fw-bold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="my-3" />
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Subtotal:</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              <hr className="my-3" />
              <div className="d-flex justify-content-between align-items-center">
                <strong className="fs-5">Total:</strong>
                <strong className="fs-5 text-primary">${state.total.toFixed(2)}</strong>
              </div>
              <div className="mt-3 p-3 bg-light rounded">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Your payment information is secure and encrypted
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
