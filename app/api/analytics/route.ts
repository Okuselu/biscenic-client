import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const timeRange = searchParams.get("timeRange") || "all" // Default to 'all'
  const productCategory = searchParams.get("productCategory") || "all" // Default to 'all'

  // Simulate fetching data from a database or external service
  await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

  const allDailyTrends = [
    { date: "Jul 1", revenue: 1250, visitors: 160 },
    { date: "Jul 2", revenue: 1550, visitors: 190 },
    { date: "Jul 3", revenue: 1400, visitors: 170 },
    { date: "Jul 4", revenue: 1900, visitors: 230 },
    { date: "Jul 5", revenue: 1650, visitors: 210 },
    { date: "Jul 6", revenue: 2100, visitors: 260 },
    { date: "Jul 7", revenue: 1800, visitors: 220 },
    { date: "Jul 8", revenue: 1950, visitors: 240 },
    { date: "Jul 9", revenue: 2200, visitors: 270 },
    { date: "Jul 10", revenue: 2000, visitors: 250 },
    { date: "Jul 11", revenue: 2100, visitors: 260 },
    { date: "Jul 12", revenue: 2300, visitors: 280 },
    { date: "Jul 13", revenue: 2400, visitors: 290 },
    { date: "Jul 14", revenue: 2500, visitors: 300 },
    { date: "Jul 15", revenue: 2600, visitors: 310 },
    { date: "Jul 16", revenue: 2700, visitors: 320 },
    { date: "Jul 17", revenue: 2800, visitors: 330 },
    { date: "Jul 18", revenue: 2900, visitors: 340 },
    { date: "Jul 19", revenue: 3000, visitors: 350 },
    { date: "Jul 20", revenue: 3100, visitors: 360 },
    { date: "Jul 21", revenue: 3200, visitors: 370 },
    { date: "Jul 22", revenue: 3300, visitors: 380 },
    { date: "Jul 23", revenue: 3400, visitors: 390 },
    { date: "Jul 24", revenue: 3500, visitors: 400 },
    { date: "Jul 25", revenue: 3600, visitors: 410 },
    { date: "Jul 26", revenue: 3700, visitors: 420 },
    { date: "Jul 27", revenue: 3800, visitors: 430 },
    { date: "Jul 28", revenue: 3900, visitors: 440 },
    { date: "Jul 29", revenue: 4000, visitors: 450 },
    { date: "Jul 30", revenue: 4100, visitors: 460 },
  ]

  const allMonthlyTrends = [
    { month: "Jan", sales: 16000, clicks: 52000 },
    { month: "Feb", sales: 19000, clicks: 57000 },
    { month: "Mar", sales: 23000, clicks: 67000 },
    { month: "Apr", sales: 20000, clicks: 62000 },
    { month: "May", sales: 26000, clicks: 72000 },
    { month: "Jun", sales: 29000, clicks: 77000 },
    { month: "Jul", sales: 27000, clicks: 74000 },
    { month: "Aug", sales: 30000, clicks: 80000 },
    { month: "Sep", sales: 28000, clicks: 75000 },
    { month: "Oct", sales: 32000, clicks: 85000 },
    { month: "Nov", sales: 35000, clicks: 90000 },
    { month: "Dec", sales: 40000, clicks: 100000 },
  ]

  const allPopularProducts = [
    {
      name: "Triple S Sneaker",
      sales: 135,
      views: 1650,
      category: "shoes",
      conversionRate: 8.2,
      averageTimeOnPage: 120,
    },
    { name: "City Bag Small", sales: 100, views: 1350, category: "bags", conversionRate: 7.4, averageTimeOnPage: 150 },
    {
      name: "Oversized Blazer",
      sales: 55,
      views: 850,
      category: "clothing",
      conversionRate: 6.5,
      averageTimeOnPage: 90,
    },
    { name: "Le Cagole Bag", sales: 80, views: 1200, category: "bags", conversionRate: 6.7, averageTimeOnPage: 130 },
    { name: "Track Sneaker", sales: 65, views: 1000, category: "shoes", conversionRate: 6.5, averageTimeOnPage: 110 },
    {
      name: "Hourglass Coat",
      sales: 40,
      views: 700,
      category: "clothing",
      conversionRate: 5.7,
      averageTimeOnPage: 100,
    },
  ]

  let filteredDailyTrends = allDailyTrends
  let filteredMonthlyTrends = allMonthlyTrends
  let filteredPopularProducts = allPopularProducts

  // Apply time range filter
  if (timeRange === "7d") {
    filteredDailyTrends = allDailyTrends.slice(-7)
    filteredMonthlyTrends = [] // Monthly data not relevant for 7 days
  } else if (timeRange === "30d") {
    filteredDailyTrends = allDailyTrends.slice(-30)
    filteredMonthlyTrends = [] // Monthly data not relevant for 30 days
  }
  // 'all' means no slice, use full data

  // Apply product category filter
  if (productCategory !== "all") {
    filteredPopularProducts = allPopularProducts.filter((product) => product.category === productCategory)
  }

  // Recalculate summary based on filtered data (simplified for daily trends)
  const totalRevenue = filteredDailyTrends.reduce((sum, item) => sum + item.revenue, 0)
  const uniqueVisitors = filteredDailyTrends.reduce((sum, item) => sum + item.visitors, 0)
  const totalOrders = Math.floor(totalRevenue / 200) // Dummy calculation
  const totalPageViews = uniqueVisitors * 5 // Dummy calculation
  const conversionRate = uniqueVisitors > 0 ? (totalOrders / uniqueVisitors) * 100 : 0
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const analyticsData = {
    summary: {
      totalRevenue: totalRevenue,
      totalOrders: totalOrders,
      uniqueVisitors: uniqueVisitors,
      totalPageViews: totalPageViews,
      conversionRate: conversionRate,
      averageOrderValue: averageOrderValue,
    },
    dailyTrends: filteredDailyTrends,
    popularProducts: filteredPopularProducts,
    monthlyTrends: filteredMonthlyTrends,
  }

  return NextResponse.json(analyticsData)
}
