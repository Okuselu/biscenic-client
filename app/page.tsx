"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Suspense } from "react"
import { useProducts } from "@/services/products/queries"
import { getMainImage, formatPrice } from "@/lib/utils/product"

// Featured collections component using API data
const FeaturedCollections = () => {
  const { data: products, isLoading, error } = useProducts()
  
  // Get first 3 products for featured collections
  const featuredProducts = products?.slice(0, 3) || []

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-16 tracking-wide">FEATURED COLLECTIONS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="group cursor-pointer animate-pulse">
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-lg bg-gray-200">
                  <div className="w-full h-full bg-gray-300"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-8 tracking-wide">FEATURED COLLECTIONS</h2>
          <p className="text-gray-600">Unable to load featured products at this time.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-light text-center mb-16 tracking-wide">FEATURED COLLECTIONS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product._id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={getMainImage(product.images)}
                  alt={product.name}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:brightness-110"
                  loading="lazy"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-black px-8 py-3 text-sm tracking-wide"
                    asChild
                  >
                    <Link href={`/products/${product._id}`}>VIEW DETAILS</Link>
                  </Button>
                </div>
              </div>
              <h3 className="text-lg font-medium tracking-wide">{product.name}</h3>
              <p className="text-gray-600 text-sm">{product.description || formatPrice(product.price)}</p>
              <p className="text-gray-500 text-xs">Category: {product.category.name}</p>
            </div>
          ))}
        </div>
        
        {featuredProducts.length === 0 && !isLoading && !error && (
          <div className="text-center">
            <p className="text-gray-600">No featured products available.</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen bg-black">
        <video
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/video-output-722E2F52-F4E1-4DB8-8D8B-BC36CCB34883%202-HCjwgc0grO1Xhk37i6IGV8KlrrX6bt.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover"
          onLoadedMetadata={(e) => {
            const video = e.target as HTMLVideoElement
            video.playbackRate = 0.75
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-[#7e8f6c] hover:text-white hover:border-[#7e8f6c] px-8 py-3 text-sm tracking-wide transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
              asChild
            >
              <Link href="/shop" prefetch={false}>
                SHOP NOW
              </Link>
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-[#7e8f6c] hover:text-white hover:border-[#7e8f6c] px-8 py-3 text-sm tracking-wide transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
              asChild
            >
              <Link href="/exhibition" prefetch={false}>
                EXHIBITION
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Collections with Suspense */}
      <Suspense
        fallback={
          <div className="py-20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        }
      >
        <FeaturedCollections />
      </Suspense>

      {/* Newsletter */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-light mb-4 tracking-wide">CONTACT US NOW!</h2>
          <p className="text-gray-600 mb-8">{""} </p>
          <div className="flex justify-center max-w-md mx-auto">
            <Button className="text-white hover:bg-gray-800 px-8 py-3 bg-[rgba(126,143,108,1)]" asChild>
              <Link href="/contact" prefetch={false}>
                CONTACT US
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
