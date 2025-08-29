import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/authContext/authContext";
import Spinner from "../components/UI/Spinner";
import Alert from "../components/UI/Alert";
import EditProduct from "../components/Product/EditProduct";
import { Product } from "../types/product.types";

const AdminProductEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        setProduct(response.data.data);
      } catch (err) {
        setError("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = (updatedProduct: Product) => {
    setProduct(updatedProduct);
    navigate("/admin/products");
  };

  if (loading) {
    return (
      <div className="container-fluid py-4">
        <div className="text-center py-5">
          <Spinner />
          <p className="mt-3 mb-0">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid py-4">
        <Alert type="danger" message={error} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-fluid py-4">
        <Alert type="info" message="Product not found" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-10 col-xl-8">
          {/* Header */}
          <div className="d-flex align-items-center mb-4">
            <button
              className="btn btn-outline-secondary me-3"
              onClick={() => navigate("/admin/products")}
              title="Back to Products"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <div>
              <h1 className="h3 mb-1">
                <i
                  className="bi bi-pencil-square me-2"
                  style={{ color: "var(--primary-color)" }}
                ></i>
                Edit Product
              </h1>
              <p className="text-muted mb-0">
                Update product information and settings
              </p>
            </div>
          </div>

          {/* Edit Form */}
          <EditProduct product={product} onUpdate={handleUpdate} />
        </div>
      </div>
    </div>
  );
};

export default AdminProductEdit;
