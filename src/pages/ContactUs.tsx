// src/pages/ContactUsPage.tsx
import React from "react";
import "../styles/pages.css";

const ContactUsPage: React.FC = () => (
  <div className="page-container">
    {/* Title & Subtitle */}
    <h1 className="page-title">CONTACT US</h1>
    <p className="page-subtitle">
      We're here to assist you with any inquiries.
    </p>

    {/* Contact Form */}
    <form className="row g-3 my-4 contact-form">
      <div className="col-md-6">
        <input
          type="text"
          className="form-control"
          placeholder="First Name"
        />
      </div>
      <div className="col-md-6">
        <input
          type="text"
          className="form-control"
          placeholder="Last Name"
        />
      </div>
      <div className="col-md-6">
        <input
          type="email"
          className="form-control"
          placeholder="Email"
        />
      </div>
      <div className="col-md-6">
        <input
          type="tel"
          className="form-control"
          placeholder="Phone"
        />
      </div>
      <div className="col-12">
        <input
          type="text"
          className="form-control"
          placeholder="Subject"
        />
      </div>
      <div className="col-12">
        <textarea
          className="form-control"
          rows={5}
          placeholder="Message"
        ></textarea>
      </div>
      <div className="col-12 text-center">
        <button type="submit" className="btn-primary">
          Send Message
        </button>
      </div>
    </form>

    {/* Contact Info Section */}
    <div className="contact-info">
      <h3>Contact Information</h3>
      <p>
        <strong>Jordan Brookes, Lagos, Nigeria:</strong> 4 Dada Fayemi Close,
        Osapa, London.
      </p>
      <p>
        <strong>Penny Lane, Georgia:</strong> Penny Lane South-east City, State,
        Georgia.
      </p>
      <p>
        <strong>Phone:</strong> +2348061789132 | +14706219649
      </p>
      <p>
        <strong>Email:</strong> biscenic@gmail.com
      </p>
      <p>
        <strong>Hours:</strong> Mon-Sat: 07:00 AM–08:00 PM | Sun: 11:00 AM–06:00
        PM
      </p>
    </div>
  </div>
);

export default ContactUsPage;
