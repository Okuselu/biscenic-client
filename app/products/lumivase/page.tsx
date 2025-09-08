"use client" // This component needs to be a Client Component to use useState

import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link" // Keep Link for other buttons if needed, but remove from this specific button
import { useState } from "react" // Import useState
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog" // Import Dialog components

export default function LumiVaseProductPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImageSrc, setCurrentImageSrc] = useState("")

  const openImageModal = (imageSrc: string) => {
    setCurrentImageSrc(imageSrc)
    setIsModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* New Title Section */}
      <section className="bg-white py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-light tracking-wider text-black">LumiVase®</h1>
      </section>

      {/* Video Section */}
      <section className="relative w-full h-[70vh] bg-black flex items-center justify-center">
        <Image src="/images/IMG_7809_converted.png" alt="LumiVase Hero Image" fill className="object-cover" />
      </section>

      {/* New Gallery Section - 2 rows, 2 columns with hover effect */}
      <section className="py-20 px-4 md:px-8 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-light text-center mb-12 tracking-wide">LumiVase® Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Item 1 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/lumivase-bonsai.png" // Original bonsai image
                  alt="LumiVase Bonsai Display"
                  fill
                  className="object-contain transition-all duration-700 ease-out group-hover:brightness-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-black w-full h-full text-sm tracking-wide"
                    onClick={() => openImageModal("/images/lumivase-bonsai.png")} // Call openImageModal
                  >
                    VIEW PRODUCT
                  </Button>
                </div>
              </div>
              <h3 className="text-lg font-medium tracking-wide">LumiVase® Classic</h3>
              <p className="text-gray-600 text-sm">Elegant display for your bonsai.</p>
            </div>

            {/* Gallery Item 2 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/IMG_8437.jpg" // Updated image
                  alt="LumiVase Gallery Item 2"
                  fill
                  className="object-contain transition-all duration-700 ease-out group-hover:brightness-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-black w-full h-full text-sm tracking-wide"
                    onClick={() => openImageModal("/images/IMG_8437.jpg")} // Updated onClick to match new image
                  >
                    VIEW PRODUCT
                  </Button>
                </div>
              </div>
              <h3 className="text-lg font-medium tracking-wide">LumiVase® Modern</h3>
              <p className="text-gray-600 text-sm">Sleek design for contemporary spaces.</p>
            </div>

            {/* Gallery Item 3 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/IMG_8312.PNG" // Unique placeholder
                  alt="LumiVase Gallery Item 3"
                  fill
                  className="object-contain transition-all duration-700 ease-out group-hover:brightness-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-black w-full h-full text-sm tracking-wide"
                    onClick={() => openImageModal("/images/IMG_8312.PNG")} // Call openImageModal
                  >
                    VIEW PRODUCT
                  </Button>
                </div>
              </div>
              <h3 className="text-lg font-medium tracking-wide">LumiVase® Zen</h3>
              <p className="text-gray-600 text-sm">Peaceful ambiance for relaxation.</p>
            </div>

            {/* Gallery Item 4 */}
            <div className="group cursor-pointer">
              <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg shadow-lg">
                <Image
                  src="/images/212DC255-CF3B-4665-AF90-01E876129C0D.PNG"
                  alt="LumiVase Gallery Item 4"
                  fill
                  className="object-contain transition-all duration-700 ease-out group-hover:brightness-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    variant="outline"
                    className="bg-transparent border-white text-white hover:bg-white hover:text-black w-full h-full text-sm tracking-wide"
                    onClick={() => openImageModal("/images/212DC255-CF3B-4665-AF90-01E876129C0D.PNG")} // Call openImageModal
                  >
                    VIEW PRODUCT
                  </Button>
                </div>
              </div>
              <h3 className="text-lg font-medium tracking-wide">LumiVase® Grand</h3>
              <p className="text-gray-600 text-sm">Statement piece for larger spaces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="py-20 px-4 md:px-8 bg-[#7e8f6c] text-white">
        <div className="max-w-5xl mx-auto flex flex-col items-center justify-center">
          {" "}
          {/* Updated classes */}
          <div className="space-y-8 text-center w-full">
            {" "}
            {/* Added text-center for inner content */}
            <div>
              <h2 className="text-3xl font-light mb-4 tracking-wide">Lumivase</h2>
              <p className="text-white leading-relaxed text-center max-w-xl mx-auto">
                At the intersection of nature and innovation, the Lumivase reimagines domestic ambiance through an
                exquisite symbiosis of organic elements and intuitive technology. Sculpted from rich mahogany and
                encased in crystalline acrylic, this avant-garde vessel integrates ambient audio via Bluetooth,
                diffusing aural serenity into the room. <br />
                Adorned with luminous gemstones and smooth river pebbles, it offers a contemplative focal point—evoking
                stillness, depth, and quiet transformation. The Lumivase is not merely décor; it is an invitation to
                presence.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-light mb-3 tracking-wide">Key Elements:</h3>
              <ul className="text-white leading-relaxed list-disc list-inside space-y-1 max-w-xl mx-auto">
                <li>Immersive Bluetooth Audio System</li>
                <li>Embedded Gemstones and Natural Pebbles</li>
                <li>Transparent Acrylic Composition</li>
                <li>Mahogany Hardwood Base</li>
              </ul>
            </div>
            <Button className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-sm tracking-wide" asChild>
              <Link href="/shop?category=lumivase">SHOP LUMIVASE®</Link>
            </Button>
          </div>
          {/* The div containing the image has been removed */}
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-full h-screen p-4 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="sr-only">Full-size Image</DialogTitle>
          </DialogHeader>
          <div className="relative w-full h-[80vh]">
            {currentImageSrc && (
              <Image
                src={currentImageSrc || "/placeholder.svg"}
                alt="Full-size view"
                fill
                className="object-contain" // Use object-contain to ensure full image is visible
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
