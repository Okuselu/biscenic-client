"use client"

import Image from "next/image"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

// -----------------------------
// Cart Item Type
// -----------------------------
interface CartItem {
  id: number
  name: string
  category: string
  price: string // e.g., "$49.99"
  image?: string
  quantity: number
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
  const router = useRouter()

  // -----------------------------
  // Calculate subtotal
  // -----------------------------
  const calculateSubtotal = (): number => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
      return sum + price * item.quantity
    }, 0)
  }

  // -----------------------------
  // Quantity handler
  // -----------------------------
  const handleQuantityChange = (productId: number, newQuantity: string) => {
    const quantity = parseInt(newQuantity)
    if (!isNaN(quantity) && quantity >= 1) {
      updateQuantity(productId, quantity)
    }
  }

  // -----------------------------
  // WhatsApp checkout handler
  // -----------------------------
  const handleWhatsAppCheckout = () => {
    const subtotal = calculateSubtotal().toFixed(2)
    const cartDetails = cart
      .map((item) => `${item.name} (x${item.quantity}) - ${item.price}`)
      .join("\n")
    const message = `Hello, I'd like to place an order for the following items:\n\n${cartDetails}\n\nTotal: $${subtotal}\n\nPlease confirm my order.`
    const whatsappUrl = `https://wa.me/+14706219649?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    clearCart()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-light text-center mb-10 tracking-wider">
          YOUR SHOPPING CART
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              onClick={() => router.push("/shop")}
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-6">
              {cart.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex items-center border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="relative w-24 h-24 mr-4 flex-shrink-0">
                    <Image
                      src={
                        item.image ||
                        "/placeholder.svg?height=100&width=100&query=cart item"
                      }
                      alt={item.name}
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-lg font-medium">{item.name}</h2>
                    <p className="text-gray-600 text-sm">{item.category}</p>
                    <p className="text-gray-800 font-semibold mt-1">{item.price}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.id, e.target.value)
                      }
                      className="w-20 text-center border-gray-300 focus:border-black"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="border-black text-black hover:bg-black hover:text-white bg-transparent"
                >
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
              <h2 className="text-2xl font-light mb-6 tracking-wide">ORDER SUMMARY</h2>
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
                  <span>Total</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-3 mt-8">
                <Button
                  className="w-full bg-[#7e8f6c] text-white hover:bg-[#6d7a5c] py-3"
                  onClick={() => router.push("/checkout")}
                >
                  PROCEED TO CHECKOUT
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-black text-black hover:bg-gray-100 py-3"
                  onClick={handleWhatsAppCheckout}
                >
                  CHECKOUT VIA WHATSAPP
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



// "use client"



// import Image from "next/image"
// import { useCart } from "@/context/cart-context"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Trash2 } from "lucide-react"
// import { useRouter } from "next/navigation"

// export default function CartPage() {
//   const { cart, removeFromCart, updateQuantity, clearCart } = useCart()
//   const router = useRouter()

//   const calculateSubtotal = () => {
//     return cart.reduce((sum, item) => {
//       const price = Number.parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
//       return sum + price * item.quantity
//     }, 0)
//   }

//   const handleQuantityChange = (productId: number, newQuantity: string) => {
//     const quantity = Number.parseInt(newQuantity)
//     if (!isNaN(quantity) && quantity >= 1) {
//       updateQuantity(productId, quantity)
//     } else if (newQuantity === "") {
//       // Allow empty string temporarily for user input, but don't update quantity
//     }
//   }

//   const handleWhatsAppCheckout = () => {
//     const subtotal = calculateSubtotal().toFixed(2)
//     const cartDetails = cart.map((item) => `${item.name} (x${item.quantity}) - ${item.price}`).join("\n")
//     const message = `Hello, I'd like to place an order for the following items:\n\n${cartDetails}\n\nTotal: $${subtotal}\n\nPlease confirm my order.`
//     const whatsappUrl = `https://wa.me/+14706219649?text=${encodeURIComponent(message)}`
//     window.open(whatsappUrl, "_blank")
//     clearCart() // Clear cart after initiating WhatsApp chat
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
//       <div className="max-w-6xl mx-auto">
//         <h1 className="text-4xl md:text-5xl font-light text-center mb-10 tracking-wider">YOUR SHOPPING CART</h1>

//         {cart.length === 0 ? (
//           <div className="text-center py-20">
//             <p className="text-xl text-gray-600 mb-6">Your cart is empty.</p>
//             <Button className="bg-black text-white hover:bg-gray-800" onClick={() => router.push("/shop")}>
//               Continue Shopping
//             </Button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
//             {/* Cart Items */}
//             <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md space-y-6">
//               {cart.map((item) => (
//                 <div key={item.id} className="flex items-center border-b pb-4 last:border-b-0 last:pb-0">
//                   <div className="relative w-24 h-24 mr-4 flex-shrink-0">
//                     <Image
//                       src={item.image || "/placeholder.svg?height=100&width=100&query=cart item"}
//                       alt={item.name}
//                       fill
//                       className="object-cover rounded-md"
//                     />
//                   </div>
//                   <div className="flex-grow">
//                     <h2 className="text-lg font-medium">{item.name}</h2>
//                     <p className="text-gray-600 text-sm">{item.category}</p>
//                     <p className="text-gray-800 font-semibold mt-1">{item.price}</p>
//                   </div>
//                   <div className="flex items-center space-x-4">
//                     <Input
//                       type="number"
//                       min="1"
//                       value={item.quantity}
//                       onChange={(e) => handleQuantityChange(item.id, e.target.value)}
//                       className="w-20 text-center border-gray-300 focus:border-black"
//                     />
//                     <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)}>
//                       <Trash2 className="h-5 w-5 text-red-500" />
//                       <span className="sr-only">Remove item</span>
//                     </Button>
//                   </div>
//                 </div>
//               ))}
//               <div className="flex justify-end pt-4">
//                 <Button
//                   variant="outline"
//                   onClick={clearCart}
//                   className="border-black text-black hover:bg-black hover:text-white bg-transparent"
//                 >
//                   Clear Cart
//                 </Button>
//               </div>
//             </div>

//             {/* Order Summary */}
//             <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit sticky top-24">
//               <h2 className="text-2xl font-light mb-6 tracking-wide">ORDER SUMMARY</h2>
//               <div className="space-y-3 text-gray-700">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   <span>${calculateSubtotal().toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Shipping</span>
//                   <span>FREE</span> {/* Placeholder */}
//                 </div>
//                 <div className="flex justify-between font-bold text-lg border-t pt-3 mt-3">
//                   <span>Total</span>
//                   <span>${calculateSubtotal().toFixed(2)}</span>
//                 </div>
//               </div>
//               <div className="space-y-3 mt-8">
//                 <Button
//                   className="w-full bg-[#7e8f6c] text-white hover:bg-[#6d7a5c] py-3"
//                   onClick={() => router.push('/checkout')}
//                 >
//                   PROCEED TO CHECKOUT
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="w-full border-black text-black hover:bg-gray-100 py-3"
//                   onClick={handleWhatsAppCheckout}
//                 >
//                   CHECKOUT VIA WHATSAPP
//                 </Button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
