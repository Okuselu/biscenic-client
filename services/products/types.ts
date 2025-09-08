export interface ProductImage {
  url: string;
  publicId: string;
  isMain: boolean;
}

export interface ProductCategory {
  _id: string;                   // Category ObjectId
  name: string;                  // Category name
  description?: string;          // Category description (if exists)
  createdAt: string;             // ISO date string
  updatedAt: string;             // ISO date string
}

export interface Product {
  _id: string;                    // MongoDB ObjectId as string
  name: string;                   // Product name
  description: string;            // Product description
  price: number;                  // Product price
  stock: number;                  // Available stock quantity
  category: ProductCategory;      // Populated category object
  images: ProductImage[];         // Array of product images
  createdAt: string;              // ISO date string
  updatedAt: string;              // ISO date string
}

export interface GetProductsResponse {
  products: Product[];
  total?: number;
  page?: number;
  totalPages?: number;
}

// Product Creation Request
export interface CreateProductRequest {
  name: string;                    // Required
  description: string;             // Required
  price: number;                   // Required
  stock: number;                   // Required
  category: string;                // Required (Category ID)
  images: File[];                  // Required (at least one image)
}

// Product Update Request
export interface UpdateProductRequest {
  name?: string;                   // Optional
  description?: string;            // Optional
  price?: number;                  // Optional
  stock?: number;                  // Optional
  category?: string;               // Optional (Category ID)
  existingImageIds?: string;       // Optional (comma-separated IDs to keep)
  images?: File[];                 // Optional (new images)
}

// Product Images Update Request
export interface UpdateProductImagesRequest {
  existingImageIds: string;        // Required (comma-separated IDs to keep)
  images: File[];                  // Required (new images)
}

// Product Management Response
export interface ProductManagementResponse {
  message: string;                 // Success message
  data: Product;                   // Created/Updated product with images
}

// Delete Product Response
export interface DeleteProductResponse {
  message: string;                 // "Product deleted successfully"
}
