"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, TrendingUp, Share2, Home, Upload } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"

interface SubmissionSuccessProps {
  points: number
  wasteType: string
  binLocation: string
  transactionHash?: string
}

export function SubmissionSuccess({ points, wasteType, binLocation, transactionHash }: SubmissionSuccessProps) {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    // Trigger confetti animation
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#059669", "#10b981", "#84cc16"],
      })
      setShowConfetti(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const shareText = `I just recycled my ${wasteType} and earned ${points} points on RELOOP! 🌱 Join me in making a difference for our planet. #EcoWarrior #Sustainability`

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "RELOOP - E-Waste Recycled!",
          text: shareText,
          url: window.location.origin,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-primary/20">
        <CardContent className="p-8 text-center space-y-6">
          {/* Success Icon */}
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            {showConfetti && (
              <div className="absolute -top-2 -right-2">
                <div className="w-6 h-6 rounded-full bg-accent animate-bounce">
                  <TrendingUp className="h-4 w-4 text-white m-1" />
                </div>
              </div>
            )}
          </div>

          {/* Success Message */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-primary">Submission Successful!</h1>
            <p className="text-muted-foreground">
              Your e-waste has been recorded and you've earned points for your eco-friendly action.
            </p>
          </div>

          {/* Points Earned */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-lg font-semibold">Points Earned</span>
            </div>
            <div className="text-3xl font-bold text-primary">+{points}</div>
          </div>

          {/* Submission Details */}
          <div className="space-y-3 text-left">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Item Type:</span>
              <Badge variant="secondary">{wasteType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Location:</span>
              <span className="text-sm font-medium">{binLocation}</span>
            </div>
            {transactionHash && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Transaction:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  {transactionHash.slice(0, 8)}...{transactionHash.slice(-8)}
                </code>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={handleShare} variant="outline" className="w-full gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share Your Impact
            </Button>

            <div className="flex gap-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Home className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/submit" className="flex-1">
                <Button className="w-full gap-2">
                  <Upload className="h-4 w-4" />
                  Submit More
                </Button>
              </Link>
            </div>
          </div>

          {/* Environmental Impact */}
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-1">🌱 Environmental Impact</p>
            <p className="text-muted-foreground">
              You've helped divert approximately {(points * 0.02).toFixed(1)}kg of e-waste from landfills and saved an
              estimated {(points * 0.05).toFixed(1)}kg of CO₂ emissions!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
