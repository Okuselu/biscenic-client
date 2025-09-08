import type { Product } from '@/services/products/types'

/**
 * Formats a numeric price to a display-friendly string
 * @param price - The numeric price value
 * @returns Formatted price string (e.g., "$1,600")
 */
export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString()}`
}

/**
 * Gets the main image URL from a product's images array
 * @param images - Array of product images
 * @returns Main image URL or fallback placeholder
 */
export const getMainImage = (images: Product['images']): string => {
  const mainImage = images.find(img => img.isMain)
  return mainImage?.url || images[0]?.url || "/placeholder.svg?height=400&width=300&query=shop product fallback"
}

/**
 * Converts an API product to cart-compatible format
 * @param product - Product from API
 * @returns Product formatted for cart system
 */
export const convertToCartProduct = (product: Product) => ({
  id: parseInt(product._id.slice(-8), 16), // Convert ObjectId to number for cart compatibility
  name: product.name,
  price: formatPrice(product.price),
  image: getMainImage(product.images),
  category: product.category.name.toLowerCase().replace(/\s+/g, '-'),
})

/**
 * Normalizes category name for filtering
 * @param categoryName - Category name from API
 * @returns Normalized category string for filtering
 */
export const normalizeCategoryName = (categoryName: string): string => {
  return categoryName.toLowerCase().replace(/\s+/g, '-')
}

/**
 * Checks if a product is out of stock
 * @param product - Product to check
 * @returns True if product is out of stock
 */
export const isOutOfStock = (product: Product): boolean => {
  return product.stock <= 0
}
