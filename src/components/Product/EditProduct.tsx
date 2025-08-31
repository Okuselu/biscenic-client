import React, { useState, useEffect } from "react";
import { Product, Category } from "../../types/product.types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext/authContext";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/api";

interface EditProductProps {
  product: Product;
  onUpdate: (updatedProduct: Product) => void;
}

const EditProduct: React.FC<EditProductProps> = ({ product, onUpdate }) => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    category: product.category?._id || "",
    images: product.images || [],
  });
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.categories, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        setCategories(response.data.data || []);
      } catch (err: any) {
        if (err.response?.status === 401) {
          navigate("/login");
        }
        setError("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, [state.token, navigate]);

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files));
    }
  };

  const handleRemoveExistingImage = (publicId: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.publicId !== publicId),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.token) {
      setError("You must be logged in to update products");
      navigate("/login");
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

    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();

      // Add basic product data
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "images") {
          formDataToSend.append(key, value.toString());
        }
      });

      // Only send the remaining images after removal
      formDataToSend.append("existingImages", JSON.stringify(formData.images));

      // Add new images if any
      newImages.forEach((file) => {
        formDataToSend.append("newImages", file);
      });

      const response = await axios.put(
        `API_ENDPOINTS./api/products/${product._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUpdate(response.data.data);
    } catch (err: any) {
      if (err.response?.status === 401) {
        navigate("/login");
      }
      setError(err.response?.data?.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              className="alert alert-danger d-flex align-items-center mb-4"
              role="alert"
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <div className="row">
            {/* Product Name */}
            <div className="col-md-6 mb-3">
              <label htmlFor="name" className="form-label fw-semibold">
                <i className="bi bi-tag me-1"></i>
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter product name"
              />
            </div>

            {/* Category */}
            <div className="col-md-6 mb-3">
              <label htmlFor="category" className="form-label fw-semibold">
                <i className="bi bi-folder me-1"></i>
                Category *
              </label>
              <select
                id="category"
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

          {/* Description */}
          <div className="mb-3">
            <label htmlFor="description" className="form-label fw-semibold">
              <i className="bi bi-text-paragraph me-1"></i>
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Enter product description"
            />
          </div>

          <div className="row">
            {/* Price */}
            <div className="col-md-6 mb-3">
              <label htmlFor="price" className="form-label fw-semibold">
                <i className="bi bi-currency-dollar me-1"></i>
                Price *
              </label>
              <div className="input-group">
                <span className="input-group-text">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="col-md-6 mb-3">
              <label htmlFor="stock" className="form-label fw-semibold">
                <i className="bi bi-boxes me-1"></i>
                Stock Quantity *
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className="form-control"
                value={formData.stock}
                onChange={handleInputChange}
                min="0"
                required
                placeholder="0"
              />
            </div>
          </div>

          {/* Current Images */}
          {formData.images.length > 0 && (
            <div className="mb-3">
              <label className="form-label fw-semibold">
                <i className="bi bi-images me-1"></i>
                Current Images
              </label>
              <div className="row">
                {formData.images.map((image) => (
                  <div key={image.publicId} className="col-md-3 col-6 mb-3">
                    <div className="position-relative">
                      <img
                        src={image.url}
                        alt="Product"
                        className="img-thumbnail w-100"
                        style={{ height: "150px", objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                        onClick={() =>
                          handleRemoveExistingImage(image.publicId)
                        }
                        title="Remove image"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div className="mb-4">
            <label htmlFor="images" className="form-label fw-semibold">
              <i className="bi bi-cloud-upload me-1"></i>
              Add New Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              className="form-control"
              onChange={handleImageUpload}
              multiple
              accept="image/*"
            />
            <div className="form-text">
              Select multiple images to add to the product gallery.
            </div>
          </div>

          {/* Form Actions */}
          <div className="d-flex gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => navigate("/admin/products")}
              disabled={loading}
            >
              <i className="bi bi-x-circle me-1"></i>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                backgroundColor: "var(--primary-color)",
                borderColor: "var(--primary-color)",
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-1"></i>
                  Update Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
