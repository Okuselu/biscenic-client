//src/pages/Homepage.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/Product/ProductCard";
import { Product, Category } from "../types/product.types";
import { useAuth } from "../context/authContext/authContext";
import Hero from "../components/Hero/Hero";
import "./HomePage.css";

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5050/api/products"),
          axios.get<{ data: Category[] }>(
            "http://localhost:5050/api/categories"
          ),
        ]);

        setProducts(productsRes.data.data || []);
        setCategories(categoriesRes.data.data || []);
      } catch (err) {
        setError("Failed to load data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


// Add this function after the existing useEffect
const refreshData = async () => {
  try {
    setLoading(true);
    const [productsRes, categoriesRes] = await Promise.all([
      axios.get("http://localhost:5050/api/products"),
      axios.get<{ data: Category[] }>(
        "http://localhost:5050/api/categories"
      ),
    ]);

    setProducts(productsRes.data.data || []);
    setCategories(categoriesRes.data.data || []);
  } catch (err) {
    setError("Failed to load data");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

// Add a refresh button or automatic refresh
useEffect(() => {
  // Refresh data when the component becomes visible again
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      refreshData();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);


  // Remove separate fetch functions since they're now in useEffect

  const handleAddToCart = async (productId: string) => {
    try {
      await axios.post("http://localhost:5050/api/cart/add", {
        productId,
        quantity: 1,
      });
    } catch (err) {
      setError("Failed to add item to cart");
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5050/api/newsletter/subscribe", {
        email,
      });
      setSubscribeStatus("success");
      setEmail("");
      // Clear success message after 3 seconds
      setTimeout(() => setSubscribeStatus(""), 3000);
    } catch (err) {
      setSubscribeStatus("error");
      // Clear error message after 3 seconds
      setTimeout(() => setSubscribeStatus(""), 3000);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Curating your sanctuary...</p>
      </div>
    );
  }

  const getCategoryIcon = (categoryName: string): string => {
    const icons: { [key: string]: string } = {
      // Art Categories
      Art: "image",
      Paintings: "edit-3",
      Sculptures: "box",
      "Digital Art": "monitor",
      Photography: "camera",
      "Mixed Media": "layers",

      // Furniture Categories
      Furniture: "home",
      Seating: "square",
      Tables: "grid",
      Storage: "archive",
      Lighting: "sun",
      Bedroom: "moon",
      "Living Room": "coffee",
      "Office Furniture": "briefcase",

      // Wellness & Technology
      "Wellness Collection": "heart",
      "Sensory Technology": "cpu",
      "Smart Furniture": "wifi",
      Aromatherapy: "wind",
      "Sound Therapy": "headphones",

      // Legacy categories (for backward compatibility)
      Electronics: "smartphone",
      Clothing: "shopping-bag",
      Books: "book-open",
      Home: "home",
      Sports: "activity",
      Beauty: "star",
      Toys: "gift",
      Food: "coffee",
      Health: "heart",
      Automotive: "truck",
      Garden: "sun",
      Office: "briefcase",
      Pets: "github",
      Music: "music",
    };
    return icons[categoryName] || "grid"; // Returns 'grid' as default icon if category not found
  };

  return (
    <div className="home-page">
      <Hero />

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          <div className="products-grid">
            {products.slice(0, 8).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                hideBottom={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Explore Collections</h2>
          <div className="categories-grid">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="category-card"
              >
                <i data-feather={getCategoryIcon(category.name)}></i>
                <h3>{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="section-title">Join Our Sanctuary</h2>
            <p>
              Subscribe to receive curated insights on art, design, and wellness
              innovations
            </p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <button type="submit">
                <i data-feather="send" className="feather-16"></i>
                Subscribe
              </button>
            </form>
            {subscribeStatus === "success" && (
              <p className="success-message">Thank you for subscribing!</p>
            )}
            {subscribeStatus === "error" && (
              <p className="error-message">
                Subscription failed. Please try again.
              </p>
            )}
          </div>
        </div>
      </section>

      {error && (
        <div className="error-message">
          <i data-feather="alert-circle" className="feather-16"></i>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default HomePage;
