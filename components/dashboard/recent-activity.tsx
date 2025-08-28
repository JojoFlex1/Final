"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Laptop, Battery, Award, Clock } from "lucide-react"

interface Activity {
  id: number
  type: "submission" | "reward"
  wasteType?: string
  points: number
  location: string
  timestamp: string
  status: "pending" | "verified" | "rejected"
}

const wasteIcons = {
  smartphone: Smartphone,
  laptop: Laptop,
  battery: Battery,
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Mock activity data - replace with actual API call
    setActivities([
      {
        id: 1,
        type: "submission",
        wasteType: "smartphone",
        points: 75,
        location: "Downtown Electronics Center",
        timestamp: "2024-01-07T10:30:00Z",
        status: "verified",
      },
      {
        id: 2,
        type: "submission",
        wasteType: "laptop",
        points: 150,
        location: "University Campus - Tech Building",
        timestamp: "2024-01-06T14:15:00Z",
        status: "pending",
      },
      {
        id: 3,
        type: "reward",
        points: 50,
        location: "Weekly Bonus",
        timestamp: "2024-01-05T09:00:00Z",
        status: "verified",
      },
      {
        id: 4,
        type: "submission",
        wasteType: "battery",
        points: 100,
        location: "Community Center - Battery Drop",
        timestamp: "2024-01-04T16:45:00Z",
        status: "verified",
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-primary/10 text-primary border-primary/20"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "rejected":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        <p className="text-sm text-muted-foreground">Your latest recycling submissions and rewards</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = activity.wasteType ? wasteIcons[activity.wasteType as keyof typeof wasteIcons] : Award

            return (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium truncate">
                      {activity.type === "submission"
                        ? `Recycled ${activity.wasteType?.replace("_", " ")}`
                        : "Bonus Reward"}
                    </p>
                    <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{activity.location}</p>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-primary">+{activity.points} pts</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
