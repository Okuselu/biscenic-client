"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"

export default function OrderConfirmationPage() {
  const router = useRouter()

  // Redirect to home after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
            <CardDescription>
              Thank you for your order. Your payment has been processed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Order Confirmed</strong>
              </p>
              <p className="text-sm text-green-600 mt-1">
                You will receive an email confirmation shortly with your order details.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Your order is being processed and will be shipped within 2-3 business days.
              </p>
              <p className="text-sm text-gray-600">
                You will receive tracking information via email once your order ships.
              </p>
            </div>

            <div className="flex flex-col space-y-3 pt-4">
              <Button asChild className="bg-[#7e8f6c] hover:bg-[#6d7a5c]">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              Redirecting to homepage in 10 seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
