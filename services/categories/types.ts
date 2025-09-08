export interface Category {
  _id: string;                   // Category ObjectId
  name: string;                  // Category name
  description?: string;          // Category description (optional)
  createdAt: string;             // ISO date string
  updatedAt: string;             // ISO date string
}

export interface CreateCategoryRequest {
  name: string;                  // Required
  description?: string;          // Optional
}

export interface UpdateCategoryRequest {
  name?: string;                 // Optional
  description?: string;          // Optional
}

export interface GetCategoriesResponse {
  categories: Category[];
  total?: number;
  page?: number;
  totalPages?: number;
}
