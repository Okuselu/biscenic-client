"use client"

import Link from "next/link"
import { Search, ShoppingBag, User } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation" // Import usePathname
import { useCart } from "@/context/cart-context" // Import useCart

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname() // Get the current pathname
  const { cart } = useCart() // Get cart from context

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0) // Calculate total quantity

  return (
    <header className="border-b border-gray-100 sticky top-0 z-50 w-full" style={{ backgroundColor: "#7e8f6c" }}>
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
          {/* Left Navigation - Hidden on mobile, visible on lg+ */}
          <nav className="hidden lg:flex items-center space-x-4 xl:space-x-8">
            <Link
              href="/"
              className="text-xs xl:text-sm font-medium tracking-wide hover:text-gray-600 transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="text-xs xl:text-sm font-medium tracking-wide hover:text-gray-600 transition-colors"
            >
              ABOUT US
            </Link>
            <Link
              href="/contact"
              className="text-xs xl:text-sm font-medium tracking-wide hover:text-gray-600 transition-colors"
            >
              CONTACT US
            </Link>
            <Link
              href="/shop"
              className="text-xs xl:text-sm font-medium tracking-wide hover:text-gray-600 transition-colors"
            >
              SHOP NOW
            </Link>
          </nav>

          {/* Mobile Menu Button - Visible on mobile/tablet, hidden on lg+ */}
          <button className="lg:hidden p-1" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center">
              <span
                className={`bg-black block transition-all duration-300 ease-out h-0.5 w-5 sm:w-6 rounded-sm ${isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"}`}
              ></span>
              <span
                className={`bg-black block transition-all duration-300 ease-out h-0.5 w-5 sm:w-6 rounded-sm my-0.5 ${isMenuOpen ? "opacity-0" : "opacity-100"}`}
              ></span>
              <span
                className={`bg-black block transition-all duration-300 ease-out h-0.5 w-5 sm:w-6 rounded-sm ${isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"}`}
              ></span>
            </div>
          </button>

          {/* Center Logo - Responsive sizing */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <Link
              href="/"
              className="text-lg sm:text-xl lg:text-2xl font-bold tracking-[0.1em] sm:tracking-[0.15em] lg:tracking-[0.2em]"
            >
              BISCENIC
            </Link>
          </div>

          {/* Right Icons - Responsive sizing and spacing */}
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            <button className="p-1.5 sm:p-2 hover:bg-gray-50 rounded-full transition-colors">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {/* Conditionally render the User icon based on the path */}
            <Link href="/secure-admin" className="p-1.5 sm:p-2 hover:bg-gray-50 rounded-full transition-colors">
              <User className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link href="/cart" className="relative p-1.5 sm:p-2 hover:bg-gray-50 rounded-full transition-colors">
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {totalCartItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu - Responsive padding and text with animation */}
        <div
          className={`lg:hidden border-t border-gray-100 overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav
            className={`py-3 sm:py-4 space-y-3 sm:space-y-4 transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-y-0" : "-translate-y-4"
            }`}
          >
            <Link
              href="/"
              className="block text-sm sm:text-base font-medium tracking-wide hover:text-gray-600 transition-colors"
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="block text-sm sm:text-base font-medium tracking-wide hover:text-gray-600 transition-colors"
            >
              ABOUT US
            </Link>
            <Link
              href="/contact"
              className="block text-sm sm:text-base font-medium tracking-wide hover:text-gray-600 transition-colors"
            >
              CONTACT US
            </Link>
            <Link
              href="/shop"
              className="block text-sm sm:text-base font-medium tracking-wide hover:text-gray-600 transition-colors"
            >
              SHOP NOW
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
