import React, { useState, useRef, useEffect } from "react";
import Navbar from "./Navbar";
import { useAuth } from "../../context/authContext/authContext";
import { useCart } from "../../context/cartContext/CartContext";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "../UI/ThemeToggle";
import "./Layout.css";
import { refreshIcons } from "../../utils/icons";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, dispatch } = useAuth();
  const { state: cartState } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartItemsCount = cartState.items.reduce(
    (total: number, item: { quantity: number }) => total + item.quantity,
    0
  );

  React.useEffect(() => {
    refreshIcons();
  }, [isMenuOpen]);

  // Position dropdown dynamically
  useEffect(() => {
    if (isUserDropdownOpen && userMenuRef.current && dropdownRef.current) {
      const buttonRect = userMenuRef.current.getBoundingClientRect();
      const dropdown = dropdownRef.current;
      
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${buttonRect.bottom + 8}px`;
      dropdown.style.right = `${window.innerWidth - buttonRect.right}px`;
      dropdown.style.left = 'auto';
    }
  }, [isUserDropdownOpen]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu')) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-start">
            <button
              className="menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <i
                data-feather={isMenuOpen ? "x" : "menu"}
                className="feather-24"
              ></i>
            </button>
            <Link 
              to={process.env.NODE_ENV === 'production' ? '/biscenic-project/' : '/'} 
              className="brand"
            >
              biscenic
            </Link>
          </div>

          <div className={`navbar-middle ${isMenuOpen ? "active" : ""}`}>
            <Link to="/products" className="nav-link">
              <i data-feather="grid" className="feather-16"></i>
              Products
            </Link>
            <Link
              to={
                state.user?.roles?.includes("admin")
                  ? "/admin/categories"
                  : "/products"
              }
              className="nav-link"
            >
              <i data-feather="tag" className="feather-16"></i>
              Categories
            </Link>
            {state.isAuthenticated && (
              <Link to="/order-history" className="nav-link">
                <i data-feather="clock" className="feather-16"></i>
                Orders
              </Link>
            )}
          </div>

          <div className="navbar-end">
            <ThemeToggle size="sm" className="theme-toggle-nav" />
            <Link to="/cart" className="cart-link">
              <i data-feather="shopping-cart" className="feather-20"></i>
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>

            {state.isAuthenticated ? (
              <div className="user-menu" ref={userMenuRef}>
                <button 
                  className="user-menu-button"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                >
                  <i data-feather="user" className="feather-20"></i>
                  <span className="user-name">
                    {state.user?.firstName || "Account"}
                  </span>
                  <i data-feather={isUserDropdownOpen ? "chevron-up" : "chevron-down"} className="feather-16"></i>
                </button>
                <div 
                  ref={dropdownRef}
                  className={`user-dropdown ${isUserDropdownOpen ? "show" : ""}`}
                >
                  {state.user?.roles?.includes("admin") && (
                    <Link 
                      to="/admin" 
                      className="dropdown-item"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      <i data-feather="settings" className="feather-16"></i>
                      Admin Panel
                    </Link>
                  )}
                  <Link 
                    to="/profile" 
                    className="dropdown-item"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <i data-feather="user" className="feather-16"></i>
                    Profile
                  </Link>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setIsUserDropdownOpen(false);
                      dispatch({ type: "LOGOUT" });
                      navigate("/");
                    }}
                  >
                    <i data-feather="log-out" className="feather-16"></i>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">
                  Login
                </Link>
                <Link to="/signup" className="btn-signup">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
