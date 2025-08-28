"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { createBrowserClient } from "@/lib/supabase/client"

interface RedeemPointsProps {
  onBack: () => void
  userPoints: number
}

const REDEMPTION_OPTIONS = [
  { points: 100, reward: "1 ADA", value: 1 },
  { points: 500, reward: "5 ADA", value: 5 },
  { points: 1000, reward: "10 ADA + Bonus", value: 12 },
  { points: 2500, reward: "25 ADA + Bonus", value: 30 },
]

export function RedeemPoints({ onBack, userPoints }: RedeemPointsProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [customPoints, setCustomPoints] = useState("")
  const [loading, setLoading] = useState(false)
  const supabase = createBrowserClient()

  const handleRedeem = async () => {
    const pointsToRedeem = selectedOption || Number.parseInt(customPoints)

    if (!pointsToRedeem || pointsToRedeem <= 0) {
      toast({
        title: "Error",
        description: "Please select a valid redemption amount",
        variant: "destructive",
      })
      return
    }

    if (pointsToRedeem > userPoints) {
      toast({
        title: "Error",
        description: "Insufficient points",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Create redemption transaction
      const { error } = await supabase.from("point_transactions").insert({
        user_id: user.id,
        points: -pointsToRedeem,
        transaction_type: "redeemed",
        description: `Redeemed ${pointsToRedeem} points for tokens`,
      })

      if (error) throw error

      toast({
        title: "Success!",
        description: `Redeemed ${pointsToRedeem} points successfully`,
      })

      setSelectedOption(null)
      setCustomPoints("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to redeem points",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-emerald-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <CardTitle className="text-emerald-800">Redeem Points</CardTitle>
            <CardDescription>Convert your points to ADA tokens</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-emerald-50 p-3 rounded-lg">
          <p className="text-sm text-emerald-700">
            <strong>Available Points:</strong> {userPoints.toLocaleString()}
          </p>
        </div>

        <div className="space-y-3">
          <Label>Redemption Options</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {REDEMPTION_OPTIONS.map((option) => (
              <Button
                key={option.points}
                variant={selectedOption === option.points ? "default" : "outline"}
                className={`p-4 h-auto flex-col ${
                  selectedOption === option.points ? "bg-emerald-600 hover:bg-emerald-700" : "border-emerald-200"
                }`}
                onClick={() => {
                  setSelectedOption(option.points)
                  setCustomPoints("")
                }}
                disabled={option.points > userPoints}
              >
                <div className="font-semibold">{option.points} Points</div>
                <div className="text-sm opacity-80">{option.reward}</div>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom">Custom Amount</Label>
          <Input
            id="custom"
            type="number"
            placeholder="Enter points to redeem"
            value={customPoints}
            onChange={(e) => {
              setCustomPoints(e.target.value)
              setSelectedOption(null)
            }}
            max={userPoints}
          />
        </div>

        <Button
          onClick={handleRedeem}
          disabled={loading || (!selectedOption && !customPoints)}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          {loading ? (
            "Processing..."
          ) : (
            <>
              <Gift className="w-4 h-4 mr-2" />
              Redeem Points
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
