/**
 * Common API response wrapper interface
 * Used by all backend API endpoints
 */
export interface ApiResponse<T> {
  message: string
  data: T
  error: boolean
}

/**
 * Common error response interface
 * Used when API calls fail
 */
export interface ApiErrorResponse {
  message: string
  error: true
  details?: string | object
}
