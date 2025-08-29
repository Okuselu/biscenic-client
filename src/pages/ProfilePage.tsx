import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext/authContext";
import axios from "axios";
import Container from "../components/UI/Container";
import Spinner from "../components/UI/Spinner";
import Alert from "../components/UI/Alert";

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const { state } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: ""
    }
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:5050/api/users/profile",
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      setProfile(response.data.data);
      setFormData({
        firstName: response.data.data.firstName || "",
        lastName: response.data.data.lastName || "",
        email: response.data.data.email || "",
        phone: response.data.data.phone || "",
        address: {
          street: response.data.data.address?.street || "",
          city: response.data.data.address?.city || "",
          state: response.data.data.address?.state || "",
          zipCode: response.data.data.address?.zipCode || ""
        }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      setError("");
      setSuccessMessage("");
      
      await axios.put(
        "http://localhost:5050/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        }
      );
      
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false);
      fetchProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Spinner />;
  if (error && !profile) return <Alert type="danger" message={error} />;

  return (
    <Container>
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          {/* Header */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4">
            <div>
              <h1 
                className="h2 mb-2"
                style={{ color: 'var(--text-primary)', fontWeight: '600' }}
              >
                My Profile
              </h1>
              <p 
                className="text-muted mb-0"
                style={{ fontSize: '0.95rem' }}
              >
                Manage your account information and preferences
              </p>
            </div>
            <button
              className="btn mt-3 mt-sm-0"
              style={{
                backgroundColor: isEditing ? 'var(--danger-color)' : 'var(--primary-color)',
                borderColor: isEditing ? 'var(--danger-color)' : 'var(--primary-color)',
                color: 'white',
                fontSize: '0.9rem',
                padding: '0.5rem 1.5rem'
              }}
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) {
                  setFormData({
                    firstName: profile?.firstName || "",
                    lastName: profile?.lastName || "",
                    email: profile?.email || "",
                    phone: profile?.phone || "",
                    address: {
                      street: profile?.address?.street || "",
                      city: profile?.address?.city || "",
                      state: profile?.address?.state || "",
                      zipCode: profile?.address?.zipCode || ""
                    }
                  });
                }
              }}
            >
              <i className={`bi bi-${isEditing ? 'x' : 'pencil'} me-2`}></i>
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <Alert type="success" message={successMessage} />
          )}
          {error && (
            <Alert type="danger" message={error} />
          )}

          {/* Profile Card */}
          <div 
            className="card shadow-sm"
            style={{
              backgroundColor: 'var(--surface-color)',
              borderColor: 'var(--border-color)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div 
              className="card-header border-0 text-white"
              style={{
                background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)',
                borderRadius: '0.375rem 0.375rem 0 0'
              }}
            >
              <h5 className="mb-0" style={{ fontWeight: '600' }}>
                <i className="bi bi-person-circle me-2"></i>
                Account Information
              </h5>
            </div>
            <div className="card-body p-4">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    {/* Personal Information */}
                    <div className="col-12">
                      <h6 
                        className="mb-3 pb-2"
                        style={{ 
                          color: 'var(--text-primary)',
                          borderBottom: '2px solid var(--primary-color)',
                          display: 'inline-block'
                        }}
                      >
                        Personal Information
                      </h6>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        className="form-control"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>

                    {/* Address Information */}
                    <div className="col-12 mt-4">
                      <h6 
                        className="mb-3 pb-2"
                        style={{ 
                          color: 'var(--text-primary)',
                          borderBottom: '2px solid var(--primary-color)',
                          display: 'inline-block'
                        }}
                      >
                        Address Information
                      </h6>
                    </div>
                    <div className="col-12">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address.street"
                        className="form-control"
                        value={formData.address.street}
                        onChange={handleInputChange}
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        City
                      </label>
                      <input
                        type="text"
                        name="address.city"
                        className="form-control"
                        value={formData.address.city}
                        onChange={handleInputChange}
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        State
                      </label>
                      <input
                        type="text"
                        name="address.state"
                        className="form-control"
                        value={formData.address.state}
                        onChange={handleInputChange}
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label" style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        ZIP Code
                      </label>
                      <input
                        type="text"
                        name="address.zipCode"
                        className="form-control"
                        value={formData.address.zipCode}
                        onChange={handleInputChange}
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          borderColor: 'var(--border-color)',
                          color: 'var(--text-primary)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="d-flex flex-column flex-sm-row gap-2 justify-content-end mt-4 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                    <button
                      type="button"
                      className="btn"
                      style={{
                        backgroundColor: 'transparent',
                        borderColor: 'var(--text-muted)',
                        color: 'var(--text-muted)',
                        padding: '0.5rem 1.5rem'
                      }}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn"
                      disabled={updateLoading}
                      style={{
                        backgroundColor: 'var(--primary-color)',
                        borderColor: 'var(--primary-color)',
                        color: 'white',
                        padding: '0.5rem 1.5rem'
                      }}
                    >
                      {updateLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-lg me-2"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="row g-4">
                  {/* Personal Information Display */}
                  <div className="col-12">
                    <h6 
                      className="mb-3 pb-2"
                      style={{ 
                        color: 'var(--text-primary)',
                        borderBottom: '2px solid var(--primary-color)',
                        display: 'inline-block'
                      }}
                    >
                      Personal Information
                    </h6>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>First Name</small>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {profile?.firstName || 'Not provided'}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Last Name</small>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {profile?.lastName || 'Not provided'}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Email</small>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {profile?.email}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Phone</small>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {profile?.phone || 'Not provided'}
                      </div>
                    </div>
                  </div>

                  {/* Address Information Display */}
                  <div className="col-12 mt-4">
                    <h6 
                      className="mb-3 pb-2"
                      style={{ 
                        color: 'var(--text-primary)',
                        borderBottom: '2px solid var(--primary-color)',
                        display: 'inline-block'
                      }}
                    >
                      Address Information
                    </h6>
                  </div>
                  {profile?.address ? (
                    <>
                      <div className="col-12">
                        <div className="mb-3">
                          <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Street Address</small>
                          <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                            {profile.address.street}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>City</small>
                          <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                            {profile.address.city}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>State</small>
                          <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                            {profile.address.state}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="mb-3">
                          <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>ZIP Code</small>
                          <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                            {profile.address.zipCode}
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="col-12">
                      <div 
                        className="text-center py-4"
                        style={{
                          backgroundColor: 'var(--background-color)',
                          borderRadius: '0.5rem',
                          border: '1px dashed var(--border-color)'
                        }}
                      >
                        <i className="bi bi-geo-alt text-muted" style={{ fontSize: '2rem' }}></i>
                        <p className="text-muted mt-2 mb-0">No address information provided</p>
                        <small className="text-muted">Click "Edit Profile" to add your address</small>
                      </div>
                    </div>
                  )}

                  {/* Account Details */}
                  <div className="col-12 mt-4">
                    <h6 
                      className="mb-3 pb-2"
                      style={{ 
                        color: 'var(--text-primary)',
                        borderBottom: '2px solid var(--primary-color)',
                        display: 'inline-block'
                      }}
                    >
                      Account Details
                    </h6>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Member Since</small>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                        {profile?.createdAt ? formatDate(profile.createdAt) : 'Unknown'}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1" style={{ fontSize: '0.8rem' }}>Account ID</small>
                      <div style={{ color: 'var(--text-primary)', fontWeight: '500', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                        {profile?._id}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;