import React, { useState } from "react";
import { Product } from "../../types/product.types";
import { useCart } from "../../context/cartContext/CartContext";
import { Link } from "react-router-dom";
import { refreshIcons } from "../../utils/icons";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  hideBottom?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, hideBottom = false }) => {
  const { dispatch } = useCart();
  const [isTouched, setIsTouched] = useState(false);

  React.useEffect(() => {
    refreshIcons();
  }, []);

  const handleAddToCart = () => {
    if (product.stock > 0) {
      const mainImage =
        product.images?.find((img) => img.isMain)?.url ||
        product.images?.[0]?.url ||
        "/images/placeholder-image.jpg";

      dispatch({
        type: "ADD_ITEM",
        payload: {
          _id: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
          imageUrl: mainImage,
        },
      });

      if (onAddToCart) {
        onAddToCart(product._id);
      }
    }
  };

  const handleImageTouch = () => {
    setIsTouched(!isTouched);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    // Prevent default behavior on mobile
    if (window.innerWidth <= 768) {
      e.preventDefault();
      handleImageTouch();
    }
  };

  const displayImage =
    product.images?.find((img) => img.isMain)?.url ||
    product.images?.[0]?.url ||
    "/images/placeholder-image.jpg";

  return (
    <Link to={`/product/${product._id}`} className="product-card-link">
      <div className="product-card">
        <div
          className={`product-image-container ${isTouched ? "touched" : ""}`}
          onClick={handleImageClick}
          onTouchStart={handleImageTouch}
        >
          <img
            src={displayImage}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder-image.jpg";
            }}
          />

          <div className="product-overlay">
            <button className="btn-view-details-overlay">
              <span>View Product</span>
            </button>
          </div>
        </div>

        <div className="product-content">
          <h3 className="product-title">{product.name}</h3>
        </div>

        {!hideBottom && (
          <div className="product-bottom">
            <div className="product-price-bottom">
              ${product.price.toFixed(2)}
            </div>

            <div className="product-actions">
              <button
                className="btn-add-to-cart-icon"
                onClick={(e) => {
                  e.preventDefault();
                  handleAddToCart();
                }}
                disabled={product.stock <= 0}
                title={product.stock > 0 ? "Add to Cart" : "Out of Stock"}
              >
                <i
                  data-feather={product.stock > 0 ? "shopping-cart" : "x-circle"}
                ></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
