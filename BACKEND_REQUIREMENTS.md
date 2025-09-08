# Balenciaga Clone - Backend Requirements

## Project Overview
This document outlines all the backend functionality needed to support the Balenciaga Clone e-commerce website. The frontend is built with Next.js and currently uses mock data and client-side logic that needs to be replaced with a proper Node.js Fastify backend.

## Current Frontend Analysis

### 🏗️ Architecture Overview
- **Frontend**: Next.js 15.2.4 with React 19
- **UI**: Tailwind CSS + Radix UI components
- **State Management**: React Context (Cart, Toast)
- **Forms**: React Hook Form with Zod validation
- **Target Backend**: Node.js with Fastify framework

## 📋 Required Backend Features

### 1. Authentication & Authorization

#### Admin Authentication
- **Current Implementation**: Hardcoded credentials (`biscenic@gmail.com` / `123456789`)
- **Frontend Files**: `app/secure-admin/page.tsx`, `app/admin/dashboard/page.tsx`

**Backend Requirements:**
```typescript
// Auth endpoints needed
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/verify-token
POST /api/auth/refresh-token

// Admin user model
interface AdminUser {
  id: string
  email: string
  password: string // hashed
  role: 'admin' | 'super_admin'
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}
```

**Features to implement:**
- JWT token-based authentication
- Password hashing (bcrypt)
- Session management
- Role-based access control
- "Remember me" functionality
- Password reset flow

### 2. Product Management System

#### Product Data Structure
**Current Implementation**: Hardcoded arrays in components
**Frontend Files**: `app/shop/page.tsx`, `app/admin/products/page.tsx`

```typescript
// Product model
interface Product {
  id: string
  name: string
  description?: string
  price: number
  category: 'home-decor' | 'furniture' | 'bags' | 'shoes' | 'clothing'
  image: string
  images?: string[] // multiple product images
  stock: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  seo?: {
    metaTitle?: string
    metaDescription?: string
    slug: string
  }
}

// Category model
interface Category {
  id: string
  name: string
  slug: string
  description?: string
  isActive: boolean
}
```

**Required Endpoints:**
```typescript
// Public product endpoints
GET /api/products                    // List products with filtering
GET /api/products/:id                // Get single product
GET /api/products/category/:category // Products by category
GET /api/categories                  // List categories

// Admin product endpoints
POST /api/admin/products             // Create product
PUT /api/admin/products/:id          // Update product
DELETE /api/admin/products/:id       // Delete product
GET /api/admin/products              // Admin product list with stock info
```

**Features to implement:**
- Product CRUD operations
- Category management
- Image upload handling
- Stock management
- Product search and filtering
- SEO-friendly URLs

### 3. Shopping Cart & Order Management

#### Cart System
**Current Implementation**: React Context with localStorage
**Frontend Files**: `context/cart-context.tsx`, `app/cart/page.tsx`

```typescript
// Cart item model
interface CartItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: Product // populated product data
}

// Cart model (for logged-in users)
interface Cart {
  id: string
  userId?: string // null for guest carts
  sessionId?: string // for guest users
  items: CartItem[]
  createdAt: Date
  updatedAt: Date
}
```

#### Order System
**Current Implementation**: WhatsApp integration for checkout
**Frontend Files**: `app/cart/page.tsx` (handleWhatsAppCheckout function)

```typescript
// Order model
interface Order {
  id: string
  orderNumber: string
  userId?: string // null for guest orders
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  items: OrderItem[]
  subtotal: number
  tax?: number
  shipping?: number
  total: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  shippingAddress?: Address
  notes?: string
  createdAt: Date
  updatedAt: Date
}

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  product: Product
}
```

**Required Endpoints:**
```typescript
// Cart endpoints
GET /api/cart                        // Get current cart
POST /api/cart/add                   // Add item to cart
PUT /api/cart/update/:itemId         // Update cart item quantity
DELETE /api/cart/remove/:itemId      // Remove item from cart
DELETE /api/cart/clear               // Clear entire cart

// Order endpoints
POST /api/orders                     // Create order
GET /api/orders/:id                  // Get order details
GET /api/admin/orders                // Admin: List all orders
PUT /api/admin/orders/:id/status     // Admin: Update order status
```

### 4. File Upload System

#### Current Implementation
**Frontend Files**: `app/api/upload/route.ts`, `app/admin/uploads/page.tsx`
**Current**: Returns dummy URLs, no actual file processing

**Backend Requirements:**
```typescript
// File upload endpoints
POST /api/upload/image               // Upload single image
POST /api/upload/images              // Upload multiple images
DELETE /api/upload/:fileId           // Delete uploaded file

// File model
interface UploadedFile {
  id: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  url: string
  path: string
  uploadedBy: string // admin user ID
  createdAt: Date
}
```

**Features to implement:**
- Image upload to cloud storage (AWS S3, Cloudinary, etc.)
- File validation (type, size limits)
- Image optimization/resizing
- Secure file serving
- File management in admin panel

### 5. Analytics System

#### Current Implementation
**Frontend Files**: `app/api/analytics/route.ts`, `app/admin/analytics/page.tsx`
**Current**: Returns hardcoded mock data

**Backend Requirements:**
```typescript
// Analytics models
interface AnalyticsSummary {
  totalRevenue: number
  totalOrders: number
  uniqueVisitors: number
  totalPageViews: number
  conversionRate: number
  averageOrderValue: number
}

interface DailyTrend {
  date: string
  revenue: number
  visitors: number
  orders: number
}

interface PopularProduct {
  productId: string
  name: string
  sales: number
  views: number
  category: string
  conversionRate: number
  averageTimeOnPage: number
}
```

**Required Endpoints:**
```typescript
GET /api/admin/analytics              // Get analytics dashboard data
GET /api/admin/analytics/products     // Product performance analytics
GET /api/admin/analytics/orders       // Order analytics
POST /api/analytics/track             // Track user events
```

**Features to implement:**
- Real-time analytics tracking
- Product performance metrics
- Revenue reporting
- User behavior analytics
- Custom date range filtering
- Export functionality

### 6. Contact Form System

#### Current Implementation
**Frontend Files**: `app/contact/page.tsx`
**Current**: Uses mailto links, no backend processing

**Backend Requirements:**
```typescript
// Contact form model
interface ContactMessage {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  subject: string
  message: string
  status: 'unread' | 'read' | 'replied'
  createdAt: Date
}
```

**Required Endpoints:**
```typescript
POST /api/contact                    // Submit contact form
GET /api/admin/messages              // Admin: List contact messages
PUT /api/admin/messages/:id/status   // Admin: Update message status
```

**Features to implement:**
- Email notification system
- Admin message management
- Spam protection
- Auto-reply functionality

## 🛠️ Technical Requirements

### Database Schema
**Recommended**: PostgreSQL with Prisma ORM

```sql
-- Core tables needed
Users (admin users)
Products
Categories
ProductImages
Cart
CartItems
Orders
OrderItems
ContactMessages
UploadedFiles
Analytics (events tracking)
```

### Environment Variables
```env
# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRES_IN=7d

# File Upload
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=biscenic@gmail.com
SMTP_PASS=your-app-password

# WhatsApp (for order notifications)
WHATSAPP_PHONE=+14706219649

# Admin
ADMIN_EMAIL=biscenic@gmail.com
ADMIN_PASSWORD=your-secure-password
```

### Required NPM Packages
```json
{
  "dependencies": {
    "fastify": "^4.24.3",
    "@fastify/cors": "^8.4.0",
    "@fastify/jwt": "^7.2.4",
    "@fastify/multipart": "^8.0.0",
    "@fastify/static": "^6.12.0",
    "prisma": "^5.7.1",
    "@prisma/client": "^5.7.1",
    "bcrypt": "^5.1.1",
    "joi": "^17.11.0",
    "nodemailer": "^6.9.7",
    "aws-sdk": "^2.1499.0",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.6",
    "uuid": "^9.0.1"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.0.2",
    "@types/multer": "^1.4.11",
    "@types/nodemailer": "^6.4.14",
    "@types/uuid": "^9.0.7",
    "typescript": "^5.3.3"
  }
}
```

## 🚀 Implementation Priority

### Phase 1: Core Setup
1. Project setup with Fastify + TypeScript
2. Database setup with Prisma
3. Basic authentication system
4. Product CRUD operations

### Phase 2: E-commerce Features
1. Shopping cart functionality
2. Order management system
3. File upload system
4. Admin dashboard APIs

### Phase 3: Advanced Features
1. Analytics system
2. Contact form processing
3. Email notifications
4. Performance optimization

## 🔄 Frontend Integration Points

### API Base URL Configuration
Update frontend to use backend API:
```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
```

### Authentication Integration
Replace localStorage-based auth with JWT tokens:
```typescript
// Update app/secure-admin/page.tsx
// Update admin route protection
// Add token refresh logic
```

### Product Data Integration
Replace hardcoded product arrays:
```typescript
// Update app/shop/page.tsx
// Update app/admin/products/page.tsx
// Add loading states and error handling
```

### Cart Integration
Replace React Context with API calls:
```typescript
// Update context/cart-context.tsx
// Add server-side cart persistence
```

## 📱 Mobile & Performance Considerations

1. **API Response Optimization**: Implement pagination, field selection
2. **Image Optimization**: Multiple sizes for responsive images
3. **Caching**: Redis for session storage and frequently accessed data
4. **Rate Limiting**: Protect against abuse
5. **CORS Configuration**: Proper frontend domain allowlisting

## 🔒 Security Considerations

1. **Input Validation**: All endpoints need proper validation
2. **SQL Injection Protection**: Use Prisma ORM parameterized queries
3. **XSS Protection**: Sanitize all user inputs
4. **File Upload Security**: Validate file types and scan for malware
5. **Rate Limiting**: Implement on authentication and contact endpoints
6. **HTTPS Only**: Enforce secure connections in production

This backend will provide a solid foundation for the Balenciaga Clone e-commerce platform with room for future scalability and feature additions.
