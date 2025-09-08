"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"

// Define the type for a product in the cart
interface CartProduct {
  id: number
  name: string
  price: string // Keep as string for display, convert to number if needed for calculations
  image: string
  category: string
  quantity: number
}

// Define the shape of the CartContext
interface CartContextType {
  cart: CartProduct[]
  addToCart: (product: Omit<CartProduct, "quantity">) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

// Create the context with a default undefined value
const CartContext = createContext<CartContextType | undefined>(undefined)

// Create the CartProvider component
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartProduct[]>([])
  const { toast } = useToast()

  const addToCart = (productToAdd: Omit<CartProduct, "quantity">) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex((item) => item.id === productToAdd.id)

      if (existingProductIndex > -1) {
        // Product already in cart, update quantity
        const updatedCart = [...prevCart]
        updatedCart[existingProductIndex].quantity += 1
        toast({
          title: "Quantity Updated",
          description: `${productToAdd.name} quantity increased to ${updatedCart[existingProductIndex].quantity}.`,
        })
        return updatedCart
      } else {
        // Add new product to cart
        toast({
          title: "Item Added to Cart",
          description: `${productToAdd.name} has been added to your cart.`,
        })
        return [...prevCart, { ...productToAdd, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== productId)
      toast({
        title: "Item Removed",
        description: "Product removed from cart.",
      })
      return updatedCart
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
      )
      toast({
        title: "Quantity Updated",
        description: "Product quantity updated.",
      })
      return updatedCart
    })
  }

  const clearCart = () => {
    setCart([])
    toast({
      title: "Cart Cleared",
      description: "All items removed from your cart.",
    })
  }

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the CartContext
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
