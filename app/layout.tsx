import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from "@/context/cart-context"
import { QueryProvider } from "@/components/providers/query-provider"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "BISCENIC - Luxury Fashion House",
  description:
    "Discover luxury fashion and home decor at BISCENIC. Premium collections including LumiVase and exclusive designs.",
  keywords: "luxury fashion, home decor, LumiVase, premium collections",
  openGraph: {
    title: "BISCENIC - Luxury Fashion House",
    description: "Discover luxury fashion and home decor at BISCENIC",
    type: "website",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//blob.v0.dev" />
      </head>
      <body className={inter.className}>
        <QueryProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
