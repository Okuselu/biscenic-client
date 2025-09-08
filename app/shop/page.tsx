"use client"

import Image from "next/image"
import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useProducts } from "@/services/products/queries"
import type { Product } from "@/services/products/types"
import { 
  normalizeCategoryName,
  isOutOfStock, 
  convertToCartProduct,
  formatPrice,
  getMainImage
} from "@/lib/utils/product"

// Skeleton component for loading state
const ProductSkeleton = () => (
  <div className="group cursor-pointer animate-pulse">
    <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-200 rounded-lg border shadow-sm">
      <div className="w-full h-full bg-gray-300"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      <div className="h-10 bg-gray-300 rounded"></div>
    </div>
  </div>
)

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { addToCart } = useCart()
  
  // Fetch products from API
  const { data: products, isLoading, error } = useProducts()

  const handleAddToCartClick = useCallback(
    (product: Product) => {
      const cartProduct = convertToCartProduct(product)
      addToCart(cartProduct)
    },
    [addToCart],
  )

  const filteredProducts = useMemo(() => {
    if (!products) return []
    return selectedCategory === "all" 
      ? products 
      : products.filter((product) => 
          normalizeCategoryName(product.category.name) === selectedCategory
        )
  }, [products, selectedCategory])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-wider">SHOP NOW</h1>
          <p className="text-gray-600 text-lg">Discover our latest collections</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">Failed to load products. Please try again.</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Retry
              </Button>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading
              ? // Show skeleton loaders while loading
                Array.from({ length: 6 }).map((_, index) => <ProductSkeleton key={index} />)
              : (filteredProducts || []).map((product) => (
                  <div key={product._id} className="group cursor-pointer">
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-gray-100 rounded-lg border shadow-sm transition-all duration-300 group-hover:shadow-lg">
                      <Image
                        src={getMainImage(product.images)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <button className="absolute top-4 right-4 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100">
                        <Heart className="w-5 h-5" />
                      </button>
                      {isOutOfStock(product) && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-semibold">OUT OF STOCK</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium tracking-wide">{product.name}</h3>
                      <p className="text-gray-600">{formatPrice(product.price)}</p>
                      <p className="text-sm text-gray-500">Category: {product.category.name}</p>
                      <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      <Button
                        variant="outline"
                        className="w-full border-black text-black bg-transparent hover:bg-[#7e8f6c] hover:text-white transition-colors duration-300 group-hover:animate-glow hover:brightness-125"
                        onClick={() => handleAddToCartClick(product)}
                        disabled={isOutOfStock(product)}
                      >
                        {isOutOfStock(product) ? 'OUT OF STOCK' : 'ADD TO CART'}
                      </Button>
                    </div>
                  </div>
                ))}
          </div>
          
          {!isLoading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">No products found.</p>
            </div>
          )}
        </div>
      </section>

      {/* Load More - Hidden for now since we're loading all products */}
      {false && (
        <section className="pb-20">
          <div className="text-center">
            <Button
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white px-12 py-3 bg-transparent"
              onClick={() => {
                // Future: Implement pagination
              }}
            >
              LOAD MORE
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}
