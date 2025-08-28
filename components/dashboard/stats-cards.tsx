"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Smartphone, TrendingUp, Calendar } from "lucide-react"

interface Stats {
  totalSubmissions: number
  thisMonthSubmissions: number
  totalPoints: number
  thisMonthPoints: number
  favoriteWasteType: string
  streak: number
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    // Mock stats data - replace with actual API call
    setStats({
      totalSubmissions: 47,
      thisMonthSubmissions: 12,
      totalPoints: 1250,
      thisMonthPoints: 340,
      favoriteWasteType: "Smartphones",
      streak: 7,
    })
  }, [])

  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-primary/20 hover:border-primary/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Recycled</CardTitle>
          <Recycle className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{stats.totalSubmissions}</div>
          <p className="text-xs text-muted-foreground">+{stats.thisMonthSubmissions} this month</p>
        </CardContent>
      </Card>

      <Card className="border-accent/20 hover:border-accent/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
          <TrendingUp className="h-4 w-4 text-accent" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent">{stats.totalPoints.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+{stats.thisMonthPoints} this month</p>
        </CardContent>
      </Card>

      <Card className="border-chart-2/20 hover:border-chart-2/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favorite Item</CardTitle>
          <Smartphone className="h-4 w-4 text-chart-2" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-2">{stats.favoriteWasteType}</div>
          <p className="text-xs text-muted-foreground">Most recycled category</p>
        </CardContent>
      </Card>

      <Card className="border-chart-3/20 hover:border-chart-3/40 transition-colors">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          <Calendar className="h-4 w-4 text-chart-3" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-chart-3">{stats.streak} days</div>
          <p className="text-xs text-muted-foreground">Keep it going!</p>
        </CardContent>
      </Card>
    </div>
  )
}
