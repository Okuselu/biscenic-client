// Paystack Payment Data Interface (from your backend)
export interface PaystackPaymentData {
  id: number;
  domain: string;
  status: string;              // "success" | "failed" | "pending"
  reference: string;           // Transaction reference
  amount: number;              // Amount in kobo
  message: string;             // Status message
  gateway_response: string;    // Gateway response
  paid_at: string;             // Payment completion timestamp
  created_at: string;          // Transaction creation timestamp
  channel: string;             // Payment channel (card, bank, etc.)
  currency: string;            // Currency code (NGN)
  ip_address: string;          // Customer IP address
  metadata: any;               // Additional metadata
  log: any;                    // Transaction log
  fees: number;                // Transaction fees
  fees_split: any;             // Fee breakdown
  authorization: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name: string;
  };
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    customer_code: string;
    phone: string;
    metadata: any;
    risk_action: string;
  };
  plan: any;                   // Subscription plan (if applicable)
  split: any;                  // Payment split (if applicable)
  order_id: any;               // Order ID (if applicable)
  paidAt: string;              // Payment completion timestamp
  createdAt: string;           // Transaction creation timestamp
  requested_amount: number;     // Requested amount
  pos_transaction_data: any;   // POS transaction data
  source: any;                 // Payment source
  fees_breakdown: any;         // Detailed fee breakdown
}

// Payment Initialization Request
export interface PaymentInitializeRequest {
  email: string;               // Customer email address
  amount: number;              // Amount in kobo (Nigerian currency smallest unit)
}

// Payment Initialization Response
export interface PaymentInitializeResponse {
  message: string;             // "Payment initialization successful"
  data: {
    authorization_url: string; // Paystack payment URL for customer to complete payment
  };
  error: null;
}

// Payment Verification Response
export interface PaymentVerificationResponse {
  message: string;             // "Payment verification successful"
  data: PaystackPaymentData;   // Complete payment data from Paystack
  error: null;
}

// Customer Information for Payment
export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Cart Item for Payment
export interface PaymentCartItem {
  product: string;             // Product ID
  quantity: number;
  price: number;               // Price per item in kobo
}

// Order Data Structure for Backend
export interface OrderData {
  items: PaymentCartItem[];
  shippingInfo: CustomerInfo;
  totalAmount: number;         // Total amount in kobo
  paymentMethod: 'paystack';
  paymentReference: string;    // Paystack transaction reference
  status: 'paid';
}
