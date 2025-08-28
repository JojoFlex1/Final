"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Leaf, Award, TrendingUp } from "lucide-react"

interface UserProfile {
  firstName: string
  lastName: string
  username: string
  profilePictureUrl?: string
  totalPoints: number
  lifetimePoints: number
  rank: number
}

export function DashboardHeader() {
  const [user, setUser] = useState<UserProfile | null>(null)

  useEffect(() => {
    // Mock user data - replace with actual API call
    setUser({
      firstName: "John",
      lastName: "Doe",
      username: "johndoe",
      totalPoints: 1250,
      lifetimePoints: 3420,
      rank: 15,
    })
  }, [])

  if (!user) return null

  return (
    <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={user.profilePictureUrl || "/placeholder.svg"} alt={user.firstName} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {user.firstName[0]}
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-balance">Welcome back, {user.firstName}!</h1>
              <p className="text-muted-foreground">Keep up the great work recycling e-waste</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="flex items-center gap-1 text-primary">
                <Leaf className="h-4 w-4" />
                <span className="text-2xl font-bold">{user.totalPoints.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">Current Points</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1 text-accent">
                <Award className="h-4 w-4" />
                <span className="text-2xl font-bold">#{user.rank}</span>
              </div>
              <p className="text-sm text-muted-foreground">Global Rank</p>
            </div>

            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <TrendingUp className="h-3 w-3 mr-1" />
              Eco Champion
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
