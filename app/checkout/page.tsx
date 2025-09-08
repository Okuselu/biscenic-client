"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { useInitializePayment, useVerifyPayment } from "@/services/payments/queries"
import { getMainImage } from "@/lib/utils/product"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

interface ShippingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cart, clearCart } = useCart()
  const { toast } = useToast()
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Get payment reference from URL (when returning from Paystack)
  const paymentReference = searchParams.get('reference')
  const isPaymentReturn = !!paymentReference
  
  // Payment mutations and queries
  const initializePaymentMutation = useInitializePayment()
  const { data: verificationData, isLoading: isVerifying, error: verificationError } = useVerifyPayment(
    paymentReference || '',
    isPaymentReturn
  )

  // Handle payment verification on return from Paystack
  useEffect(() => {
    if (isPaymentReturn && verificationData) {
      if (verificationData.status === 'success') {
        toast({
          title: "Payment Successful!",
          description: "Your order has been confirmed and will be processed shortly.",
        })
        clearCart()
        router.push('/order-confirmation')
      } else {
        toast({
          title: "Payment Failed",
          description: "Your payment was not successful. Please try again.",
          variant: "destructive",
        })
      }
    }
  }, [isPaymentReturn, verificationData, toast, clearCart, router])

  // Handle verification error
  useEffect(() => {
    if (verificationError) {
      toast({
        title: "Payment Verification Failed",
        description: "Unable to verify payment status. Please contact support.",
        variant: "destructive",
      })
    }
  }, [verificationError, toast])

  // Calculate totals
  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""))
      return sum + (price * item.quantity)
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const shipping = 0 // Free shipping
  const tax = subtotal * 0.075 // 7.5% VAT
  const total = subtotal + shipping + tax

  // Convert to kobo (Nigerian currency smallest unit)
  const totalInKobo = Math.round(total * 100)

  const handleInputChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = (): boolean => {
    const { firstName, lastName, email, phone } = shippingInfo
    
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handlePayment = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add items before checkout.",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) return

    setIsProcessing(true)

    try {
      await initializePaymentMutation.mutateAsync({
        email: shippingInfo.email,
        amount: totalInKobo,
      })
    } catch (error) {
      console.error('Payment initialization error:', error)
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Show loading screen when verifying payment
  if (isPaymentReturn && isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-2xl font-semibold mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your payment.</p>
        </div>
      </div>
    )
  }

  // Redirect to cart if empty
  if (cart.length === 0 && !isPaymentReturn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart before checkout.</p>
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-wide">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <CardDescription>Enter your details for order delivery</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="mt-1"
                    placeholder="+234..."
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>{cart.length} item(s) in your cart</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="my-6" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₦${shipping.toLocaleString()}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VAT (7.5%)</span>
                    <span>₦{tax.toFixed(2)}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <Button
                  className="w-full mt-6 bg-[#7e8f6c] hover:bg-[#6d7a5c] text-white"
                  onClick={handlePayment}
                  disabled={isProcessing || initializePaymentMutation.isPending}
                >
                  {isProcessing || initializePaymentMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    `Pay ₦${total.toLocaleString()} with Paystack`
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure payment powered by Paystack. Your payment information is encrypted and secure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
