import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/cartContext/CartContext";
import CartItem from "../components/Cart/CartItem";

const CartPage: React.FC = () => {
  const { state, dispatch } = useCart();

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const handleRemoveItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  if (state.items.length === 0) {
    return (
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card border-0 shadow-sm p-4">
              <div className="card-body">
                <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
                <h2 className="mb-3">Your Cart is Empty</h2>
                <p className="text-muted mb-4">
                  Looks like you haven't added any items to your cart yet. 
                  Start shopping to fill it up!
                </p>
                <Link to="/products" className="btn btn-primary btn-lg">
                  <i className="bi bi-shop me-2"></i>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12 mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mb-0">
              <i className="bi bi-cart3 me-2"></i>
              Shopping Cart
            </h1>
            <span className="badge bg-primary fs-6">
              {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <hr className="mt-3" />
        </div>
      </div>
      
      <div className="row">
        <div className="col-lg-8">
          <div className="cart-items">
            {state.items.map((item) => (
              <CartItem
                key={item._id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </div>
          
          <div className="mt-4">
            <Link to="/products" className="btn btn-outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Link>
          </div>
        </div>
        
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm sticky-top" style={{top: '2rem'}}>
            <div className="card-body p-4">
              <h5 className="card-title mb-4 text-primary">
                <i className="bi bi-receipt me-2"></i>
                Order Summary
              </h5>
              
              <div className="summary-row d-flex justify-content-between mb-3">
                <span>Items ({state.items.length}):</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
              
              <div className="summary-row d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span className="text-success">Free</span>
              </div>
              
              <div className="summary-row d-flex justify-content-between mb-3">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>
              
              <hr className="my-3" />
              
              <div className="d-flex justify-content-between mb-4">
                <strong className="fs-5">Total:</strong>
                <strong className="fs-5 text-primary">${state.total.toFixed(2)}</strong>
              </div>
              
              <Link 
                to="/checkout" 
                className="btn btn-primary btn-lg w-100 mb-3 d-flex align-items-center justify-content-center gap-2"
              >
                <i className="bi bi-credit-card"></i>
                Proceed to Checkout
              </Link>
              
              <button 
                className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear your cart?')) {
                    dispatch({ type: "CLEAR_CART" });
                  }
                }}
              >
                <i className="bi bi-trash"></i>
                Clear Cart
              </button>
              
              <div className="mt-3 p-3 bg-light rounded">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Secure checkout with SSL encryption
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
