"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Award, TrendingUp, Recycle, Calendar } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  userId: number
  username: string
  firstName: string
  lastName: string
  lifetimePoints: number
  totalPoints: number
  monthlyPoints?: number
  weeklyPoints?: number
  totalSubmissions?: number
  profilePictureUrl?: string
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null)

  useEffect(() => {
    // Mock leaderboard data - replace with actual API call
    setLeaderboard([
      {
        rank: 1,
        userId: 1,
        username: "ecowarrior",
        firstName: "Sarah",
        lastName: "Chen",
        lifetimePoints: 15420,
        totalPoints: 15420,
        monthlyPoints: 2340,
        weeklyPoints: 580,
        totalSubmissions: 127,
      },
      {
        rank: 2,
        userId: 2,
        username: "greentech",
        firstName: "Mike",
        lastName: "Johnson",
        lifetimePoints: 12890,
        totalPoints: 12890,
        monthlyPoints: 1890,
        weeklyPoints: 420,
        totalSubmissions: 98,
      },
      {
        rank: 3,
        userId: 3,
        username: "recyclepro",
        firstName: "Emma",
        lastName: "Davis",
        lifetimePoints: 11250,
        totalPoints: 11250,
        monthlyPoints: 1650,
        weeklyPoints: 380,
        totalSubmissions: 89,
      },
      {
        rank: 4,
        userId: 4,
        username: "sustainableme",
        firstName: "Alex",
        lastName: "Wilson",
        lifetimePoints: 9870,
        totalPoints: 9870,
        monthlyPoints: 1420,
        weeklyPoints: 320,
        totalSubmissions: 76,
      },
      {
        rank: 5,
        userId: 5,
        username: "planetfirst",
        firstName: "Lisa",
        lastName: "Brown",
        lifetimePoints: 8640,
        totalPoints: 8640,
        monthlyPoints: 1280,
        weeklyPoints: 290,
        totalSubmissions: 67,
      },
    ])

    // Mock current user data
    setCurrentUser({
      rank: 15,
      userId: 6,
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      lifetimePoints: 3420,
      totalPoints: 1250,
      monthlyPoints: 340,
      weeklyPoints: 85,
      totalSubmissions: 47,
    })
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankBadge = (rank: number) => {
    if (rank <= 3) {
      return <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0">Top {rank}</Badge>
    }
    if (rank <= 10) {
      return <Badge className="bg-primary/10 text-primary border-primary/20">Top 10</Badge>
    }
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-balance">Leaderboard</h1>
          <p className="text-muted-foreground">See how you rank among eco-champions worldwide</p>
        </div>

        {/* Current User Stats */}
        {currentUser && (
          <Card className="max-w-2xl mx-auto border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10">
                  {getRankIcon(currentUser.rank)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">Your Ranking</h3>
                    {getRankBadge(currentUser.rank)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {currentUser.firstName} {currentUser.lastName} • @{currentUser.username}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{currentUser.totalPoints.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Current Points</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard Tabs */}
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="all-time" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all-time" className="gap-2">
                <Trophy className="h-4 w-4" />
                All Time
              </TabsTrigger>
              <TabsTrigger value="monthly" className="gap-2">
                <Calendar className="h-4 w-4" />
                This Month
              </TabsTrigger>
              <TabsTrigger value="weekly" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                This Week
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all-time" className="space-y-4">
              {leaderboard.map((entry, index) => (
                <Card key={entry.userId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12">{getRankIcon(entry.rank)}</div>

                      <Avatar className="h-12 w-12">
                        <AvatarImage src={entry.profilePictureUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {entry.firstName[0]}
                          {entry.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {entry.firstName} {entry.lastName}
                          </h3>
                          {getRankBadge(entry.rank)}
                        </div>
                        <p className="text-sm text-muted-foreground">@{entry.username}</p>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="text-xl font-bold text-primary">{entry.lifetimePoints.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">lifetime points</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Recycle className="h-3 w-3" />
                          {entry.totalSubmissions} items
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="monthly" className="space-y-4">
              {leaderboard.map((entry, index) => (
                <Card key={entry.userId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12">{getRankIcon(index + 1)}</div>

                      <Avatar className="h-12 w-12">
                        <AvatarImage src={entry.profilePictureUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {entry.firstName[0]}
                          {entry.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {entry.firstName} {entry.lastName}
                          </h3>
                          {getRankBadge(index + 1)}
                        </div>
                        <p className="text-sm text-muted-foreground">@{entry.username}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{entry.monthlyPoints?.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">this month</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="weekly" className="space-y-4">
              {leaderboard.map((entry, index) => (
                <Card key={entry.userId} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12">{getRankIcon(index + 1)}</div>

                      <Avatar className="h-12 w-12">
                        <AvatarImage src={entry.profilePictureUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {entry.firstName[0]}
                          {entry.lastName[0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {entry.firstName} {entry.lastName}
                          </h3>
                          {getRankBadge(index + 1)}
                        </div>
                        <p className="text-sm text-muted-foreground">@{entry.username}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-primary">{entry.weeklyPoints?.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">this week</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
