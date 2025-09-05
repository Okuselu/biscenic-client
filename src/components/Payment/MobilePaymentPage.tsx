import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MobilePaymentPage.css';

interface PaystackResponse {
  reference: string;
  status: "success" | "failed";
  trans: string;
  transaction: string;
  message: string;
}

interface MobilePaymentPageProps {
  config: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    firstname: string;
    lastname: string;
    phone: string;
    ref: string;
  };
  onSuccess: (response: PaystackResponse) => void;
  onClose: () => void;
}

const MobilePaymentPage: React.FC<MobilePaymentPageProps> = ({ config, onSuccess, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Paystack inline
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    
    script.onload = () => {
      // Configure Paystack
      const paystack = window.PaystackPop.setup({
        ...config,
        callback: (response: PaystackResponse) => {
          onSuccess(response);
        },
        onClose: () => {
          onClose();
          navigate(-1); // Go back when closed
        }
      });
      
      // Open the payment form
      setTimeout(() => {
        paystack.openIframe();
      }, 100);
    };
    
    document.body.appendChild(script);
    
    return () => {
      // Clean up
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [config, onSuccess, onClose, navigate]);

  return (
    <div className="mobile-payment-page">
      <div className="payment-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <h1>Complete Payment</h1>
      </div>
      <div className="payment-loading">
        <div className="payment-loading-spinner"></div>
        <p>Initializing secure payment...</p>
      </div>
    </div>
  );
};

export default MobilePaymentPage;