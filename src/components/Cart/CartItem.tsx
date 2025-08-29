import React from "react";
import { CartItem as CartItemType } from "../../types/cart.types";
import "./CartItem.css";

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div className="card cart-item">
      <div className="cart-item-row">
        <div className="cart-item-image">
          <img
            src={item.imageUrl}
            alt={item.name}
          />
        </div>
        <div className="cart-item-content">
          <div className="cart-item-header">
            <h5 className="cart-item-title">{item.name}</h5>
            <button
              className="cart-item-remove"
              onClick={() => onRemove(item._id)}
              aria-label="Remove item"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <p className="cart-item-price">
            ${item.price.toFixed(2)} each
          </p>
          <div className="cart-item-footer">
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                type="button"
                onClick={() =>
                  onUpdateQuantity(item._id, Math.max(0, item.quantity - 1))
                }
                disabled={item.quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                className="quantity-input"
                value={item.quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    onUpdateQuantity(item._id, value);
                  }
                }}
                min="0"
              />
              <button
                className="quantity-btn"
                type="button"
                onClick={() =>
                  onUpdateQuantity(item._id, item.quantity + 1)
                }
              >
                +
              </button>
            </div>
            <p className="cart-item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
