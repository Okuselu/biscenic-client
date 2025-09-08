"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Eye, ShoppingBag } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useState, useEffect, useCallback } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Define types for the fetched data
interface SummaryData {
  totalRevenue: number
  totalOrders: number
  uniqueVisitors: number
  totalPageViews: number
  conversionRate: number
  averageOrderValue: number
}

interface DailyTrend {
  date: string
  revenue: number
  visitors: number
}

interface PopularProduct {
  name: string
  sales: number
  views: number
  category: string
  conversionRate: number
  averageTimeOnPage: number
}

interface MonthlyTrend {
  month: string
  sales: number
  clicks: number
}

interface AnalyticsData {
  summary: SummaryData
  dailyTrends: DailyTrend[]
  popularProducts: PopularProduct[]
  monthlyTrends: MonthlyTrend[]
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState("30d") // Default time range
  const [productCategoryFilter, setProductCategoryFilter] = useState("all") // Default product category filter

  const fetchAnalyticsData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        timeRange: timeRange,
        productCategory: productCategoryFilter,
      }).toString()
      const response = await fetch(`/api/analytics?${params}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: AnalyticsData = await response.json()
      setAnalyticsData(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [timeRange, productCategoryFilter])

  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">Loading analytics data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-red-500">Error loading data: {error}</p>
      </div>
    )
  }

  // Destructure data for easier access
  const { summary, dailyTrends, popularProducts, monthlyTrends } = analyticsData!

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 px-4 py-12">
      <Card className="w-full max-w-6xl shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold tracking-wide">Website Analytics</CardTitle>
          <CardDescription>Monitor key performance indicators and user interactions.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4 justify-end items-center">
            {" "}
            {/* Centered items */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Time Range:</span> {/* Styled label */}
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px] border-gray-300 focus:border-black">
                  {" "}
                  {/* Refined trigger style */}
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Product Category:</span> {/* Styled label */}
              <Select value={productCategoryFilter} onValueChange={setProductCategoryFilter}>
                <SelectTrigger className="w-[180px] border-gray-300 focus:border-black">
                  {" "}
                  {/* Refined trigger style */}
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="bags">Bags</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="clothing">Clothing</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-6 text-center shadow-sm">
              {" "}
              {/* Added shadow */}
              <DollarSign className="mx-auto h-8 w-8 text-green-600 mb-3" />
              <h3 className="text-xl font-semibold mb-1">Total Revenue</h3>
              <p className="text-2xl font-bold text-gray-800">${summary.totalRevenue.toLocaleString()}</p>{" "}
              {/* Darker text */}
            </Card>
            <Card className="p-6 text-center shadow-sm">
              <ShoppingBag className="mx-auto h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-xl font-semibold mb-1">Total Orders</h3>
              <p className="text-2xl font-bold text-gray-800">{summary.totalOrders.toLocaleString()}</p>
            </Card>
            <Card className="p-6 text-center shadow-sm">
              <Users className="mx-auto h-8 w-8 text-purple-600 mb-3" />
              <h3 className="text-xl font-semibold mb-1">Unique Visitors</h3>
              <p className="text-2xl font-bold text-gray-800">{summary.uniqueVisitors.toLocaleString()}</p>
            </Card>
            <Card className="p-6 text-center shadow-sm">
              <Eye className="mx-auto h-8 w-8 text-orange-600 mb-3" />
              <h3 className="text-xl font-semibold mb-1">Total Page Views</h3>
              <p className="text-2xl font-bold text-gray-800">{summary.totalPageViews.toLocaleString()}</p>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="p-6 text-center shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Conversion Rate</h3>
              <p className="text-2xl font-bold text-green-700">{summary.conversionRate.toFixed(2)}%</p>
              <CardDescription>Percentage of visitors who made a purchase.</CardDescription>
            </Card>
            <Card className="p-6 text-center shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Average Order Value</h3>
              <p className="text-2xl font-bold text-blue-700">${summary.averageOrderValue.toFixed(2)}</p>
              <CardDescription>Average amount spent per order.</CardDescription>
            </Card>
          </div>

          {/* Revenue and Visitors Trend Line Chart */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-center">Daily Revenue & Visitors Trend</h3>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "hsl(var(--chart-1))",
                },
                visitors: {
                  label: "Visitors",
                  color: "hsl(var(--chart-2))",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" stroke="var(--color-revenue)" />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--color-visitors)" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="var(--color-revenue)" name="Revenue" />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="visitors"
                    stroke="var(--color-visitors)"
                    name="Visitors"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>

          {/* Popular Products Sales & Clicks Bar Chart */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-center">Popular Products: Sales vs. Clicks</h3>
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  color: "hsl(var(--chart-3))",
                },
                views: {
                  label: "Clicks (Views)",
                  color: "hsl(var(--chart-4))",
                },
              }}
              className="h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularProducts} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} height={50} />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="sales" fill="var(--color-sales)" name="Units Sold" />
                  <Bar dataKey="views" fill="var(--color-views)" name="Clicks (Views)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Card>

          {/* Product Performance Table */}
          <Card className="p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-center">Product Performance Details</h3>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Sales</TableHead>
                    <TableHead className="text-right">Clicks (Views)</TableHead>
                    <TableHead className="text-right">Conversion Rate</TableHead>
                    <TableHead className="text-right">Avg. Time on Page (s)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {popularProducts.map((product) => (
                    <TableRow key={product.name} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.sales}</TableCell>
                      <TableCell className="text-right">{product.views}</TableCell>
                      <TableCell className="text-right font-semibold text-green-700">
                        {product.conversionRate.toFixed(2)}%
                      </TableCell>{" "}
                      {/* Highlighted conversion rate */}
                      <TableCell className="text-right">{product.averageTimeOnPage}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {popularProducts.length === 0 && (
              <p className="text-center text-gray-500 mt-4">No product data available for the selected filters.</p>
            )}
          </Card>

          {/* Monthly Sales and Clicks Trend Line Chart */}
          {monthlyTrends.length > 0 && (
            <Card className="p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-center">Monthly Sales & Clicks Trend</h3>
              <ChartContainer
                config={{
                  sales: {
                    label: "Sales",
                    color: "hsl(var(--chart-1))",
                  },
                  clicks: {
                    label: "Clicks",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrends} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" stroke="var(--color-sales)" />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--color-clicks)" />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="sales" stroke="var(--color-sales)" name="Sales" />
                    <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="var(--color-clicks)" name="Clicks" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
