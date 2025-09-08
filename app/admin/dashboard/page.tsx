"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Package, ShoppingCart, BarChart, LogOut } from "lucide-react"
import { useAdminCheck, useLogout } from "@/services/auth/queries"
import { tokenUtils } from "@/services/auth/api"

// Reusable Admin Action Card
interface AdminActionCardProps {
  icon: React.ReactNode
  title: string
  description: string
  link: string
  linkLabel?: string
}

function AdminActionCard({ icon, title, description, link, linkLabel }: AdminActionCardProps) {
  return (
    <Card className="p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="mx-auto mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <Button className="w-full bg-black text-white hover:bg-gray-800" asChild>
        <Link href={link}>{linkLabel || "Go"}</Link>
      </Button>
    </Card>
  )
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const logout = useLogout()
  const { data: user, isLoading, error } = useAdminCheck()

  // Redirect if token missing or expired
  useEffect(() => {
    const token = tokenUtils.getToken()
    if (!token || tokenUtils.isTokenExpired(token)) {
      router.push("/secure-admin")
    }
  }, [router])

  // Handle authentication errors
  useEffect(() => {
    if (error) {
      console.error("Admin access denied:", error)
      tokenUtils.removeToken()
      router.push("/secure-admin")
    }
  }, [error, router])

  const handleLogout = () => {
    logout()
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  // Access denied screen
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
          <Button onClick={() => router.push("/secure-admin")}>Go to Login</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-12">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900">
            Admin Dashboard
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Welcome, Administrator! Manage your store's content here.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-10">
          {/* Action Cards Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <AdminActionCard
              icon={<Package className="h-12 w-12 text-indigo-600" />}
              title="Product Management"
              description="Add, edit, or remove products from your catalog."
              link="/admin/products"
              linkLabel="Manage Products"
            />
            <AdminActionCard
              icon={<ShoppingCart className="h-12 w-12 text-green-600" />}
              title="Order Management"
              description="View and process customer orders."
              link="/admin/orders"
              linkLabel="View Orders"
            />
            <AdminActionCard
              icon={<BarChart className="h-12 w-12 text-blue-600" />}
              title="Data Analytics"
              description="Monitor website performance and user interactions."
              link="/admin/analytics"
              linkLabel="View Analytics"
            />
          </div>

          <Separator className="my-8" />

          {/* Logout Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white bg-transparent flex items-center gap-2 px-6 py-3"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



// "use client"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { useEffect } from "react"
// import { Package, ShoppingCart, BarChart, LogOut } from "lucide-react"
// import { useAdminCheck, useLogout } from "@/services/auth/queries"
// import { tokenUtils } from "@/services/auth/api"

// export default function AdminDashboardPage() {
//   const router = useRouter()
//   const logout = useLogout()
  
//   // Check admin access with the backend
//   const { data: user, isLoading, error } = useAdminCheck()

//   useEffect(() => {
//     const token = tokenUtils.getToken()
//     if (!token || tokenUtils.isTokenExpired(token)) {
//       router.push("/secure-admin")
//     }
//   }, [router])

//   // Handle authentication error
//   useEffect(() => {
//     if (error) {
//       console.error('Admin access denied:', error)
//       tokenUtils.removeToken()
//       router.push("/secure-admin")
//     }
//   }, [error, router])

//   const handleLogout = () => {
//     logout()
//   }

//   // Show loading screen while checking authentication
//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
//           <p className="text-gray-600">Verifying access...</p>
//         </div>
//       </div>
//     )
//   }

//   // Show error if user is not authenticated
//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
//           <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
//           <Button onClick={() => router.push('/secure-admin')}>
//             Go to Login
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-12">
//       <Card className="w-full max-w-4xl shadow-lg">
//         {" "}
//         {/* Added shadow */}
//         <CardHeader className="space-y-2 text-center">
//           {" "}
//           {/* Adjusted spacing */}
//           <CardTitle className="text-4xl font-extrabold tracking-tight text-gray-900">Admin Dashboard</CardTitle>{" "}
//           {/* Larger, bolder title */}
//           <CardDescription className="text-lg text-gray-600">
//             Welcome, Administrator! Manage your store's content here.
//           </CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-10">
//           {" "}
//           {/* Increased spacing */}
//           <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
//             {" "}
//             {/* Increased gap */}
//             {/* Product Management */}
//             <Card className="p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
//               {" "}
//               {/* Added hover effects */}
//               <Package className="mx-auto h-12 w-12 text-indigo-600 mb-4" /> {/* Icon for Products */}
//               <h3 className="text-xl font-semibold mb-2">Product Management</h3>
//               <p className="text-gray-600 text-sm mb-4">Add, edit, or remove products from your catalog.</p>
//               <Button className="w-full bg-black text-white hover:bg-gray-800" asChild>
//                 <Link href="/admin/products">Manage Products</Link>
//               </Button>
//             </Card>
//             {/* Order Management */}
//             <Card className="p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
//               {" "}
//               {/* Added hover effects */}
//               <ShoppingCart className="mx-auto h-12 w-12 text-green-600 mb-4" /> {/* Icon for Orders */}
//               <h3 className="text-xl font-semibold mb-2">Order Management</h3>
//               <p className="text-gray-600 text-sm mb-4">View and process customer orders.</p>
//               <Button className="w-full bg-black text-white hover:bg-gray-800" asChild>
//                 <Link href="/admin/orders">View Orders</Link>
//               </Button>
//             </Card>
//             {/* Data Analytics */}
//             <Card className="p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl">
//               {" "}
//               {/* Added hover effects */}
//               <BarChart className="mx-auto h-12 w-12 text-blue-600 mb-4" /> {/* Icon for Analytics */}
//               <h3 className="text-xl font-semibold mb-2">Data Analytics</h3>
//               <p className="text-gray-600 text-sm mb-4">Monitor website performance and user interactions.</p>
//               <Button className="w-full bg-black text-white hover:bg-gray-800" asChild>
//                 <Link href="/admin/analytics">View Analytics</Link>
//               </Button>
//             </Card>
//           </div>
//           <Separator className="my-8" /> {/* Added margin */}
//           <div className="flex justify-center">
//             <Button
//               variant="outline"
//               className="border-black text-black hover:bg-black hover:text-white bg-transparent flex items-center gap-2 px-6 py-3" // Added icon and padding
//               onClick={handleLogout}
//             >
//               <LogOut className="h-4 w-4" /> Logout
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
