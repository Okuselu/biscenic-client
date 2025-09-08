// User Registration Request
export interface UserRegisterRequest {
  email: string;               // Required
  username: string;            // Required
  password: string;            // Required
  roles?: string[];            // Optional: ["user", "admin"]
}

// User Login Request
export interface UserLoginRequest {
  email: string;               // Required
  password: string;            // Required
}

// User Response Structure (from your backend)
export interface UserResponse {
  _id: string;                 // User ID
  email: string;               // User email
  username: string;            // Username
  firstName?: string;          // First name
  lastName?: string;           // Last name
  phone?: string;              // Phone number
  address?: {                  // Address object
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  roles: string[];             // User roles: ["user", "admin"]
  createdAt: string;           // ISO date string
  updatedAt: string;           // ISO date string
}

// Login Success Response
export interface LoginResponse {
  message: string;             // "Logged in successfully"
  token: string;               // JWT token (expires in 1 hour)
  user: UserResponse;          // User data with roles
}

// Registration Success Response
export interface RegisterResponse {
  message: string;             // "User registered successfully"
  data: UserResponse;          // User data without password
}

// Admin Check Response
export interface AdminCheckResponse {
  message: string;             // "Welcome Admin!"
}

// Update User Role Request
export interface UpdateUserRoleRequest {
  role: "user" | "admin";
  action: "add" | "remove";
}

// Auth Context State
export interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

// JWT Token Payload (for decoding)
export interface JWTPayload {
  userId: string;
  email: string;
  roles: string[];
  iat: number;
  exp: number;
}
