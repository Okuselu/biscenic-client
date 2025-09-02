//src/pages/LoginPage.tsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext/authContext";
import Card from "../components/UI/Card";
import { API_ENDPOINTS } from "../config/api";

const LoginPage: React.FC = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get the intended destination from location state
  const from = location.state?.from || "/";
  
  // Show session expired message if redirected from auth error
  const sessionMessage = location.state?.message;

  useEffect(() => {
    if (sessionMessage) {
      setError(sessionMessage);
    }
  }, [sessionMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        API_ENDPOINTS.users.login,
        formData
      );

      if (response.data.token) {
        dispatch({
          type: "LOGIN",
          payload: response.data,
        });
        
        // Redirect based on user role and intended destination
        if (response.data.user.roles?.includes("admin")) {
          navigate("/admin");
        } else {
          // Redirect to intended destination (e.g., checkout) or home
          navigate(from, { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <Card>
            <h2 className="section-title text-center">Welcome Back</h2>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </button>

              <div className="text-center mt-3">
                <small className="text-muted">
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-primary text-decoration-none"
                  >
                    Sign up
                  </Link>
                </small>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
