# Admin User Setup - Biscenic E-commerce

## 🔐 Admin User Credentials

### Successfully Created Admin User

**Email:** `admin@biscenic.com`  
**Username:** `admin`  
**Password:** `AdminPass123!`  
**Roles:** `["user", "admin"]`  
**User ID:** `68be06bc7f98e56d45795e24`  
**Created:** `2025-09-07T22:27:08.862Z`

## 🚀 Backend API Configuration

**Base URL:** `https://biscenic-server-4.onrender.com/api`

## 📋 Admin User Creation Command

```bash
curl -X POST https://biscenic-server-4.onrender.com/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@biscenic.com",
    "username": "admin",
    "password": "AdminPass123!",
    "roles": ["admin"]
  }'
```

### Response:
```json
{
  "message": "User registered successfully",
  "data": {
    "email": "admin@biscenic.com",
    "username": "admin",
    "password": "$2a$12$/fBqf8VHcsZ0M7VA3vUSkulBGiegqVPjURmndEblqlPAFWyCSUUbO",
    "roles": ["user", "admin"],
    "_id": "68be06bc7f98e56d45795e24",
    "createdAt": "2025-09-07T22:27:08.862Z",
    "updatedAt": "2025-09-07T22:27:08.862Z",
    "__v": 0
  }
}
```

## 🔑 Admin Login Test

Test the admin login functionality:

```bash
curl -X POST https://biscenic-server-4.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@biscenic.com",
    "password": "AdminPass123!"
  }'
```

Expected response should include:
- JWT token (expires in 1 hour)
- User data with admin role
- Success message

## 🌐 Frontend Admin Access

### Admin Panel URL
- **Development:** `http://localhost:3000/secure-admin`
- **Production:** `[your-domain]/secure-admin`

### Login Instructions
1. Navigate to the admin login page
2. Enter the admin credentials:
   - **Email:** `admin@biscenic.com`
   - **Password:** `AdminPass123!`
3. Click "Login"
4. You'll be redirected to `/admin/dashboard`

## 🛠️ Admin Panel Features

Once logged in, you'll have access to:

### 📦 Product Management (`/admin/products`)
- View all products
- Add new products
- Edit existing products
- Delete products
- Manage product images
- Update stock levels

### 📋 Order Management (`/admin/orders`)
- View all customer orders
- Update order status
- Process payments
- Track order fulfillment

### 📊 Analytics Dashboard (`/admin/analytics`)
- Sales performance metrics
- Revenue tracking
- Customer analytics
- Product performance data
- Time-based filtering

### 📁 File Management (`/admin/uploads`)
- Upload product images
- Manage media files
- Image optimization
- File organization

## 🔒 Security Features

### JWT Authentication
- Token-based authentication
- 1-hour token expiration
- Automatic token refresh
- Secure Bearer token headers

### Role-Based Access Control
- Admin role verification
- Route protection
- API endpoint security
- Automatic logout on unauthorized access

### Password Security
- bcrypt password hashing
- Strong password requirements
- Secure credential storage

## 🚨 Important Security Notes

1. **Change Default Password:** Change the admin password immediately after first login
2. **Environment Variables:** Store sensitive data in environment variables
3. **HTTPS Only:** Always use HTTPS in production
4. **Token Management:** Tokens expire after 1 hour for security
5. **Role Verification:** All admin routes verify admin role on backend

## 🔧 Environment Configuration

Create a `.env.local` file in your project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://biscenic-server-4.onrender.com/api

# Admin Configuration (for development only)
ADMIN_EMAIL=admin@biscenic.com
ADMIN_USERNAME=admin
```

## 🧪 Testing Admin Functions

### Test Admin Access
```bash
# First, login to get a token
TOKEN=$(curl -X POST https://biscenic-server-4.onrender.com/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@biscenic.com","password":"AdminPass123!"}' \
  | jq -r '.data.token')

# Test admin endpoint access
curl -X GET https://biscenic-server-4.onrender.com/api/users/admin \
  -H "Authorization: Bearer $TOKEN"
```

### Test User Management
```bash
# Get all users (admin only)
curl -X GET https://biscenic-server-4.onrender.com/api/users/users \
  -H "Authorization: Bearer $TOKEN"
```

## 📞 Support

For issues with admin access or authentication:
1. Verify the backend API is running
2. Check network connectivity
3. Ensure correct credentials are used
4. Verify admin role is assigned
5. Check browser console for errors

---

**Last Updated:** September 7, 2025  
**API Version:** v1  
**Admin User Created:** ✅ Success
