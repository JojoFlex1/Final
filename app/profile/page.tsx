"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Camera, Save, Wallet, Award, TrendingUp, Calendar, MapPin, Phone, Mail } from "lucide-react"

interface UserProfile {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  dateOfBirth?: string
  address?: string
  city?: string
  country?: string
  postalCode?: string
  profilePictureUrl?: string
  walletAddress: string
  totalPoints: number
  lifetimePoints: number
  rank: number
  totalSubmissions: number
  joinedDate: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Mock profile data - replace with actual API call
    setProfile({
      id: 1,
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phoneNumber: "+1 (555) 123-4567",
      dateOfBirth: "1990-05-15",
      address: "123 Green Street",
      city: "San Francisco",
      country: "United States",
      postalCode: "94102",
      walletAddress: "addr_test1qz8p8rp4cvmnepjhh53j3ewqzsfmu4r3lcpyqpen4cpt4jc...",
      totalPoints: 1250,
      lifetimePoints: 3420,
      rank: 15,
      totalSubmissions: 47,
      joinedDate: "2024-01-15",
    })
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    // Mock save - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setIsEditing(false)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && profile) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfile({
          ...profile,
          profilePictureUrl: e.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div>Loading profile...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-balance">Profile</h1>
          <p className="text-muted-foreground">Manage your account and view your eco-impact</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="wallet" className="gap-2">
                <Wallet className="h-4 w-4" />
                Wallet
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profile.profilePictureUrl || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                          {profile.firstName[0]}
                          {profile.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <div className="absolute -bottom-2 -right-2">
                          <Label htmlFor="avatar-upload">
                            <Button size="sm" className="rounded-full w-8 h-8 p-0" asChild>
                              <span>
                                <Camera className="h-4 w-4" />
                              </span>
                            </Button>
                          </Label>
                          <Input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-2xl font-bold">
                          {profile.firstName} {profile.lastName}
                        </h2>
                        <Badge className="bg-primary/10 text-primary border-primary/20">Rank #{profile.rank}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">@{profile.username}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined {new Date(profile.joinedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          {profile.totalSubmissions} submissions
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} className="gap-2">
                          <User className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent">
                            Cancel
                          </Button>
                          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                            <Save className="h-4 w-4" />
                            {isSaving ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={profile.phoneNumber || ""}
                          onChange={(e) => setProfile({ ...profile, phoneNumber: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={profile.dateOfBirth || ""}
                        onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Address Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="address"
                          value={profile.address || ""}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profile.city || ""}
                          onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={profile.postalCode || ""}
                          onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={profile.country || ""}
                        onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 mx-auto text-primary mb-2" />
                    <div className="text-2xl font-bold text-primary">{profile.totalPoints.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Current Points</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="h-8 w-8 mx-auto text-accent mb-2" />
                    <div className="text-2xl font-bold text-accent">{profile.lifetimePoints.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Lifetime Points</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6 text-center">
                    <User className="h-8 w-8 mx-auto text-chart-2 mb-2" />
                    <div className="text-2xl font-bold text-chart-2">#{profile.rank}</div>
                    <div className="text-sm text-muted-foreground">Global Rank</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Environmental Impact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Items Recycled</span>
                    <span className="font-semibold">{profile.totalSubmissions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>CO₂ Saved (estimated)</span>
                    <span className="font-semibold">{(profile.totalSubmissions * 2.3).toFixed(1)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Waste Diverted from Landfills</span>
                    <span className="font-semibold">{(profile.totalSubmissions * 0.8).toFixed(1)} kg</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wallet" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Cardano Wallet
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Wallet Address</Label>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">{profile.walletAddress}</code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(profile.walletAddress)}
                        className="bg-transparent"
                      >
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Network</Label>
                      <div className="p-2 bg-muted rounded text-sm">Cardano Preprod</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Badge className="bg-primary/10 text-primary border-primary/20">Connected</Badge>
                    </div>
                  </div>

                  <Button className="w-full gap-2" onClick={() => (window.location.href = "/wallet")}>
                    <Wallet className="h-4 w-4" />
                    Manage Wallet
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
