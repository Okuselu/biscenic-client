//src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/authContext/authContext";
import { CartProvider } from "./context/cartContext/CartContext";
import { ThemeProvider } from "./context/themeContext/themeContext";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import Layout from "./components/Layout/Layout";
import "./styles/global.css";
import "./styles/themes.css";
import "./styles/responsive.css";
import OrderHistoryPage from "./pages/OrderHistoryPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import AdminProductPage from "./pages/AdminProductPage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";
import AdminProductEdit from "./pages/AdminProductEdit";
import AdminCategoryPage from "./pages/AdminCategoryPage";
import OrderDetailsPage from "./pages/admin/OrderDetailsPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ProfilePage from "./pages/ProfilePage";

// Add ProtectedRoute component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { state } = useAuth();
  return state.isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />

                {/* Protected Routes */}
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order-history"
                  element={
                    <ProtectedRoute>
                      <OrderHistoryPage />
                    </ProtectedRoute>
                  }
                />
                
                {/* Add this missing route */}
                <Route
                  path="/order-confirmation/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderConfirmationPage />
                    </ProtectedRoute>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedAdminRoute>
                      <AdminProductPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedAdminRoute>
                      <AdminOrders />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/orders/:orderId"
                  element={
                    <ProtectedAdminRoute>
                      <OrderDetailsPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedAdminRoute>
                      <AdminUsers />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/products/:id/edit"
                  element={
                    <ProtectedAdminRoute>
                      <AdminProductEdit />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedAdminRoute>
                      <AdminCategoryPage />
                    </ProtectedAdminRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
