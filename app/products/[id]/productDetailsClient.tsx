"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getMainImage, formatPrice } from "@/lib/utils/product"
import { useParams } from "next/navigation"
interface ProductImage {
  url: string
  publicId: string
  isMain: boolean
}

interface ProductResponse {
  id: string
  name: string
  price: number
  stock: number
  description: string
  images: ProductImage[]
  category: {
    name: string
    description?: string
  }
}

// Fetch product by ID
async function fetchProduct(id: string): Promise<ProductResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
  if (!res.ok) throw new Error("Failed to fetch product")
  return res.json()
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageSrc, setCurrentImageSrc] = useState("")

  const openImageModal = (imageSrc: string) => {
    setCurrentImageSrc(imageSrc)
    setIsModalOpen(true)
  }

  // Fetch product data on mount
  useEffect(() => {
    fetchProduct(productId)
      .then((data) => {
        // Map images to ensure they conform to ProductImage type
        const mappedImages: ProductImage[] = data.images.map((img: any, idx: number) => ({
          url: img.url,
          publicId: img.publicId || `image-${idx}`, // fallback ID
          isMain: img.isMain || false,
        }))

        setProduct({ ...data, images: mappedImages })
        setIsLoading(false)
      })
      .catch(() => {
        setError(true)
        setIsLoading(false)
      })
  }, [productId])

  if (isLoading) return <div className="min-h-screen bg-gray-50 animate-pulse">Loading...</div>
  if (error || !product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Product not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Title */}
      <section className="bg-white py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-light tracking-wider text-black">{product.name}</h1>
      </section>

      {/* Hero Image */}
      <section className="relative w-full h-[70vh] bg-black flex items-center justify-center">
        <Image src={getMainImage(product.images)} alt={product.name} fill className="object-cover" />
      </section>

      {/* Gallery */}
      <section className="py-20 px-4 md:px-8 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 tracking-wide">{product.name} Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {product.images.map((image) => (
              <div key={image.publicId} className="group cursor-pointer">
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-lg">
                  <Image src={image.url} alt={product.name} fill className="object-cover transition-all duration-700 ease-out group-hover:brightness-110" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="outline"
                      className="bg-transparent border-white text-white hover:bg-white hover:text-black w-full h-full text-sm tracking-wide"
                      onClick={() => openImageModal(image.url)}
                    >
                      VIEW IMAGE
                    </Button>
                  </div>
                </div>
                <h3 className="text-lg font-medium tracking-wide">{product.name} {image.isMain ? '- Main' : ''}</h3>
                <p className="text-gray-600 text-sm">{formatPrice(product.price)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-20 px-4 md:px-8 bg-[#7e8f6c] text-white">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
          <h2 className="text-3xl font-light mb-4 tracking-wide">{product.name}</h2>
          <p className="text-white leading-relaxed text-center max-w-xl mx-auto">{product.description}</p>
          <div className="mt-8 text-center max-w-xl mx-auto space-y-2">
            <p><strong>Price:</strong> {formatPrice(product.price)}</p>
            <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
            <p><strong>Category:</strong> {product.category.name}</p>
            {product.category.description && <p><strong>Category Description:</strong> {product.category.description}</p>}
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm tracking-wide" disabled={product.stock <= 0}>
              <Link href={`/shop?category=${product.category.name.toLowerCase()}`}>
                {product.stock > 0 ? `SHOP ${product.category.name.toUpperCase()}` : 'OUT OF STOCK'}
              </Link>
            </Button>
            <Button variant="outline" asChild className="px-8 py-3 text-sm tracking-wide">
              <Link href="/shop">VIEW ALL PRODUCTS</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-full h-screen p-4 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="sr-only">Full-size Image</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[80vh]">
            {currentImageSrc && <Image src={currentImageSrc} alt="Full-size view" fill className="object-contain" />}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}



// "use client"

// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { getMainImage, formatPrice } from "@/lib/utils/product"
// import { useParams } from "next/navigation"

// interface Product {
//   id: string
//   name: string
//   price: number
//   stock: number
//   description: string
//   images: { url: string; isMain?: boolean }[]
//   category: { name: string; description?: string }
// }

// // ✅ Fetch product data client-side
// async function fetchProduct(id: string): Promise<Product> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
//   if (!res.ok) throw new Error("Failed to fetch product")
//   return res.json()
// }

// export default function ProductDetailPage() {
//   const params = useParams()
//   const productId = params.id as string

//   const [product, setProduct] = useState<Product | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(false)

//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [currentImageSrc, setCurrentImageSrc] = useState("")

//   const openImageModal = (imageSrc: string) => {
//     setCurrentImageSrc(imageSrc)
//     setIsModalOpen(true)
//   }

//   // ✅ Use useEffect for async fetch
//   useEffect(() => {
//     setIsLoading(true)
//     setError(false)
//     fetchProduct(productId)
//       .then((data) => setProduct(data))
//       .catch(() => setError(true))
//       .finally(() => setIsLoading(false))
//   }, [productId])

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         {/* Skeleton loading sections */}
//         <section className="bg-white py-16 text-center">
//           <div className="h-16 bg-gray-300 rounded mx-auto max-w-md animate-pulse"></div>
//         </section>
//         <section className="relative w-full h-[70vh] bg-gray-300 animate-pulse"></section>
//         <section className="py-20 px-4 md:px-8 bg-gray-100">
//           <div className="max-w-5xl mx-auto">
//             <div className="h-8 bg-gray-300 rounded mx-auto max-w-xs mb-12 animate-pulse"></div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {Array.from({ length: 4 }).map((_, index) => (
//                 <div key={index} className="animate-pulse">
//                   <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-300"></div>
//                   <div className="h-6 bg-gray-300 rounded mb-2"></div>
//                   <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     )
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-4xl font-light mb-4">Product Not Found</h1>
//           <p className="text-gray-600 mb-8">
//             The product you're looking for doesn't exist or has been removed.
//           </p>
//           <Button asChild>
//             <Link href="/shop">Back to Shop</Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Title Section */}
//       <section className="bg-white py-16 text-center">
//         <h1 className="text-5xl md:text-7xl font-light tracking-wider text-black">{product.name}</h1>
//       </section>

//       {/* Hero Image */}
//       <section className="relative w-full h-[70vh] bg-black flex items-center justify-center">
//         <Image 
//           src={getMainImage(product.images)} 
//           alt={product.name} 
//           fill 
//           className="object-cover" 
//           priority
//         />
//       </section>

//       {/* Gallery */}
//       <section className="py-20 px-4 md:px-8 bg-gray-100">
//         <div className="max-w-5xl mx-auto">
//           <h2 className="text-3xl font-light text-center mb-12 tracking-wide">{product.name} Gallery</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {product.images.map((image, index) => (
//               <div key={index} className="group cursor-pointer">
//                 <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-lg">
//                   <Image
//                     src={image.url}
//                     alt={`${product.name} - Image ${index + 1}`}
//                     fill
//                     className="object-cover transition-all duration-700 ease-out group-hover:brightness-110"
//                     loading={index === 0 ? "eager" : "lazy"}
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <Button
//                       variant="outline"
//                       className="bg-transparent border-white text-white hover:bg-white hover:text-black w-full h-full text-sm tracking-wide"
//                       onClick={() => openImageModal(image.url)}
//                     >
//                       VIEW IMAGE
//                     </Button>
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-medium tracking-wide">{product.name} {image.isMain ? '- Main' : `- View ${index + 1}`}</h3>
//                 <p className="text-gray-600 text-sm">{formatPrice(product.price)}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Product Details */}
//       <section className="py-20 px-4 md:px-8 bg-[#7e8f6c] text-white">
//         <div className="max-w-5xl mx-auto flex flex-col items-center justify-center space-y-8 text-center w-full">
//           <div>
//             <h2 className="text-3xl font-light mb-4 tracking-wide">{product.name}</h2>
//             <p className="text-white leading-relaxed max-w-xl mx-auto">{product.description}</p>
//           </div>
          
//           <div>
//             <h3 className="text-2xl font-light mb-3 tracking-wide">Product Details:</h3>
//             <div className="text-white leading-relaxed space-y-2 max-w-xl mx-auto">
//               <p><strong>Price:</strong> {formatPrice(product.price)}</p>
//               <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
//               <p><strong>Category:</strong> {product.category.name}</p>
//               {product.category.description && <p><strong>Category Description:</strong> {product.category.description}</p>}
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Button 
//               className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm tracking-wide" 
//               asChild
//               disabled={product.stock <= 0}
//             >
//               <Link href={`/shop?category=${product.category.name.toLowerCase()}`}>
//                 {product.stock > 0 ? `SHOP ${product.category.name.toUpperCase()}` : 'OUT OF STOCK'}
//               </Link>
//             </Button>
            
//             <Button 
//               variant="outline"
//               className="bg-transparent border-white text-white hover:bg-white hover:text-black px-8 py-3 text-sm tracking-wide" 
//               asChild
//             >
//               <Link href="/shop">VIEW ALL PRODUCTS</Link>
//             </Button>
//           </div>
//         </div>
//       </section>

//       {/* Image Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="max-w-full h-screen p-4 overflow-hidden">
//           <DialogHeader className="p-4 pb-0">
//             <DialogTitle className="sr-only">Full-size Image</DialogTitle>
//           </DialogHeader>
//           <div className="relative w-full h-[80vh]">
//             {currentImageSrc && (
//               <Image
//                 src={currentImageSrc}
//                 alt="Full-size view"
//                 fill
//                 className="object-contain"
//                 loading="eager"
//               />
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }


// "use client"

// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { getMainImage, formatPrice } from "@/lib/utils/product"
// import { useParams } from "next/navigation"

// // ✅ Updated: Client-side fetch for product data
// async function fetchProduct(id: string) {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
//   if (!res.ok) throw new Error("Failed to fetch product")
//   return res.json()
// }

// export default function ProductDetailPage() {
//   const params = useParams()
//   const productId = params.id as string

//   const [product, setProduct] = useState<any>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState(false)

//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [currentImageSrc, setCurrentImageSrc] = useState("")

//   const openImageModal = (imageSrc: string) => {
//     setCurrentImageSrc(imageSrc)
//     setIsModalOpen(true)
//   }

//   // ✅ Client-side data fetch
//   useState(() => {
//     fetchProduct(productId)
//       .then((data) => {
//         setProduct(data)
//         setIsLoading(false)
//       })
//       .catch(() => {
//         setError(true)
//         setIsLoading(false)
//       })
//   })

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <section className="bg-white py-16 text-center">
//           <div className="h-16 bg-gray-300 rounded mx-auto max-w-md animate-pulse"></div>
//         </section>
//         <section className="relative w-full h-[70vh] bg-gray-300 animate-pulse"></section>
//         <section className="py-20 px-4 md:px-8 bg-gray-100">
//           <div className="max-w-5xl mx-auto">
//             <div className="h-8 bg-gray-300 rounded mx-auto max-w-xs mb-12 animate-pulse"></div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {Array.from({ length: 4 }).map((_, index) => (
//                 <div key={index} className="animate-pulse">
//                   <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-300"></div>
//                   <div className="h-6 bg-gray-300 rounded mb-2"></div>
//                   <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     )
//   }

//   if (error || !product) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-4xl font-light mb-4">Product Not Found</h1>
//           <p className="text-gray-600 mb-8">
//             The product you're looking for doesn't exist or has been removed.
//           </p>
//           <Button asChild>
//             <Link href="/shop">Back to Shop</Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Title Section */}
//       <section className="bg-white py-16 text-center">
//         <h1 className="text-5xl md:text-7xl font-light tracking-wider text-black">{product.name}</h1>
//       </section>

//       {/* Hero Image Section */}
//       <section className="relative w-full h-[70vh] bg-black flex items-center justify-center">
//         <Image 
//           src={getMainImage(product.images)} 
//           alt={product.name} 
//           fill 
//           className="object-cover" 
//         />
//       </section>

//       {/* Gallery Section */}
//       <section className="py-20 px-4 md:px-8 bg-gray-100">
//         <div className="max-w-5xl mx-auto">
//           <h2 className="text-3xl font-light text-center mb-12 tracking-wide">{product.name} Gallery</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {product.images.map((image: any, index: number) => (
//               <div key={index} className="group cursor-pointer">
//                 <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-lg">
//                   <Image
//                     src={image.url}
//                     alt={`${product.name} - Image ${index + 1}`}
//                     fill
//                     className="object-cover transition-all duration-700 ease-out group-hover:brightness-110"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <Button
//                       variant="outline"
//                       className="bg-transparent border-white text-white hover:bg-white hover:text-black w-full h-full text-sm tracking-wide"
//                       onClick={() => openImageModal(image.url)}
//                     >
//                       VIEW IMAGE
//                     </Button>
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-medium tracking-wide">{product.name} {image.isMain ? '- Main' : `- View ${index + 1}`}</h3>
//                 <p className="text-gray-600 text-sm">{formatPrice(product.price)}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Product Details Section */}
//       <section className="py-20 px-4 md:px-8 bg-[#7e8f6c] text-white">
//         <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
//           <div className="space-y-8 text-center w-full">
//             <div>
//               <h2 className="text-3xl font-light mb-4 tracking-wide">{product.name}</h2>
//               <p className="text-white leading-relaxed text-center max-w-xl mx-auto">{product.description}</p>
//             </div>
            
//             <div>
//               <h3 className="text-2xl font-light mb-3 tracking-wide">Product Details:</h3>
//               <div className="text-white leading-relaxed space-y-2 max-w-xl mx-auto">
//                 <p><strong>Price:</strong> {formatPrice(product.price)}</p>
//                 <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
//                 <p><strong>Category:</strong> {product.category.name}</p>
//                 {product.category.description && (
//                   <p><strong>Category Description:</strong> {product.category.description}</p>
//                 )}
//               </div>
//             </div>
            
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button 
//                 className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm tracking-wide" 
//                 asChild
//                 disabled={product.stock <= 0}
//               >
//                 <Link href={`/shop?category=${product.category.name.toLowerCase()}`}>
//                   {product.stock > 0 ? `SHOP ${product.category.name.toUpperCase()}` : 'OUT OF STOCK'}
//                 </Link>
//               </Button>
              
//               <Button 
//                 variant="outline"
//                 className="bg-transparent border-white text-white hover:bg-white hover:text-black px-8 py-3 text-sm tracking-wide" 
//                 asChild
//               >
//                 <Link href="/shop">VIEW ALL PRODUCTS</Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Image Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="max-w-full h-screen p-4 overflow-hidden">
//           <DialogHeader className="p-4 pb-0">
//             <DialogTitle className="sr-only">Full-size Image</DialogTitle>
//           </DialogHeader>
//           <div className="relative w-full h-[80vh]">
//             {currentImageSrc && (
//               <Image
//                 src={currentImageSrc || "/placeholder.svg"}
//                 alt="Full-size view"
//                 fill
//                 className="object-contain"
//               />
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }





// "use client"

// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import Link from "next/link"
// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
// import { useProduct } from "@/services/products/queries"
// import { getMainImage, formatPrice } from "@/lib/utils/product"
// import { useParams } from "next/navigation"

// export default function ProductDetailPage() {
//   const params = useParams()
//   const productId = params.id as string
  
//   const { data: product, isLoading, error } = useProduct(productId)
  
//   const [isModalOpen, setIsModalOpen] = useState(false)
//   const [currentImageSrc, setCurrentImageSrc] = useState("")

//   const openImageModal = (imageSrc: string) => {
//     setCurrentImageSrc(imageSrc)
//     setIsModalOpen(true)
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         {/* Loading Title Section */}
//         <section className="bg-white py-16 text-center">
//           <div className="h-16 bg-gray-300 rounded mx-auto max-w-md animate-pulse"></div>
//         </section>

//         {/* Loading Hero Section */}
//         <section className="relative w-full h-[70vh] bg-gray-300 animate-pulse"></section>

//         {/* Loading Gallery Section */}
//         <section className="py-20 px-4 md:px-8 bg-gray-100">
//           <div className="max-w-5xl mx-auto">
//             <div className="h-8 bg-gray-300 rounded mx-auto max-w-xs mb-12 animate-pulse"></div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               {Array.from({ length: 4 }).map((_, index) => (
//                 <div key={index} className="animate-pulse">
//                   <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-300"></div>
//                   <div className="h-6 bg-gray-300 rounded mb-2"></div>
//                   <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-4xl font-light mb-4">Product Not Found</h1>
//           <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
//           <Button asChild>
//             <Link href="/shop">Back to Shop</Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   if (!product) {
//     return null
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Title Section */}
//       <section className="bg-white py-16 text-center">
//         <h1 className="text-5xl md:text-7xl font-light tracking-wider text-black">{product.name}</h1>
//       </section>

//       {/* Hero Image Section */}
//       <section className="relative w-full h-[70vh] bg-black flex items-center justify-center">
//         <Image 
//           src={getMainImage(product.images)} 
//           alt={product.name} 
//           fill 
//           className="object-cover" 
//         />
//       </section>

//       {/* Gallery Section */}
//       <section className="py-20 px-4 md:px-8 bg-gray-100">
//         <div className="max-w-5xl mx-auto">
//           <h2 className="text-3xl font-light text-center mb-12 tracking-wide">{product.name} Gallery</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//             {product.images.map((image, index) => (
//               <div key={index} className="group cursor-pointer">
//                 <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-lg">
//                   <Image
//                     src={image.url}
//                     alt={`${product.name} - Image ${index + 1}`}
//                     fill
//                     className="object-cover transition-all duration-700 ease-out group-hover:brightness-110"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <Button
//                       variant="outline"
//                       className="bg-transparent border-white text-white hover:bg-white hover:text-black w-full h-full text-sm tracking-wide"
//                       onClick={() => openImageModal(image.url)}
//                     >
//                       VIEW IMAGE
//                     </Button>
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-medium tracking-wide">{product.name} {image.isMain ? '- Main' : `- View ${index + 1}`}</h3>
//                 <p className="text-gray-600 text-sm">{formatPrice(product.price)}</p>
//               </div>
//             ))}
            
//             {/* Fill remaining slots if less than 4 images */}
//             {product.images.length < 4 && Array.from({ length: 4 - product.images.length }).map((_, index) => (
//               <div key={`placeholder-${index}`} className="group cursor-pointer">
//                 <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-lg">
//                   <Image
//                     src={getMainImage(product.images)}
//                     alt={`${product.name} - Additional View`}
//                     fill
//                     className="object-cover transition-all duration-700 ease-out group-hover:brightness-110 opacity-60"
//                   />
//                   <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <Button
//                       variant="outline"
//                       className="bg-transparent border-white text-white hover:bg-white hover:text-black w-full h-full text-sm tracking-wide"
//                       onClick={() => openImageModal(getMainImage(product.images))}
//                     >
//                       VIEW PRODUCT
//                     </Button>
//                   </div>
//                 </div>
//                 <h3 className="text-lg font-medium tracking-wide">{product.name} Collection</h3>
//                 <p className="text-gray-600 text-sm">Elegant design for your space.</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Product Details Section */}
//       <section className="py-20 px-4 md:px-8 bg-[#7e8f6c] text-white">
//         <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
//           <div className="space-y-8 text-center w-full">
//             <div>
//               <h2 className="text-3xl font-light mb-4 tracking-wide">{product.name}</h2>
//               <p className="text-white leading-relaxed text-center max-w-xl mx-auto">
//                 {product.description}
//               </p>
//             </div>
            
//             <div>
//               <h3 className="text-2xl font-light mb-3 tracking-wide">Product Details:</h3>
//               <div className="text-white leading-relaxed space-y-2 max-w-xl mx-auto">
//                 <p><strong>Price:</strong> {formatPrice(product.price)}</p>
//                 <p><strong>Stock:</strong> {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
//                 <p><strong>Category:</strong> {product.category.name}</p>
//                 {product.category.description && (
//                   <p><strong>Category Description:</strong> {product.category.description}</p>
//                 )}
//               </div>
//             </div>
            
//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button 
//                 className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm tracking-wide" 
//                 asChild
//                 disabled={product.stock <= 0}
//               >
//                 <Link href={`/shop?category=${product.category.name.toLowerCase()}`}>
//                   {product.stock > 0 ? `SHOP ${product.category.name.toUpperCase()}` : 'OUT OF STOCK'}
//                 </Link>
//               </Button>
              
//               <Button 
//                 variant="outline"
//                 className="bg-transparent border-white text-white hover:bg-white hover:text-black px-8 py-3 text-sm tracking-wide" 
//                 asChild
//               >
//                 <Link href="/shop">VIEW ALL PRODUCTS</Link>
//               </Button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Image Modal */}
//       <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//         <DialogContent className="max-w-full h-screen p-4 overflow-hidden">
//           <DialogHeader className="p-4 pb-0">
//             <DialogTitle className="sr-only">Full-size Image</DialogTitle>
//           </DialogHeader>
//           <div className="relative w-full h-[80vh]">
//             {currentImageSrc && (
//               <Image
//                 src={currentImageSrc || "/placeholder.svg"}
//                 alt="Full-size view"
//                 fill
//                 className="object-contain"
//               />
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   )
// }
