import React, { useState, useEffect, useRef } from "react";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "../../context/authContext/authContext";
import { useTheme } from "../../context/themeContext/themeContext";
import Spinner from "../../components/UI/Spinner";
import Alert from "../../components/UI/Alert";
import { useNavigate } from "react-router-dom";
import DeleteConfirmationModal from "../../components/UI/DeleteConfirmationModal";
import { API_ENDPOINTS } from "../../config/api";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: File[];
}

// Update the Product interface
interface Product extends Omit<ProductFormData, "category"> {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  category: {
    _id: string;
    name: string;
    description?: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: Product;
  message?: string;
}

// Add new interface for Category
interface Category {
  _id: string;
  name: string;
  description?: string;
}

const AdminProductPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const { theme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // Move success state here
  const [preview, setPreview] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: 0,
    category: "",
    stock: 0,
    images: [],
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Add loading state for products
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const response = await axios.get(API_ENDPOINTS.products, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        setProducts(response.data.data || []);
      } catch (err: any) {
        console.error("Error fetching products:", err);
        if (err.response?.status === 401) {
          navigate("/login"); // Redirect to login if unauthorized
        }
        setError(err.response?.data?.message || "Failed to fetch products");
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    if (state.token) {
      fetchProducts();
    }
  }, [state.token, navigate]);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete || !state.token) {
      setError("You must be logged in to delete products");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.delete(
        API_ENDPOINTS.admin.deleteProduct(productToDelete._id),
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          validateStatus: function (status) {
            return status < 500; // Resolve only if status is less than 500
          },
        }
      );

      if (response.status === 401) {
        setError("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }

      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to delete product");
      }

      setProducts(products.filter((p) => p._id !== productToDelete._id));
      setSuccess("Product deleted successfully");
      setDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete product");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stock"
          ? value === ""
            ? 0
            : Number(value)
          : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    // Clean up old preview URLs
    preview.forEach((url) => URL.revokeObjectURL(url));

    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    // Create new preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreview(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.token) {
      setError("You must be logged in to perform this action");
      return;
    }

    // Validate form data
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.category
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.price <= 0) {
      setError("Price must be greater than 0");
      return;
    }

    if (formData.stock < 0) {
      setError("Stock cannot be negative");
      return;
    }

    if (formData.images.length === 0) {
      setError("Please upload at least one image");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("stock", formData.stock.toString());
      formDataToSend.append("category", formData.category);

      // Append images
      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await axios.post(
        API_ENDPOINTS.products,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.error) {
        throw new Error(response.data.message);
      }

      const newProduct = response.data.data;
      setSuccess("Product added successfully!");
      setProducts((prevProducts) => [...prevProducts, newProduct]);

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: 0,
        category: "",
        stock: 0,
        images: [],
      });
      setPreview([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      console.error("Error creating product:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to create product"
      );
    } finally {
      setLoading(false);
    }
  };
  // Add this useEffect near the top of the component, with other hooks
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.products, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        setCategories(response.data.data);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.response?.data?.message || "Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // Update the price and stock input fields in the form
  return (
    <div className={`container py-5 theme-${theme}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1
          className="mb-0"
          style={{ color: "var(--primary-color)", fontWeight: "600" }}
        >
          Product Management
        </h1>
        <div
          className="badge bg-primary px-3 py-2"
          style={{ backgroundColor: "var(--primary-color)" }}
        >
          {products.length} Products
        </div>
      </div>

      {error && <Alert type="danger" message={error} />}
      {success && <Alert type="success" message={success} />}

      {/* Enhanced Add Product Form Card */}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-4">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Product
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter product description"
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Price</label>
                <div className="input-group">
                  <span className="input-group-text">$</span>
                  <input
                    type="number"
                    name="price"
                    className="form-control"
                    value={formData.price || ""}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label fw-semibold">Stock Quantity</label>
                <input
                  type="number"
                  name="stock"
                  className="form-control"
                  value={formData.stock || ""}
                  onChange={handleInputChange}
                  min="0"
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Product Images</label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                multiple
                accept="image/*"
                className="d-none"
              />
              <div
                className="border-2 border-dashed rounded p-4 text-center"
                style={{
                  borderColor: "var(--border-color)",
                  backgroundColor: "var(--surface-color)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--primary-color)";
                  e.currentTarget.style.backgroundColor = "var(--accent-color)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.backgroundColor =
                    "var(--surface-color)";
                }}
              >
                <i
                  className="bi bi-cloud-upload fs-2 mb-2"
                  style={{ color: "var(--primary-color)" }}
                ></i>
                <p className="mb-0">Click to upload images or drag and drop</p>
                <small className="text-muted">
                  PNG, JPG, JPEG up to 10MB each
                </small>
              </div>
            </div>

            {preview.length > 0 && (
              <div className="mb-3">
                <label className="form-label fw-semibold">Image Preview</label>
                <div className="row">
                  {preview.map((url, index) => (
                    <div key={index} className="col-md-3 col-6 mb-3">
                      <div className="position-relative">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="img-thumbnail w-100"
                          style={{ height: "150px", objectFit: "cover" }}
                        />
                        <span
                          className="position-absolute top-0 end-0 badge bg-primary m-1"
                          style={{ backgroundColor: "var(--primary-color)" }}
                        >
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-100 py-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Creating Product...
                </>
              ) : (
                <>
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Product
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Enhanced Product List */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title mb-0">
              <i className="bi bi-list-ul me-2"></i>
              Product Inventory
            </h5>
            <div className="d-flex gap-2">
              <span className="badge bg-success">
                {products.filter((p) => p.stock > 10).length} In Stock
              </span>
              <span className="badge bg-warning">
                {products.filter((p) => p.stock <= 10 && p.stock > 0).length}{" "}
                Low Stock
              </span>
              <span className="badge bg-danger">
                {products.filter((p) => p.stock === 0).length} Out of Stock
              </span>
            </div>
          </div>

          <div className="table-responsive">
            {productsLoading ? (
              <div className="text-center py-5">
                <Spinner />
                <p className="mt-3 mb-0">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-5">
                <i
                  className="bi bi-inbox fs-1 mb-3"
                  style={{ color: "var(--text-muted)" }}
                ></i>
                <h5>No products found</h5>
                <p className="text-muted">
                  Start by adding your first product above.
                </p>
              </div>
            ) : (
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th scope="col">
                      <i className="bi bi-tag me-1"></i>
                      Product Name
                    </th>
                    <th scope="col">
                      <i className="bi bi-folder me-1"></i>
                      Category
                    </th>
                    <th scope="col">
                      <i className="bi bi-currency-dollar me-1"></i>
                      Price
                    </th>
                    <th scope="col">
                      <i className="bi bi-boxes me-1"></i>
                      Stock
                    </th>
                    <th scope="col" className="text-center">
                      <i className="bi bi-gear me-1"></i>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(
                    (product) =>
                      product && (
                        <tr key={product._id}>
                          <td className="fw-semibold">{product.name}</td>
                          <td>
                            <span
                              className="badge"
                              style={{
                                backgroundColor: "var(--accent-color)",
                                color: "var(--secondary-color)",
                              }}
                            >
                              {product.category?.name || "N/A"}
                            </span>
                          </td>
                          <td className="fw-semibold">
                            ${product.price.toFixed(2)}
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                product.stock === 0
                                  ? "bg-danger"
                                  : product.stock <= 10
                                  ? "bg-warning"
                                  : "bg-success"
                              }`}
                            >
                              {product.stock} units
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  navigate(
                                    `/admin/products/${product._id}/edit`
                                  )
                                }
                                title="Edit Product"
                              >
                                <i className="bi bi-pencil"></i>
                                <span className="d-none d-md-inline ms-1">
                                  Edit
                                </span>
                              </button>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteClick(product)}
                                title="Delete Product"
                              >
                                <i className="bi bi-trash"></i>
                                <span className="d-none d-md-inline ms-1">
                                  Delete
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        itemName={productToDelete?.name || ""}
      />
    </div>
  );
};

export default AdminProductPage;
