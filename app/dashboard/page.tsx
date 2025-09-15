"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Send, QrCode, MapPin, LogOut, Gift } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { SendTokens } from "@/components/wallet/send-tokens"
import { ReceiveTokens } from "@/components/wallet/receive-tokens"
import { RedeemPoints } from "@/components/wallet/redeem-points"
import { LocationManager } from "@/components/location/location-manager"

interface UserProfile {
  id: string
  username: string
  first_name: string
  last_name: string
  total_points: number
  wallet_address: string
  location: string
}

interface PointTransaction {
  id: string
  points: number
  transaction_type: "earned" | "redeemed" | "bonus"
  description: string
  created_at: string
}

type ActiveModal = "send" | "receive" | "redeem" | "location" | null

export default function Dashboard() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [transactions, setTransactions] = useState<PointTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeModal, setActiveModal] = useState<ActiveModal>(null)
  const supabase = createClient()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Load user profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile(profileData)
      }

      // Load recent transactions
      const { data: transactionData } = await supabase
        .from("point_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (transactionData) {
        setTransactions(transactionData)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const copyWalletAddress = () => {
    if (profile?.wallet_address) {
      navigator.clipboard.writeText(profile.wallet_address)
      toast({
        title: "Copied!",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/auth/login"
  }

  const renderModal = () => {
    switch (activeModal) {
      case "send":
        return <SendTokens onBack={() => setActiveModal(null)} />
      case "receive":
        return <ReceiveTokens onBack={() => setActiveModal(null)} />
      case "redeem":
        return <RedeemPoints onBack={() => setActiveModal(null)} userPoints={profile?.total_points || 0} />
      case "location":
        return <LocationManager onBack={() => setActiveModal(null)} />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (activeModal) {
    return <div className="container mx-auto p-6">{renderModal()}</div>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header with logout */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-emerald-900">
            Welcome back, {profile?.first_name || profile?.username}!
          </h1>
          <p className="text-emerald-600">Track your e-waste impact and earn rewards</p>
        </div>
        <Button onClick={handleLogout} variant="outline" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Total Points
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{profile?.total_points?.toLocaleString() || 0}</div>
            <p className="text-sm text-emerald-600 mt-1">Available to redeem</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <QrCode className="w-5 h-5" />
              Wallet Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm font-mono bg-emerald-50 p-2 rounded border">
                {profile?.wallet_address
                  ? `${profile.wallet_address.slice(0, 20)}...${profile.wallet_address.slice(-10)}`
                  : "Not generated"}
              </div>
              <Button onClick={copyWalletAddress} size="sm" variant="outline" disabled={!profile?.wallet_address}>
                <Copy className="w-4 h-4 mr-2" />
                Copy Address
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-emerald-800 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-emerald-700">{profile?.location || "Location not set"}</div>
            <Button
              size="sm"
              variant="outline"
              className="mt-2 bg-transparent"
              onClick={() => setActiveModal("location")}
            >
              Update Location
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Actions */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800">Wallet Actions</CardTitle>
          <CardDescription>Manage your tokens and points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setActiveModal("send")}>
              <Send className="w-4 h-4 mr-2" />
              Send Tokens
            </Button>
            <Button
              variant="outline"
              className="border-emerald-200 bg-transparent"
              onClick={() => setActiveModal("receive")}
            >
              <QrCode className="w-4 h-4 mr-2" />
              Receive Tokens
            </Button>
            <Button
              variant="outline"
              className="border-emerald-200 bg-transparent"
              onClick={() => setActiveModal("redeem")}
            >
              <Gift className="w-4 h-4 mr-2" />
              Redeem Points
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800">Recent Activity</CardTitle>
          <CardDescription>Your latest point transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        transaction.transaction_type === "earned"
                          ? "bg-green-500"
                          : transaction.transaction_type === "redeemed"
                            ? "bg-red-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium text-emerald-900">{transaction.description}</p>
                      <p className="text-sm text-emerald-600">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={transaction.transaction_type === "earned" ? "default" : "secondary"}>
                      {transaction.transaction_type === "earned" ? "+" : "-"}
                      {Math.abs(transaction.points)}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-emerald-600 text-center py-4">No transactions yet. Start recycling to earn points!</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Smart Contract Info */}
      <Card className="border-emerald-200">
        <CardHeader>
          <CardTitle className="text-emerald-800">Smart Contract</CardTitle>
          <CardDescription>Cardano treasury contract details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Contract Address:</span>
            </div>
            <div className="text-sm font-mono bg-emerald-50 p-2 rounded border">
              addr_test1wqcqmla9wesptmhdpgw7gwzv62z320fhwfvay8x0xnp3vssphd9l5
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText("addr_test1wqcqmla9wesptmhdpgw7gwzv62z320fhwfvay8x0xnp3vssphd9l5")
                toast({ title: "Copied!", description: "Contract address copied to clipboard" })
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Contract Address
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
