import React, { useState, useEffect } from "react";
import axios from "axios";
import { Product, ProductsResponse, Category } from "../types/product.types";
import ProductCard from "../components/Product/ProductCard";
import ProductFilter from "../components/Product/ProductFilter";
import ProductSearch from "../components/Product/ProductSearch";
import Spinner from "../components/UI/Spinner";
import { useSearchParams } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api"; // Add this import

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  // Update the categories state type here and remove the duplicate declaration below
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchProducts = async () => {
    try {
      console.log("Attempting to connect to API...");
      const response = await axios.get<ProductsResponse>(
        API_ENDPOINTS.products, // Replace hardcoded URL
        {
          timeout: 5000,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data) {
        throw new Error("No data received from API");
      }

      console.log("API Response:", response.data);
      setProducts(response.data.data || []); // Changed from response.data.products to response.data.data
    } catch (err: any) {
      console.error("API Error Details:", {
        message: err.message,
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
      });
      setError(
        err.response?.status === 404
          ? "API endpoint not found"
          : err.code === "ECONNREFUSED"
          ? "Cannot connect to API server"
          : "Failed to load products"
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  // Update the fetchCategories function
  const fetchCategories = async () => {
    try {
      const response = await axios.get<{ data: Category[] }>(
        API_ENDPOINTS.categories // Replace hardcoded URL
      );
      setCategories(response.data.data || []);
    } catch (err) {
      console.error("Failed to fetch categories");
      setCategories([]);
    }
  };

  // Update the ProductFilter component usage
  <ProductFilter
    categories={categories}
    selectedCategory={selectedCategory}
    onCategoryChange={(categoryId) => {
      setSelectedCategory(categoryId);
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (categoryId) {
          newParams.set("category", categoryId);
        } else {
          newParams.delete("category");
        }
        return newParams;
      });
    }}
  />;

  // Initial data fetch
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // Search params effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set("search", searchTerm);
          return newParams;
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, setSearchParams]);

  const handleAddToCart = async (productId: string) => {
    try {
      await axios.post(API_ENDPOINTS.cart.add, { // Replace hardcoded URL
        productId,
        quantity: 1,
      });
    } catch (err) {
      setError("Failed to add item to cart");
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner />
      </div>
    );
  }

  const filteredProducts = products
    .filter((product) =>
      selectedCategory ? product.category?._id === selectedCategory : true
    )
    .filter((product) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower) ||
        product.category?.name.toLowerCase().includes(searchLower)
      );
    });

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <h1 className="section-title text-center mb-5">Our Products</h1>
        </div>
      </div>

      <div className="row">
        

        <div className="col-12 col-md-9">
          <ProductSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          {error && (
            <div className="alert alert-danger text-center mb-4">{error}</div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center">
              <p className="text-muted">No products found</p>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>
        <div className="col-12 col-md-3">
          <ProductFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
