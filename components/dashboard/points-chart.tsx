"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ChartData {
  date: string
  points: number
  cumulative: number
}

export function PointsChart() {
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    // Mock chart data - replace with actual API call
    const mockData = [
      { date: "2024-01-01", points: 50, cumulative: 50 },
      { date: "2024-01-02", points: 75, cumulative: 125 },
      { date: "2024-01-03", points: 100, cumulative: 225 },
      { date: "2024-01-04", points: 25, cumulative: 250 },
      { date: "2024-01-05", points: 150, cumulative: 400 },
      { date: "2024-01-06", points: 80, cumulative: 480 },
      { date: "2024-01-07", points: 120, cumulative: 600 },
    ]
    setChartData(mockData)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Points Progress</CardTitle>
        <p className="text-sm text-muted-foreground">Your recycling impact over the last 7 days</p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-muted-foreground"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis className="text-muted-foreground" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
