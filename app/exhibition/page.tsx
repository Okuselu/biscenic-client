"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

// Images for the carousels
const carouselImages1 = [
  "/images/living-room-bonsai-sofa.png",
  "/images/bonsai-chair.png",
  "/images/bedroom-bonsai-dark.png",
  "/images/bedroom-bonsai-light.jpeg",
]

const carouselImages2 = [
  "/images/bed-light-wood-spheres.png",
  "/images/bed-dark-wood-platform.jpeg",
  "/images/bed-dark-wood-spheres.png",
  "/images/bed-rustic-wood.jpeg",
]

const carouselImages3 = ["/images/crystal-vase-grey-base.png", "/images/crystal-vase-wood-base.jpeg"]

export default function Exhibition() {
  const [currentSlide1, setCurrentSlide1] = useState(0)
  const [isHovered1, setIsHovered1] = useState(false)
  const [currentSlide2, setCurrentSlide2] = useState(0)
  const [isHovered2, setIsHovered2] = useState(false)
  const [currentSlide3, setCurrentSlide3] = useState(0)
  const [isHovered3, setIsHovered3] = useState(false)

  // Memoized navigation functions
  const nextSlide1 = useCallback(() => {
    setCurrentSlide1((prev) => (prev + 1) % carouselImages1.length)
  }, [])

  const prevSlide1 = useCallback(() => {
    setCurrentSlide1((prev) => (prev - 1 + carouselImages1.length) % carouselImages1.length)
  }, [])

  const nextSlide2 = useCallback(() => {
    setCurrentSlide2((prev) => (prev + 1) % carouselImages2.length)
  }, [])

  const prevSlide2 = useCallback(() => {
    setCurrentSlide2((prev) => (prev - 1 + carouselImages2.length) % carouselImages2.length)
  }, [])

  const nextSlide3 = useCallback(() => {
    setCurrentSlide3((prev) => (prev + 1) % carouselImages3.length)
  }, [])

  const prevSlide3 = useCallback(() => {
    setCurrentSlide3((prev) => (prev - 1 + carouselImages3.length) % carouselImages3.length)
  }, [])

  // Auto-slide effect for carousel 1
  useEffect(() => {
    if (!isHovered1) {
      const interval = setInterval(nextSlide1, 3000)
      return () => clearInterval(interval)
    }
  }, [isHovered1, nextSlide1])

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="bg-black text-white py-10 pb-0">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-light mb-6 tracking-wider">EXHIBITION</h1>
        </div>
      </section>

      {/* Carousel 1 */}
      <section
        className="relative w-full h-[70vh] overflow-hidden"
        onMouseEnter={() => setIsHovered1(true)}
        onMouseLeave={() => setIsHovered1(false)}
      >
        {carouselImages1.map((imageSrc, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide1 ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={`Exhibition Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
            />
          </div>
        ))}

        <button
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white bg-opacity-30 rounded-full text-black hover:bg-opacity-50 transition-opacity duration-300 ${isHovered1 ? "opacity-100" : "opacity-0"}`}
          onClick={prevSlide1}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white bg-opacity-30 rounded-full text-black hover:bg-opacity-50 transition-opacity duration-300 ${isHovered1 ? "opacity-100" : "opacity-0"}`}
          onClick={nextSlide1}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Image Previews */}
        <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2 z-20">
          {carouselImages1.map((imageSrc, index) => (
            <button
              key={index}
              className={`relative h-16 w-24 overflow-hidden rounded-md border-2 transition-all duration-300 ${
                index === currentSlide1
                  ? "border-white scale-105 shadow-[0_0_10px_5px_rgba(255,255,255,0.5)]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              onClick={() => setCurrentSlide1(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                fill
                className="object-contain"
                loading="lazy"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Carousel 2 */}
      <section
        className="bg-black relative w-full h-[70vh] overflow-hidden"
        onMouseEnter={() => setIsHovered2(true)}
        onMouseLeave={() => setIsHovered2(false)}
      >
        {carouselImages2.map((imageSrc, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide2 ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={`Design Philosophy Slide ${index + 1}`}
              fill
              className="object-contain"
              loading="lazy"
              sizes="100vw"
            />
          </div>
        ))}

        <button
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white bg-opacity-30 rounded-full text-black hover:bg-opacity-50 transition-opacity duration-300 ${isHovered2 ? "opacity-100" : "opacity-0"}`}
          onClick={prevSlide2}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white bg-opacity-30 rounded-full text-black hover:bg-opacity-50 transition-opacity duration-300 ${isHovered2 ? "opacity-100" : "opacity-0"}`}
          onClick={nextSlide2}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2 z-20">
          {carouselImages2.map((imageSrc, index) => (
            <button
              key={index}
              className={`relative h-16 w-24 overflow-hidden rounded-md border-2 transition-all duration-300 ${
                index === currentSlide2
                  ? "border-white scale-105 shadow-[0_0_10px_5px_rgba(255,255,255,0.5)]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              onClick={() => setCurrentSlide2(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                fill
                className="object-contain"
                loading="lazy"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Carousel 3 */}
      <section
        className="relative w-full h-[70vh] overflow-hidden bg-black"
        onMouseEnter={() => setIsHovered3(true)}
        onMouseLeave={() => setIsHovered3(false)}
      >
        {carouselImages3.map((imageSrc, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide3 ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt={`Innovation Slide ${index + 1}`}
              fill
              className="object-contain"
              loading="lazy"
              sizes="100vw"
            />
          </div>
        ))}

        <button
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white bg-opacity-30 rounded-full text-black hover:bg-opacity-50 transition-opacity duration-300 ${isHovered3 ? "opacity-100" : "opacity-0"}`}
          onClick={prevSlide3}
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-white bg-opacity-30 rounded-full text-black hover:bg-opacity-50 transition-opacity duration-300 ${isHovered3 ? "opacity-100" : "opacity-0"}`}
          onClick={nextSlide3}
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute inset-x-0 bottom-4 flex justify-center space-x-2 z-20">
          {carouselImages3.map((imageSrc, index) => (
            <button
              key={index}
              className={`relative h-16 w-24 overflow-hidden rounded-md border-2 transition-all duration-300 ${
                index === currentSlide3
                  ? "border-white scale-105 shadow-[0_0_10px_5px_rgba(255,255,255,0.5)]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              onClick={() => setCurrentSlide3(index)}
              aria-label={`Go to slide ${index + 1}`}
            >
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                fill
                className="object-contain"
                loading="lazy"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-8 tracking-wide text-white">CRAFTSMANSHIP & INNOVATION</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-8">
            Each piece in our exhibition represents months of meticulous design and craftsmanship. Our artisans combine
            traditional techniques with cutting-edge innovation to create pieces that are not just fashion, but wearable
            art.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed mb-12">
            From the initial sketch to the final stitch, every detail is considered, every material carefully selected,
            and every silhouette perfected to embody our vision of contemporary luxury.
          </p>
          <Button className="bg-white text-black hover:bg-gray-200 px-12 py-4 text-sm tracking-wide" asChild>
            <Link href="/shop">SHOP NOW</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
